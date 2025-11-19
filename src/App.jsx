import React from 'react'
import Hero from './components/Hero'
import Analyzer from './components/Analyzer'
import ChartAI from './components/ChartAI'
import WalletTracker from './components/WalletTracker'
import MacdBot from './components/MacdBot'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero with 3D Spline cover */}
      <Hero />

      {/* Analyzer Section */}
      <Analyzer />

      {/* Chart AI Section */}
      <ChartAI />

      {/* Wallet Leaderboard */}
      <WalletTracker />

      {/* MACD Bot */}
      <MacdBot />

      <Footer />
    </div>
  )
}

export default App
