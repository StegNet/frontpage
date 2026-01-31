'use client'

import { useEffect, useRef, useState } from 'react'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentText, setCurrentText] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sequences = [
      { text: 'INITIALIZING SYSTEM...', duration: 2000 },
      { text: 'CONNECTING TO SECURE DATABASE...', duration: 2200 },
      { text: 'CHECKING CREDENTIALS FOR LAPD REGISTRY...', duration: 2500 },
      { text: 'VERIFYING ACCESS PERMISSIONS...', duration: 2200 },
      { text: 'SCANNING PUBLIC RECORDS...', duration: 2000 },
      { text: 'ACCESS GRANTED TO PUBLIC RECORDS', duration: 2500, isSuccess: true },
    ]

    let currentSequence = 0
    let currentProgressWidth = 0
    const timeouts: NodeJS.Timeout[] = []
    const intervals: NodeJS.Timeout[] = []
    let animationFrames: number[] = []

    const showNextSequence = () => {
      if (currentSequence < sequences.length) {
        const sequence = sequences[currentSequence]
        
        // Type out text
        let charIndex = 0
        const typeInterval = setInterval(() => {
          if (charIndex <= sequence.text.length) {
            setCurrentText(sequence.text.substring(0, charIndex))
            charIndex++
          } else {
            clearInterval(typeInterval)
          }
        }, 30)
        intervals.push(typeInterval)

        // Show progress bar
        if (currentSequence > 0) {
          setShowProgress(true)
        }
        
        // Animate progress width
        const targetWidth = ((currentSequence + 1) / sequences.length) * 100
        const startWidth = currentProgressWidth
        const startTime = Date.now()
        
        const animateProgress = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / sequence.duration, 1)
          const eased = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2
          const newWidth = startWidth + (targetWidth - startWidth) * eased
          currentProgressWidth = newWidth
          setProgressWidth(newWidth)
          
          if (progress < 1) {
            const frameId = requestAnimationFrame(animateProgress)
            animationFrames.push(frameId)
          }
        }
        
        const frameId = requestAnimationFrame(animateProgress)
        animationFrames.push(frameId)

        currentSequence++
        const timeout = setTimeout(showNextSequence, sequence.duration)
        timeouts.push(timeout)
      } else {
        // All sequences complete - fade out
        const fadeTimeout = setTimeout(() => {
          const startTime = Date.now()
          const fadeOut = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / 1000, 1)
            setOpacity(1 - progress)
            
            if (progress < 1) {
              const frameId = requestAnimationFrame(fadeOut)
              animationFrames.push(frameId)
            } else {
              onComplete()
            }
          }
          const frameId = requestAnimationFrame(fadeOut)
          animationFrames.push(frameId)
        }, 800)
        timeouts.push(fadeTimeout)
      }
    }

    // Start the sequence after initial delay
    const initialTimeout = setTimeout(showNextSequence, 500)
    timeouts.push(initialTimeout)

    // Particles animation
    const createParticle = () => {
      if (!containerRef.current) return

      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.width = '2px'
      particle.style.height = '2px'
      particle.style.background = 'rgba(0, 255, 255, 0.6)'
      particle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.borderRadius = '50%'
      containerRef.current.appendChild(particle)

      const duration = 2000 + Math.random() * 2000
      const startTime = Date.now()
      const startX = 0
      const startY = 0
      const endX = Math.random() * 200 - 100
      const endY = Math.random() * 200 - 100
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        
        particle.style.transform = `translate(${startX + (endX - startX) * eased}px, ${startY + (endY - startY) * eased}px)`
        particle.style.opacity = `${0.6 * (1 - progress)}`
        
        if (progress < 1) {
          const frameId = requestAnimationFrame(animate)
          animationFrames.push(frameId)
        } else {
          particle.remove()
        }
      }
      
      const frameId = requestAnimationFrame(animate)
      animationFrames.push(frameId)
    }

    const particleInterval = setInterval(createParticle, 200)
    intervals.push(particleInterval)

    return () => {
      // Clear all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout))
      // Clear all intervals
      intervals.forEach(interval => clearInterval(interval))
      // Cancel all animation frames
      animationFrames.forEach(frameId => cancelAnimationFrame(frameId))
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ 
        fontFamily: 'var(--font-mono)',
        opacity: opacity,
        transition: 'opacity 0.3s'
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animationDuration: '2s',
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.5), transparent)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
          animation: 'scan-line 3s linear infinite',
        }}
      />

      {/* Corners decoration */}
      <div className="absolute left-8 top-8 h-16 w-16 border-l-2 border-t-2 border-cyan-400" />
      <div className="absolute right-8 top-8 h-16 w-16 border-r-2 border-t-2 border-cyan-400" />
      <div className="absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-cyan-400" />

      {/* Central content */}
      <div className="relative z-10 px-8 text-center">
        {/* Main text with glitch effect */}
        <div className="relative mb-12">
          <h1
            className="text-2xl font-bold tracking-widest md:text-4xl"
            style={{
              color: '#00ffff',
              textShadow: `
                0 0 10px rgba(0, 255, 255, 0.8),
                0 0 20px rgba(0, 255, 255, 0.6),
                0 0 30px rgba(0, 255, 255, 0.4),
                2px 2px 0 rgba(255, 0, 255, 0.3),
                -2px -2px 0 rgba(0, 255, 0, 0.3)
              `,
            }}
          >
            {currentText}
            <span className="animate-pulse">_</span>
          </h1>

          {/* Glitch overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              animation: 'glitch 0.3s infinite',
            }}
          >
            <h1
              className="text-2xl font-bold tracking-widest md:text-4xl"
              style={{
                color: '#ff00ff',
                mixBlendMode: 'screen',
              }}
            >
              {currentText}
            </h1>
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mx-auto w-full max-w-md">
            <div className="relative h-2 overflow-hidden rounded-full bg-gray-900">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #00ff88)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                  width: `${progressWidth}%`,
                }}
              />
              {/* Animated progress glow */}
              <div
                className="absolute left-0 top-0 h-full w-20 blur-xl"
                style={{
                  background: 'rgba(0, 255, 255, 0.6)',
                  animation: 'progress-glow 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        )}

        {/* Status indicators */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" style={{ animationDelay: '0s' }} />
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" style={{ animationDelay: '0.3s' }} />
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes progress-glow {
          0%, 100% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes scan-line {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  )
}
