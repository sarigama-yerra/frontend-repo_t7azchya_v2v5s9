import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative w-full h-[70vh] min-h-[520px] bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Overlay gradient and content container */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-center">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs tracking-wider uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live AI Analyzer
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Solana Meme Coin Analyzer
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300 text-base sm:text-lg">
            Instantly score any Solana token with AI-powered heuristics and real-time on-chain market data. Designed for meme coin hunters and serious degens.
          </p>
        </div>
      </div>
    </section>
  )
}
