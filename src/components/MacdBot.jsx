import React, { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

const tfs = ['15m','1h','4h']

function Sparkline({ data, className }){
  if (!data || data.length === 0) return <div className={className}/>
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v,i)=>{
    const x = (i/(data.length-1))*100
    const y = max===min?50: 100 - ((v-min)/(max-min))*100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
    </svg>
  )
}

export default function MacdBot(){
  const [q, setQ] = useState('')
  const [tf, setTf] = useState('1h')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    if (!q) return
    try {
      setLoading(true)
      setErr('')
      const r = await fetch(`${API}/indicator/macd/analyze?query=${q}&timeframe=${tf}`)
      if (!r.ok) {
        const msg = await r.json().catch(()=>({detail:'error'}))
        throw new Error(msg.detail || 'Failed')
      }
      const j = await r.json()
      setData(j)
    } catch (e){
      setErr(e.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  const lastSignal = useMemo(()=> data?.signals?.slice(-1)[0], [data])

  return (
    <section className="py-16 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">MACD Bot</h2>
            <p className="text-slate-400">Enter a Solana token mint to compute MACD signals</p>
          </div>
          <div className="flex gap-2">
            {tfs.map(x=> (
              <button key={x} onClick={()=>setTf(x)} className={`px-3 py-1 rounded-full text-sm border ${tf===x? 'bg-emerald-500 text-black border-emerald-500' : 'border-emerald-500/30 text-emerald-300'}`}>{x}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Mint address (e.g. So111... for SOL)" className="flex-1 bg-black border border-emerald-500/30 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
          <button onClick={load} className="bg-emerald-500 text-black font-semibold rounded px-4 py-2">Analyze</button>
        </div>
        {err && <div className="text-red-400 mb-4">{err}</div>}

        {!data ? (
          <div className="text-slate-500">No data yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-emerald-500/20 p-4 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-slate-400 text-sm mb-2">Price</div>
              <Sparkline className="w-full h-40 text-emerald-400" data={(data.candles||[]).map(c=>c.c)} />
              <div className="mt-6">
                <div className="text-slate-400 text-sm mb-2">MACD</div>
                <Sparkline className="w-full h-24 text-emerald-300" data={data.macd||[]} />
                <div className="text-slate-400 text-sm mb-2 mt-4">Signal</div>
                <Sparkline className="w-full h-24 text-emerald-500" data={data.signal||[]} />
                <div className="text-slate-400 text-sm mb-2 mt-4">Histogram</div>
                <Sparkline className="w-full h-24 text-emerald-600" data={data.histogram||[]} />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 p-4 bg-gradient-to-b from-slate-900 to-black">
              <div className="text-slate-300 mb-2">Signals</div>
              <div className="space-y-2 max-h-72 overflow-auto pr-2">
                {(data.signals||[]).slice().reverse().map((s, i)=> (
                  <div key={i} className={`rounded-lg px-3 py-2 text-sm border ${s.type==='bullish' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : 'border-red-500/30 bg-red-500/5 text-red-200'}`}>
                    <div className="flex justify-between"><span className="uppercase">{s.type}</span><span className="text-xs text-slate-400">{new Date(s.time*1000).toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-emerald-500/30 p-3">
                <div className="text-slate-400 text-sm">AI Approval</div>
                <div className="text-3xl font-bold text-emerald-400">{Math.round((data.confidence||0)*100)}%</div>
                {lastSignal && <div className="text-slate-400 text-xs mt-2">Latest: {lastSignal.type} at {new Date(lastSignal.time*1000).toLocaleString()}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
