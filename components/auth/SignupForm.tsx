'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SignupSchema, SignupFormValues } from '@/lib/validators/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export function SignupForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  })

  async function onSubmit(values: SignupFormValues) {
    setServerError(null)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('An account with this email already exists.')
      } else {
        setServerError(error.message)
      }
      return
    }

    // Auto sign in after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (signInError) {
      setSuccess(true)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (success) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-700 font-medium">
          Account created successfully.
        </p>
        <p className="text-sm text-gray-500">
          Please check your email to confirm your account.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-900 underline underline-offset-2"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      <div>
        <Label htmlFor="full_name" required>
          Full name
        </Label>
        <Input
          id="full_name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
      </div>

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
          {...register('email')}
        />
      </div>

      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div>
        <Label htmlFor="confirm_password" required>
          Confirm password
        </Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
      </div>

      {serverError && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        size="lg"
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-gray-900 underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}