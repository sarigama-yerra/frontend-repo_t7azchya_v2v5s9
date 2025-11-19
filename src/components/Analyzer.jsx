import React, { useState } from 'react'
import { Sparkles, Gauge, ShieldAlert, Zap } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

export default function Analyzer() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const runAnalysis = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`${BACKEND}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const j = await res.json()
      setData(j)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative bg-black py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black p-6 sm:p-8 shadow-[0_0_40px_-20px_rgba(16,185,129,0.5)]">
              <form onSubmit={runAnalysis} className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 rounded-xl bg-black/60 border border-emerald-500/30 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Paste Solana token address or search by name/symbol"
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !query}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> Analyze
                </button>
              </form>

              {/* Results */}
              <div className="mt-6 min-h-[160px]">
                {!loading && !data && !error && (
                  <p className="text-sm text-slate-400">Tip: try keywords like "BONK" or paste a token address.</p>
                )}
                {loading && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Zap className="w-5 h-5 animate-pulse text-emerald-400" />
                    Running analysis...
                  </div>
                )}
                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                {data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                      <div className="text-slate-400 text-xs uppercase">Token</div>
                      <div className="text-white font-semibold">{data.name || 'Unknown'} <span className="text-slate-400">{data.symbol ? `(${data.symbol})` : ''}</span></div>
                      <div className="text-xs text-slate-500 break-all mt-1">{data.token_address || '-'}</div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase"><Gauge className="w-4 h-4"/> Score</div>
                      <div className="text-3xl font-extrabold text-emerald-400">{Math.round(data.score)}</div>
                      <div className="text-slate-300 text-sm">{data.verdict}</div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase"><ShieldAlert className="w-4 h-4"/> Risk</div>
                      <div className="text-slate-300 text-sm">Low liquidity and brand-new pairs score lower.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar feature list */}
          <div className="space-y-4">
            {[
              { title: 'Real-time market data', desc: 'We fetch fresh DEX data to inform the score.' },
              { title: 'Heuristic safety score', desc: 'Liquidity, volume, and age combine into a 0-100 rating.' },
              { title: 'Solana-first design', desc: 'Dark, neon accents inspired by the Solana ecosystem.' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black p-6">
                <div className="text-white font-semibold">{f.title}</div>
                <div className="text-slate-400 text-sm mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {data && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Liquidity */}
            <MetricCard label="Liquidity (USD)" value={formatNumber(data.metrics?.liquidity_usd)} />
            <MetricCard label="24h Volume" value={formatNumber(data.metrics?.volume_h24)} />
            <MetricCard label="FDV" value={formatNumber(data.metrics?.fdv)} />
            <MetricCard label="Age (days)" value={data.metrics?.age_days ?? '-'} />
            <MetricCard label="24h Change" value={data.metrics?.price_change_h24 !== undefined ? `${data.metrics.price_change_h24}%` : '-'} />
            <MetricCard label="Pair Created" value={data.metrics?.pair_created_at ? new Date(data.metrics.pair_created_at).toLocaleString() : '-'} />
          </div>
        )}
      </div>
    </section>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 p-5 bg-black/40">
      <div className="text-slate-400 text-xs uppercase">{label}</div>
      <div className="text-white text-xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function formatNumber(n){
  if (n === null || n === undefined) return '-'
  if (typeof n !== 'number') return String(n)
  if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(2)+ 'B'
  if (n >= 1_000_000) return (n/1_000_000).toFixed(2)+ 'M'
  if (n >= 1_000) return (n/1_000).toFixed(2)+ 'K'
  return n.toLocaleString()
}
