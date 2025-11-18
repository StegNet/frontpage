'use client'

import { useState } from 'react'
import TermsOfService from '@/components/terms-of-service'
import PrivacyPolicy from '@/components/privacy-policy'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'terms' | 'privacy'>('terms')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-primary">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="mb-6 text-balance text-3xl font-bold text-primary-foreground">
            Legal Documents
          </h1>
          
          {/* Navigation */}
          <nav className="flex gap-6">
            <button
              onClick={() => setCurrentPage('terms')}
              className={`pb-2 text-sm font-medium transition-colors ${
                currentPage === 'terms'
                  ? 'border-b-2 border-primary-foreground text-primary-foreground'
                  : 'text-primary-foreground/70 hover:text-primary-foreground'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setCurrentPage('privacy')}
              className={`pb-2 text-sm font-medium transition-colors ${
                currentPage === 'privacy'
                  ? 'border-b-2 border-primary-foreground text-primary-foreground'
                  : 'text-primary-foreground/70 hover:text-primary-foreground'
              }`}
            >
              Privacy Policy
            </button>
          </nav>
          {/* Direct permalinks for sharing */}
          <div className="mt-4 flex gap-4 text-sm">
            <a href="/terms" className="underline decoration-primary-foreground/40 hover:decoration-primary-foreground">Permalink Terms</a>
            <a href="/privacy" className="underline decoration-primary-foreground/40 hover:decoration-primary-foreground">Permalink Privacy</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {currentPage === 'terms' ? <TermsOfService /> : <PrivacyPolicy />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
