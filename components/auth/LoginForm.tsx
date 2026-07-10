'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginSchema, LoginFormValues } from '@/lib/validators/auth'
import { parseAuthError } from '@/lib/utils/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified') === '1'
  const passwordReset = searchParams.get('reset') === '1'
  const callbackError = searchParams.get('error') === 'auth_callback_error'

  const [serverError, setServerError] = useState<string | null>(null)
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const emailValue = watch('email')

  async function onSubmit(values: LoginFormValues) {
    setServerError(null)
    setEmailNotVerified(false)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        const parsed = parseAuthError(error.message)
        if (parsed.kind === 'email_not_verified') {
          setEmailNotVerified(true)
        } else {
          setServerError(parsed.message)
        }
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setServerError('Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <AnimatePresence mode="wait">
          {verified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[10px] border border-[#C9A84C]/30 bg-[#F5EDD6]/40 px-4 py-3.5 flex items-start gap-3 text-sm text-[#1A1A1A]"
              role="status"
            >
              <CheckCircle2 size={16} className="text-[#C9A84C] mt-0.5 shrink-0" />
              <span>Your email has been verified. You can now sign in.</span>
            </motion.div>
          )}

          {passwordReset && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[10px] border border-[#C9A84C]/30 bg-[#F5EDD6]/40 px-4 py-3.5 flex items-start gap-3 text-sm text-[#1A1A1A]"
              role="status"
            >
              <CheckCircle2 size={16} className="text-[#C9A84C] mt-0.5 shrink-0" />
              <span>Your password has been updated. Please sign in with your new password.</span>
            </motion.div>
          )}

          {callbackError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[10px] border-red-200 bg-red-50/50 px-4 py-3.5 flex items-start gap-3 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <span>Authentication link expired or is invalid. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            disabled={isLoading}
            className="pl-10"
            rightElement={
              <Mail className="h-4 w-4 text-[#A8A8A8]" />
            }
            {...register('email')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="password" required className="mb-0">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold uppercase tracking-widest text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
            className="pl-10 pr-12"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A8A8A8] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
          />
        </div>

        {/* Remember Me checkbox & layout */}
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              className="rounded-md border-[#E8E5E0] text-[#C9A84C] focus:ring-[#C9A84C] h-4 w-4 accent-[#C9A84C]"
            />
            <span className="text-xs font-semibold text-[#737373] group-hover:text-[#1A1A1A] transition-colors select-none">
              Remember me
            </span>
          </label>
        </div>

        <AnimatePresence>
          {emailNotVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[10px] border border-[#C9A84C]/30 bg-[#F5EDD6]/40 p-4 space-y-2.5"
              role="alert"
            >
              <p className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                <AlertCircle size={16} className="text-[#C9A84C] shrink-0" />
                Email verification required
              </p>
              <p className="text-xs text-[#737373] leading-relaxed">
                Please verify your email address before signing in. Check your inbox
                for the confirmation link we sent you.
              </p>
              <Link
                href={
                  emailValue
                    ? `/verify-email?email=${encodeURIComponent(emailValue)}`
                    : '/verify-email'
                }
                className="inline-block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-brand-gold transition-colors underline underline-offset-2"
              >
                Resend verification email
              </Link>
            </motion.div>
          )}

          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-red-600 flex items-center gap-1.5"
              role="alert"
            >
              <AlertCircle size={14} className="shrink-0" />
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          loading={isLoading}
          className="w-full shadow-sm hover:shadow"
          size="lg"
        >
          Sign In
        </Button>

        <p className="text-center text-xs text-[#737373] font-medium pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-[#1A1A1A] hover:text-[#C9A84C] transition-colors underline underline-offset-2">
            Create one
          </Link>
        </p>
      </form>
    </motion.div>
  )
}
