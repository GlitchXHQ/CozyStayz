import React, { useRef, useState } from 'react'
import ResortVideo from "../assets/ResortVideo.mp4"

export default function About() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <section className="pt-30 flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-12 lg:px-24">

      {/* Video / Media card */}
      <div className="relative shadow-2xl shadow-indigo-600/20 rounded-2xl overflow-hidden shrink-0 max-w-md w-full">
        {/* Using a real video element so it plays on click. poster prop can be added if you have a thumbnail image. */}
        <video
          ref={videoRef}
          src={ResortVideo}
          className="w-full h-64 md:h-80 object-cover"
          loop
          muted
          playsInline
          onClick={togglePlay}
          aria-label="CozyStayz resort glimpse video"
        />

        {/* Play overlay */}
        <button
          onClick={togglePlay}
          aria-pressed={playing}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white w-16 h-16 flex items-center justify-center rounded-full backdrop-blur bg-white/10 hover:scale-105 transition"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 6h4v12H6zM14 6h4v12h-4z" fill="#fff" />
            </svg>
          ) : (
            <svg width="20" height="24" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M1.027 3.371c0-1.374 1.512-2.213 2.678-1.484l9.11 5.693a1.75 1.75 0 0 1 0 2.969l-9.11 5.693c-1.166.729-2.678-.11-2.678-1.484z" fill="#fff" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

      </div>

      {/* Text content */}
      <div className="text-sm text-slate-700 max-w-lg">
        <h2 className="text-2xl md:text-3xl uppercase font-semibold text-slate-800">About CozyStayz</h2>
        <div className="w-24 h-[4px] mt-3 rounded-full bg-gradient-to-r from-indigo-600 to-[#8A7DFF]"></div>

        <p className="mt-6 text-slate-600">CozyStayz is your home away from home. We hand-pick welcoming hotels and boutique stays with comfortable rooms, thoughtful amenities, and friendly service — so every trip becomes a memory worth keeping.</p>

        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 mt-1">✨</span>
            <span><strong>Curated stays</strong> — properties chosen for comfort, location and value.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 mt-1">🧭</span>
            <span><strong>Easy booking</strong> — fast search, realtime availability and secure checkout.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 mt-1">🤝</span>
            <span><strong>Local support</strong> — friendly help before, during and after your stay.</span>
          </li>
        </ul>

        <p className="mt-4 text-slate-600">Whether you’re planning a weekend escape, a family trip or a business stay, CozyStayz makes finding and booking the right place effortless — so you can focus on what matters: the experience.</p>

        <div className="flex flex-wrap gap-3 mt-6">
          <a href="/room" className="inline-flex items-center gap-2 hover:-translate-y-0.5 transition bg-gradient-to-r from-indigo-600 to-[#8A7DFF] py-3 px-6 rounded-full text-white">Book Now</a>

         
        </div>

      </div>

    </section>
  )
}
