'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Phone, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export function LoginForm() {
  const router = useRouter()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [mobileError, setMobileError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startCountdown() {
    setCountdown(30)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
    return `+91${digits}`
  }

  async function handleSendOtp() {
    const digits = mobile.replace(/\D/g, '')
    if (!/^\d{10}$/.test(digits)) {
      setMobileError('Please enter a valid 10-digit mobile number')
      return
    }
    setMobileError('')
    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
      setOtpSent(true)
      startCountdown()
      toast.success('OTP sent (Test Mode: enter 0000)')
    }, 600)
  }

  async function handleVerify() {
    if (otp !== '0000') {
      setOtpError('Invalid OTP. For testing, use 0000.')
      return
    }
    setOtpError('')
    setIsVerifying(true)

    const formattedPhone = formatPhone(mobile)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      })

      const result = await res.json()
      setIsVerifying(false)

      if (result.ok) {
        document.cookie = `mannat-session=${encodeURIComponent(formattedPhone)}; path=/; max-age=86400; SameSite=Lax`
        toast.success('Signed in successfully!')
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('redirectTo') || '/dashboard'
        router.push(redirectTo)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to authenticate')
      }
    } catch {
      setIsVerifying(false)
      toast.error('An error occurred during sign in')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {!otpSent ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="phone" required variant="dark">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                placeholder="Enter 10-digit mobile number"
                error={mobileError}
                disabled={isSending}
                variant="dark"
                rightElement={<Phone className="h-4 w-4 text-[#C9A84C]/60" />}
              />
            </div>

            <Button
              onClick={handleSendOtp}
              loading={isSending}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              Get OTP <ArrowRight size={14} />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="space-y-5"
          >
            <div
              className="rounded-xl p-4 text-xs flex items-start gap-2.5"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
              <div>
                <p className="font-semibold mb-0.5" style={{ color: '#FAF3E8' }}>Verification Code Sent</p>
                <p style={{ color: 'rgba(250,243,232,0.55)' }}>
                  Sent to <span className="font-mono text-[#C9A84C]">{formatPhone(mobile)}</span>.{' '}
                  Enter <strong className="text-white">0000</strong> for testing.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" required variant="dark">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="0 0 0 0"
                error={otpError}
                disabled={isVerifying}
                variant="dark"
                className="text-center tracking-[0.4em] font-mono font-bold text-lg"
                rightElement={<KeyRound className="h-4 w-4 text-[#C9A84C]/60" />}
              />
            </div>

            <Button
              onClick={handleVerify}
              loading={isVerifying}
              className="w-full"
              size="lg"
            >
              Verify &amp; Sign In
            </Button>

            <div className="flex justify-between items-center text-xs pt-1">
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); setOtpError('') }}
                style={{ color: 'rgba(250,243,232,0.4)' }}
                className="hover:text-white transition-colors"
              >
                ← Change Number
              </button>
              {countdown > 0 ? (
                <span style={{ color: 'rgba(250,243,232,0.3)' }}>Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="font-semibold transition-colors"
                  style={{ color: '#C9A84C' }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
