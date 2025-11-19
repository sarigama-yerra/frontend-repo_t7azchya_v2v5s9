import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

const timeframes = [
  { key: '1d', label: '1D' },
  { key: '7d', label: '7D' },
  { key: '30d', label: '1M' },
]

function LeaderboardRow({ entry, i }) {
  return (
    <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition">
      <td className="px-3 py-2 text-slate-300">{i+1}</td>
      <td className="px-3 py-2 font-mono text-emerald-300 truncate max-w-[240px]" title={entry.address}>
        {entry.label ? `${entry.label} · ` : ''}{entry.address}
      </td>
      <td className="px-3 py-2">${entry.pnl_usd.toFixed(4)}</td>
      <td className="px-3 py-2">{(entry.hit_rate*100).toFixed(0)}%</td>
      <td className="px-3 py-2">{entry.trades}</td>
    </tr>
  )
}

export default function WalletTracker() {
  const [windowK, setWindowK] = useState('7d')
  const [sort, setSort] = useState('pnl')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [addr, setAddr] = useState('')
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError('')
      const r = await fetch(`${API}/wallets/leaderboard?window=${windowK}&sort=${sort}`)
      const j = await r.json()
      setRows(Array.isArray(j)? j : [])
    } catch (e) {
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLeaderboard() }, [windowK, sort])

  const onTrack = async (e) => {
    e.preventDefault()
    if (!addr) return
    try {
      setLoading(true)
      setError('')
      await fetch(`${API}/wallets/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address: addr, label }) })
      setAddr('')
      setLabel('')
      await loadLeaderboard()
    } catch (e) {
      setError('Failed to track wallet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black to-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Wallet Leaderboard</h2>
          <div className="flex gap-2">
            {timeframes.map(t => (
              <button key={t.key} onClick={()=>setWindowK(t.key)} className={`px-3 py-1 rounded-full text-sm border ${windowK===t.key? 'bg-emerald-500 text-black border-emerald-500' : 'border-emerald-500/30 text-emerald-300'}`}>
                {t.label}
              </button>
            ))}
            <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-black border border-emerald-500/30 rounded px-3 py-1 text-emerald-300">
              <option value="pnl">PnL</option>
              <option value="hit_rate">Hit-Rate</option>
              <option value="trades">Trades</option>
            </select>
          </div>
        </div>

        <form onSubmit={onTrack} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Add wallet address" className="md:col-span-3 bg-black border border-emerald-500/30 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
          <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (optional)" className="md:col-span-1 bg-black border border-emerald-500/30 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
          <button className="md:col-span-1 bg-emerald-500 text-black font-semibold rounded px-4 py-2">Track</button>
        </form>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        <div className="overflow-auto rounded-xl border border-emerald-500/20">
          <table className="w-full text-left">
            <thead className="bg-black/40">
              <tr>
                <th className="px-3 py-2 text-slate-400">#</th>
                <th className="px-3 py-2 text-slate-400">Wallet</th>
                <th className="px-3 py-2 text-slate-400">PnL</th>
                <th className="px-3 py-2 text-slate-400">Hit-Rate</th>
                <th className="px-3 py-2 text-slate-400">Trades</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">No data yet. Add a wallet to start tracking.</td></tr>
              ) : (
                rows.map((r, i) => <LeaderboardRow key={r.address + i} entry={r} i={i} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
