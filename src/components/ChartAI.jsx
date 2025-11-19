import React, { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

export default function ChartAI(){
  const [file, setFile] = useState(null)
  const [timeframe, setTimeframe] = useState('15m')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setData(null)
    if(!file){ setError('Please upload a chart image'); return }
    setLoading(true)
    try{
      const form = new FormData()
      form.append('file', file)
      form.append('timeframe', timeframe)
      if(notes) form.append('notes', notes)
      const res = await fetch(`${BACKEND}/chart/analyze`, {
        method: 'POST',
        body: form,
      })
      if(!res.ok){
        const j = await res.json().catch(()=>({detail:'Failed'}))
        throw new Error(j.detail || 'Failed')
      }
      const j = await res.json()
      setData(j)
    }catch(err){
      setError(err.message || 'Something went wrong')
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="relative bg-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Chart AI</h2>
          <p className="text-slate-400 mt-2">Upload a chart screenshot and set the timeframe. Get a suggested trade plan with entry, stop loss, and take profits as percentage offsets you can map to your price.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Chart Image</label>
                <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-emerald-500 file:text-black file:font-semibold file:hover:bg-emerald-400 bg-black/60 border border-emerald-500/30 rounded-md p-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Timeframe</label>
                  <select value={timeframe} onChange={(e)=>setTimeframe(e.target.value)} className="w-full rounded-md bg-black/60 border border-emerald-500/30 px-3 py-2">
                    {['1m','3m','5m','15m','1h','4h','1d'].map(tf=> (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
                  <input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="e.g., breakout, range, lower low" className="w-full rounded-md bg-black/60 border border-emerald-500/30 px-3 py-2"/>
                </div>
              </div>
              <button disabled={loading || !file} className="inline-flex items-center justify-center rounded-lg bg-emerald-500 text-black font-semibold px-5 py-2 disabled:opacity-50 hover:bg-emerald-400">{loading? 'Analyzing...' : 'Analyze Chart'}</button>
              {error && <div className="text-red-400 text-sm">{error}</div>}
            </form>

            {data && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                  <div className="text-slate-400 text-xs uppercase">Context</div>
                  <div className="text-sm text-slate-300 mt-1">Timeframe: <span className="text-white font-semibold">{data.timeframe}</span></div>
                  <div className="text-sm text-slate-300">Trend: <span className="text-white font-semibold capitalize">{data.trend}</span></div>
                  <div className="text-sm text-slate-300">Momentum: <span className="text-white font-semibold capitalize">{data.momentum}</span></div>
                  <div className="text-sm text-slate-300">Confidence: <span className="text-white font-semibold">{Math.round(data.confidence*100)}%</span></div>
                </div>
                <div className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                  <div className="text-slate-400 text-xs uppercase">Trade Plan (offsets)</div>
                  <div className="text-sm text-slate-300 mt-1">Side: <span className="text-white font-semibold uppercase">{data.trade?.side}</span></div>
                  <div className="text-sm text-slate-300">Entry offset: <span className="text-emerald-400 font-semibold">{fmtPct(data.key_levels?.entry_offset_pct)}</span></div>
                  <div className="text-sm text-slate-300">Stop offset: <span className="text-red-400 font-semibold">{fmtPct(data.key_levels?.stop_offset_pct)}</span></div>
                  <div className="text-sm text-slate-300">TP1 offset: <span className="text-emerald-400 font-semibold">{fmtPct(data.key_levels?.tp1_offset_pct)}</span></div>
                  <div className="text-sm text-slate-300">TP2 offset: <span className="text-emerald-400 font-semibold">{fmtPct(data.key_levels?.tp2_offset_pct)}</span></div>
                  <div className="text-sm text-slate-300">Risk/Reward: <span className="text-white font-semibold">{data.trade?.risk_reward}R</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[ 
              {t:'Upload any chart', d:'PNG/JPG from your platform or a screenshot.'},
              {t:'Heuristic read', d:'Notes and timeframe steer the suggestion.'},
              {t:'Offsets not signals', d:'We output % offsets you can map to current price.'},
            ].map((f,i)=> (
              <div key={i} className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black p-6">
                <div className="text-white font-semibold">{f.t}</div>
                <div className="text-slate-400 text-sm mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function fmtPct(v){
  if(v===undefined || v===null) return '-'
  const val = Number(v)
  if(Number.isNaN(val)) return '-'
  const sign = val >= 0 ? '' : '-'
  return sign + Math.abs(val).toFixed(2) + '%'
}
