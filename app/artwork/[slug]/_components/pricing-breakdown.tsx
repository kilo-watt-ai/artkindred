'use client'

import { useEffect, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { estimateSalesTax, isValidZip, type TaxEstimate } from '@/lib/tax'

interface Props {
  artworkPrice: number
  shippingPrice: number
}

const ZIP_STORAGE_KEY = 'artkindred-shipping-zip'

function formatPrice(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`
}

export function PricingBreakdown({ artworkPrice, shippingPrice }: Props) {
  const buyerFee = Math.round(artworkPrice * 0.1)
  const taxableSubtotal = artworkPrice + buyerFee // most states exclude shipping; matching that here

  const [zip, setZip] = useState('')
  const [editingZip, setEditingZip] = useState(false)
  const [estimate, setEstimate] = useState<TaxEstimate | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Load persisted ZIP on mount and run an estimate
  useEffect(() => {
    const stored = window.localStorage.getItem(ZIP_STORAGE_KEY)
    if (stored && isValidZip(stored)) {
      setZip(stored)
      runEstimate(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-estimate when artwork changes and we have a stored ZIP
  useEffect(() => {
    if (zip && isValidZip(zip)) {
      runEstimate(zip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworkPrice])

  async function runEstimate(zipToUse: string) {
    setLoading(true)
    setErrorMsg(null)
    const result = await estimateSalesTax({ zip: zipToUse, subtotal: taxableSubtotal })
    setLoading(false)
    if (result.ok) {
      setEstimate(result.estimate)
      window.localStorage.setItem(ZIP_STORAGE_KEY, zipToUse)
    } else {
      setEstimate(null)
      setErrorMsg(
        result.reason === 'invalid-zip'
          ? 'Enter a valid 5-digit US ZIP'
          : "We can't estimate tax for that location yet"
      )
    }
  }

  function handleZipChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 5)
    setZip(cleaned)
    if (cleaned.length === 5) {
      runEstimate(cleaned)
    } else {
      setEstimate(null)
      setErrorMsg(null)
    }
  }

  function clearZip() {
    setZip('')
    setEstimate(null)
    setErrorMsg(null)
    setEditingZip(true)
    window.localStorage.removeItem(ZIP_STORAGE_KEY)
  }

  const total =
    artworkPrice + buyerFee + shippingPrice + (estimate?.taxAmount ?? 0)
  const showingZipInput = editingZip || !estimate

  return (
    <div className="border-t border-b py-5 space-y-2">
      <div className="flex justify-between text-base">
        <span>Artwork price</span>
        <span className="font-semibold">{formatPrice(artworkPrice)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Buyer fee (10%)</span>
        <span>{formatPrice(buyerFee)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Shipping</span>
        <span>{formatPrice(shippingPrice)}</span>
      </div>

      {/* Tax estimate — always shown when we have one, plus inline editor */}
      {estimate && (
        <div className="flex justify-between items-start gap-2 text-sm text-gray-600 pt-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span>Estimated tax</span>
            <span className="text-xs text-gray-500">
              ({estimate.jurisdiction}, {estimate.taxRate.toFixed(2)}%)
            </span>
          </div>
          <span className="whitespace-nowrap">{formatPrice(estimate.taxAmount)}</span>
        </div>
      )}

      {/* ZIP input row */}
      <div className="text-sm text-gray-600 pt-1">
        {estimate && !editingZip ? (
          <button
            type="button"
            onClick={() => setEditingZip(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Change ZIP ({zip})
          </button>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="zip-input"
              className="flex items-center gap-1 text-sm text-gray-700"
            >
              <MapPin size={14} aria-hidden="true" />
              {estimate ? 'Update ZIP for tax estimate' : 'Estimate sales tax'}
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="zip-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="ZIP code"
                value={zip}
                onChange={(e) => handleZipChange(e.target.value)}
                onBlur={() => {
                  if (estimate) setEditingZip(false)
                }}
                className="input py-1.5 text-sm max-w-[10rem]"
                aria-describedby={errorMsg ? 'zip-error' : undefined}
                aria-invalid={errorMsg ? true : undefined}
              />
              {loading && (
                <Loader2
                  className="w-4 h-4 animate-spin text-gray-400"
                  aria-label="Calculating"
                />
              )}
              {estimate && (
                <button
                  type="button"
                  onClick={() => setEditingZip(false)}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Done
                </button>
              )}
            </div>
            {errorMsg && (
              <p id="zip-error" className="text-xs text-red-600">
                {errorMsg}
              </p>
            )}
            {!estimate && (
              <p className="text-xs text-gray-500 leading-snug">
                Estimate only — final tax is calculated at checkout from your
                shipping address.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between text-lg font-bold pt-3 border-t mt-2">
        <span>{estimate && !editingZip ? 'Estimated total' : 'Total'}</span>
        <span className="text-blue-600">{formatPrice(total)}</span>
      </div>

      {!estimate && !showingZipInput && (
        <p className="text-xs text-gray-500 mt-1">
          Sales tax calculated at checkout based on shipping address.
        </p>
      )}

      {estimate && !editingZip && (
        <button
          type="button"
          onClick={clearZip}
          className="text-xs text-gray-500 hover:text-gray-700 underline mt-1"
        >
          Don&apos;t show tax estimate
        </button>
      )}
    </div>
  )
}
