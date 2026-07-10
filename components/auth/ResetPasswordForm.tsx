'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  ResetPasswordSchema,
  ResetPasswordFormValues,
} from '@/lib/validators/auth'
import { parseAuthError } from '@/lib/utils/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils/cn'

export function ResetPasswordForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    }
  })

  const passwordValue = watch('password') || ''

  // Password strength logic
  const hasMinLength = passwordValue.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasNumber = /[0-9]/.test(passwordValue)

  let strengthScore = 0
  if (passwordValue.length > 0) {
    if (!hasMinLength) {
      strengthScore = 1 // Weak
    } else if (hasUppercase && hasNumber) {
      strengthScore = 3 // Strong
    } else {
      strengthScore = 2 // Medium
    }
  }

  const strengthLabels = ['', 'Weak', 'Medium', 'Strong']
  const strengthColors = [
    'bg-[#E8E5E0]', 
    'bg-red-500', 
    'bg-amber-500', 
    'bg-[#C5A85C]'
  ]

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setSessionReady(!!user)
      setCheckingSession(false)
    }

    checkSession()
  }, [])

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) {
        setServerError(parseAuthError(error.message).message)
        return
      }

      await supabase.auth.signOut()
      router.push('/login?reset=1')
      router.refresh()
    } catch {
      setServerError('Unable to update your password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex justify-center py-8">
        <span
          className="h-6 w-6 animate-spin rounded-full border-2 border-[#C5A85C] border-t-transparent"
          aria-label="Checking session validity..."
        />
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-5 text-center"
      >
        <div
          className="rounded-[10px] border border-red-200 bg-red-50/50 p-4 space-y-2 flex flex-col items-center text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={24} className="text-red-600 shrink-0" />
          <p className="font-semibold">Reset Link Invalid</p>
          <p className="text-xs text-red-600/80 leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C5A85C] transition-colors underline underline-offset-2"
        >
          Request new reset link
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Label htmlFor="password" required>
            New password
          </Label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Min. 8 characters"
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

          {/* Password strength indicator */}
          {passwordValue.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 space-y-2"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-[#737373]">Security Strength</span>
                <span className={cn(
                  strengthScore === 1 && 'text-red-500',
                  strengthScore === 2 && 'text-amber-500',
                  strengthScore === 3 && 'text-[#C5A85C]'
                )}>
                  {strengthLabels[strengthScore]}
                </span>
              </div>
              
              <div className="flex gap-1 h-1 w-full bg-[#E8E5E0] rounded-full overflow-hidden">
                <div className={cn('h-full transition-all duration-300 rounded-full', strengthColors[strengthScore])} style={{ width: `${(strengthScore / 3) * 100}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#A8A8A8]">
                <span className={cn('flex items-center gap-1 transition-colors', hasMinLength ? 'text-[#C5A85C]' : '')}>
                  {hasMinLength ? <Check size={8} className="stroke-[3]" /> : '•'} 8+ Chars
                </span>
                <span className={cn('flex items-center gap-1 transition-colors', hasUppercase ? 'text-[#C5A85C]' : '')}>
                  {hasUppercase ? <Check size={8} className="stroke-[3]" /> : '•'} Uppercase
                </span>
                <span className={cn('flex items-center gap-1 transition-colors', hasNumber ? 'text-[#C5A85C]' : '')}>
                  {hasNumber ? <Check size={8} className="stroke-[3]" /> : '•'} Number
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm_password" required>
            Confirm password
          </Label>
          <Input
            id="confirm_password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirm_password?.message}
            disabled={isLoading}
            className="pl-10 pr-12"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#A8A8A8] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('confirm_password')}
          />
        </div>

        <AnimatePresence>
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
          Update Password
        </Button>
      </form>
    </motion.div>
  )
}
