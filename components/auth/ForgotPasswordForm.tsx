'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  ForgotPasswordSchema,
  ForgotPasswordFormValues,
} from '@/lib/validators/auth'
import { getAuthCallbackUrl, parseAuthError } from '@/lib/utils/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: getAuthCallbackUrl('/reset-password'),
        }
      )

      if (error) {
        setServerError(parseAuthError(error.message).message)
        return
      }

      setSuccess(true)
    } catch {
      setServerError('Unable to send reset email. Please try again.')
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
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="rounded-[10px] border border-[#C9A84C]/30 bg-[#F5EDD6]/40 p-5 space-y-3 flex flex-col items-center">
              <CheckCircle2 size={28} className="text-[#C9A84C] shrink-0" />
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Check your email
              </p>
              <p className="text-xs text-[#737373] leading-relaxed">
                We sent a password reset link to{' '}
                <span className="font-bold text-[#1A1A1A]">
                  {getValues('email')}
                </span>
                . Follow the instructions to recover access.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C9A84C] transition-colors underline underline-offset-2"
            >
              Back to login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
                rightElement={<Mail className="h-4 w-4 text-[#A8A8A8]" />}
                {...register('email')}
              />
            </div>

            {serverError && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5" role="alert">
                <AlertCircle size={14} className="shrink-0" />
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              loading={isLoading}
              className="w-full shadow-sm hover:shadow"
              size="lg"
            >
              Send Reset Link
            </Button>

            <p className="text-center text-xs text-[#737373] font-medium pt-2">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-bold text-[#1A1A1A] hover:text-[#C9A84C] transition-colors underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
