import React from 'react'
import Hero from './components/Hero'
import Analyzer from './components/Analyzer'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero with 3D Spline cover */}
      <Hero />

      {/* Analyzer Section */}
      <Analyzer />

      {/* Promo/CTA */}
      <section className="relative bg-black py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl p-8 border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black">
            <h3 className="text-2xl font-bold">Promote Your Software</h3>
            <p className="text-slate-400 mt-2">Position your brand in the Solana ecosystem with a sleek, modern analyzer that showcases AI capabilities and market insights.</p>
            <ul className="mt-4 space-y-2 text-slate-300 list-disc list-inside">
              <li>Black, neon-holographic aesthetic</li>
              <li>Real-time token scoring</li>
              <li>Shareable insights</li>
            </ul>
          </div>
          <div className="rounded-2xl p-8 border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-black">
            <h3 className="text-2xl font-bold">Why Solana</h3>
            <p className="text-slate-400 mt-2">Lightning-fast, low fees, and a thriving meme coin culture. This site is tuned for Solana first.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {['Fees', 'Speed', 'Ecosystem'].map((t, i)=> (
                <div key={i} className="rounded-xl border border-emerald-500/20 p-4 bg-black/40">
                  <div className="text-emerald-400 text-2xl font-extrabold">{i===0?'0.0001':i===1?'400ms':'10K+'}</div>
                  <div className="text-slate-400 text-xs uppercase mt-1">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App
