/**
 * Sales tax estimation for the buyer-side price breakdown.
 *
 * IMPORTANT: This is the DEMO implementation. It produces a rough
 * estimate using US ZIP → state mapping and per-state combined rates.
 * It is NOT used to actually charge tax at checkout — the marketplace
 * facilitator (Artkindred) must use a compliant tax calculation service
 * (e.g. Stripe Tax, TaxJar, Avalara) at the actual point of sale.
 *
 * TO SWAP THIS WITH A REAL TAX SERVICE LATER:
 *   1. Keep `estimateSalesTax` exported with the same signature.
 *   2. Replace the function body with a call to the chosen service.
 *      Stripe Tax example:
 *
 *      const calc = await stripe.tax.calculations.create({
 *        currency: 'usd',
 *        line_items: [{ amount: subtotal * 100, reference: artworkId }],
 *        customer_details: {
 *          address: { postal_code: zip, country: 'US' },
 *          address_source: 'shipping'
 *        }
 *      })
 *      return { ok: true, estimate: { ... } }
 *
 *   3. Nothing else in the codebase needs to change.
 *
 * Caveats with the demo implementation:
 *   - ZIP prefix → state mapping is approximate. A handful of prefixes
 *     cross state borders (returned state is the dominant one).
 *   - Uses combined state + average county/local rate. Real local rates
 *     vary by city/county within a state.
 *   - Does not handle art-specific exemptions, occasional-sale rules,
 *     or use-tax scenarios. The estimate may be ±0.5–1% off.
 *   - States with no sales tax (AK, DE, MT, NH, OR) return 0%.
 */

export interface TaxEstimate {
  taxAmount: number // dollars, rounded to 2 decimals
  taxRate: number // combined percent, e.g. 7.0
  jurisdiction: string // human label, e.g. "North Carolina"
  estimated: true // demo implementation is always an estimate
}

export type TaxLookupResult =
  | { ok: true; estimate: TaxEstimate }
  | { ok: false; reason: 'invalid-zip' | 'unsupported-region' }

// ZIP prefix (first 3 digits) → US state code.
// Source: USPS ZIP code prefix assignments.
const ZIP_PREFIX_RANGES: readonly { from: number; to: number; state: string }[] = [
  { from: 6, to: 9, state: 'PR' },
  { from: 10, to: 27, state: 'MA' },
  { from: 28, to: 29, state: 'RI' },
  { from: 30, to: 38, state: 'NH' },
  { from: 39, to: 49, state: 'ME' },
  { from: 50, to: 59, state: 'VT' },
  { from: 60, to: 69, state: 'CT' },
  { from: 70, to: 89, state: 'NJ' },
  { from: 100, to: 149, state: 'NY' },
  { from: 150, to: 196, state: 'PA' },
  { from: 197, to: 199, state: 'DE' },
  { from: 200, to: 205, state: 'DC' },
  { from: 206, to: 219, state: 'MD' },
  { from: 220, to: 246, state: 'VA' },
  { from: 247, to: 268, state: 'WV' },
  { from: 270, to: 289, state: 'NC' },
  { from: 290, to: 299, state: 'SC' },
  { from: 300, to: 319, state: 'GA' },
  { from: 320, to: 349, state: 'FL' },
  { from: 350, to: 369, state: 'AL' },
  { from: 370, to: 385, state: 'TN' },
  { from: 386, to: 397, state: 'MS' },
  { from: 400, to: 427, state: 'KY' },
  { from: 430, to: 458, state: 'OH' },
  { from: 460, to: 479, state: 'IN' },
  { from: 480, to: 499, state: 'MI' },
  { from: 500, to: 528, state: 'IA' },
  { from: 530, to: 549, state: 'WI' },
  { from: 550, to: 567, state: 'MN' },
  { from: 570, to: 577, state: 'SD' },
  { from: 580, to: 588, state: 'ND' },
  { from: 590, to: 599, state: 'MT' },
  { from: 600, to: 629, state: 'IL' },
  { from: 630, to: 658, state: 'MO' },
  { from: 660, to: 679, state: 'KS' },
  { from: 680, to: 693, state: 'NE' },
  { from: 700, to: 714, state: 'LA' },
  { from: 716, to: 729, state: 'AR' },
  { from: 730, to: 749, state: 'OK' },
  { from: 750, to: 799, state: 'TX' },
  { from: 800, to: 816, state: 'CO' },
  { from: 820, to: 831, state: 'WY' },
  { from: 832, to: 838, state: 'ID' },
  { from: 840, to: 847, state: 'UT' },
  { from: 850, to: 865, state: 'AZ' },
  { from: 870, to: 884, state: 'NM' },
  { from: 889, to: 898, state: 'NV' },
  { from: 900, to: 961, state: 'CA' },
  { from: 967, to: 968, state: 'HI' },
  { from: 970, to: 979, state: 'OR' },
  { from: 980, to: 994, state: 'WA' },
  { from: 995, to: 999, state: 'AK' }
]

// Combined state + average county/local sales tax rate (percent).
// Source: Tax Foundation 2024 state and local sales tax averages.
// Five states have no statewide sales tax: AK (some localities), DE, MT, NH, OR.
const COMBINED_RATES: Record<string, number> = {
  AL: 9.29,
  AK: 1.82, // local only; no state rate
  AZ: 8.4,
  AR: 9.45,
  CA: 8.85,
  CO: 7.81,
  CT: 6.35,
  DC: 6.0,
  DE: 0.0,
  FL: 7.0,
  GA: 7.38,
  HI: 4.5,
  ID: 6.03,
  IL: 8.86,
  IN: 7.0,
  IA: 6.94,
  KS: 8.66,
  KY: 6.0,
  LA: 9.56,
  ME: 5.5,
  MD: 6.0,
  MA: 6.25,
  MI: 6.0,
  MN: 7.5,
  MS: 7.06,
  MO: 8.39,
  MT: 0.0,
  NE: 6.97,
  NV: 8.24,
  NH: 0.0,
  NJ: 6.6,
  NM: 7.62,
  NY: 8.53,
  NC: 6.98,
  ND: 7.04,
  OH: 7.24,
  OK: 8.99,
  OR: 0.0,
  PA: 6.34,
  RI: 7.0,
  SC: 7.5,
  SD: 6.11,
  TN: 9.55,
  TX: 8.2,
  UT: 7.25,
  VT: 6.36,
  VA: 5.77,
  WA: 9.38,
  WV: 6.57,
  WI: 5.43,
  WY: 5.44
}

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
}

function stateFromZip(zip: string): string | null {
  const prefix = parseInt(zip.slice(0, 3), 10)
  if (Number.isNaN(prefix)) return null
  const match = ZIP_PREFIX_RANGES.find((r) => prefix >= r.from && prefix <= r.to)
  return match?.state ?? null
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip)
}

/**
 * Estimate sales tax for a given subtotal and US ZIP code.
 * Async to match the shape of real tax APIs (Stripe Tax, TaxJar) so
 * call sites don't need to change when the implementation swaps.
 */
export async function estimateSalesTax(input: {
  zip: string
  subtotal: number
}): Promise<TaxLookupResult> {
  const cleanZip = input.zip.replace(/[^0-9]/g, '').slice(0, 5)
  if (!isValidZip(cleanZip)) {
    return { ok: false, reason: 'invalid-zip' }
  }

  const state = stateFromZip(cleanZip)
  if (!state || !(state in COMBINED_RATES)) {
    return { ok: false, reason: 'unsupported-region' }
  }

  const rate = COMBINED_RATES[state]
  const taxAmount = Math.round(input.subtotal * rate) / 100

  return {
    ok: true,
    estimate: {
      taxAmount,
      taxRate: rate,
      jurisdiction: STATE_NAMES[state] ?? state,
      estimated: true
    }
  }
}
