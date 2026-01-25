'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { auth, googleProvider } from "@/app/firebase/config"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ✅ EMAIL SIGN UP
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!Object.values(formData).every(v => v)) {
        throw new Error("Please fill in all fields")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!agreedToTerms) {
        throw new Error("Please agree to the terms")
      }

      // 1️⃣ Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = cred.user

      // 2️⃣ Token
      const token = await user.getIdToken(true)

      // 3️⃣ Backend register
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName: formData.fullName,
        }),
      })

      // 4️⃣ Store auth
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
      }))

      // 5️⃣ Redirect
      router.push("/dashboard")

    } catch (err) {
      setError(err.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  // 🔵 GOOGLE SIGN UP
  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const token = await user.getIdToken(true)

      // Backend register (Google users too)
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName: user.displayName || "Google User",
        }),
      })

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      }))

      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Google sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <motion.div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Create Account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* EMAIL SIGN UP */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded"
            required
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded"
            required
          />

          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded"
            required
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            I agree to terms & privacy policy
          </label>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded font-semibold"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* GOOGLE SIGN UP */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border dark:border-gray-600 py-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-green-600 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
