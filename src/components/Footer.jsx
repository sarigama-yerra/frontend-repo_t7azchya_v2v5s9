import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-black border-t border-emerald-500/10">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-slate-400 text-sm">© {new Date().getFullYear()} Solana Meme Coin Analyzer • All rights reserved</div>
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <a href="#" className="hover:text-emerald-400">Docs</a>
          <a href="#" className="hover:text-emerald-400">Twitter</a>
          <a href="#" className="hover:text-emerald-400">Contact</a>
        </div>
      </div>
    </footer>
  )
}
