'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MailCheck, Sparkles, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getAuthCallbackUrl, parseAuthError } from '@/lib/utils/auth'
import { Button } from '@/components/ui/Button'

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  async function handleResend() {
    if (!email) {
      setResendError('Email address not found. Please sign up again.')
      return
    }

    setResendError(null)
    setResendSuccess(false)
    setIsResending(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: getAuthCallbackUrl('/login?verified=1'),
        },
      })

      if (error) {
        setResendError(parseAuthError(error.message).message)
        return
      }

      setResendSuccess(true)
    } catch {
      setResendError('Unable to resend verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-6"
    >
      {/* Illustration */}
      <div className="relative mx-auto w-fit">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-cream border border-brand-border animate-fade-up shadow-sm">
          <MailCheck
            className="h-9 w-9 text-brand-gold"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
        <Sparkles
          className="absolute -right-2 -top-2 h-5 w-5 text-brand-gold/60 animate-pulse"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <Mail
          className="absolute -bottom-1 -left-3 h-4 w-4 text-[#A8A8A8]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      <div className="space-y-2.5">
        <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
          Verify your email
        </h2>
        <p className="text-xs text-[#737373] leading-relaxed max-w-sm mx-auto">
          We sent a verification link
          {email ? (
            <>
              {' '}
              to{' '}
              <span className="font-bold text-[#1A1A1A]">{email}</span>
            </>
          ) : (
            ' to your email address'
          )}
          . Please check your inbox and follow the link to activate your account.
        </p>
      </div>

      <AnimatePresence>
        {resendSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[10px] border border-[#C9A84C]/30 bg-[#F5EDD6]/40 px-4 py-3 text-xs text-[#1A1A1A] font-semibold"
            role="status"
          >
            Verification email sent. Please check your inbox.
          </motion.div>
        )}

        {resendError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-red-600 flex items-center justify-center gap-1.5"
            role="alert"
          >
            <AlertCircle size={14} className="shrink-0" />
            {resendError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="space-y-3 pt-2">
        <Button
          type="button"
          variant="gold"
          loading={isResending}
          className="w-full shadow-sm hover:shadow"
          size="lg"
          onClick={handleResend}
        >
          Resend Verification Email
        </Button>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#E8E5E0] bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] shadow-sm transition-all duration-200 hover:border-[#D4CFC9] hover:bg-[#FAF8F5] active:scale-[0.98]"
        >
          Back to Login
        </Link>
      </div>

      <p className="text-[11px] text-[#A8A8A8] leading-relaxed">
        Didn&apos;t receive the email? Check your spam folder or try resending.
      </p>
    </motion.div>
  )
}
