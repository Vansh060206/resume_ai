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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-[30px] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[600px]"
      >
        {/* RIGHT SIDE (Illustration) - reversed for sign up */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-700/50 hidden md:block relative overflow-hidden">
          <img
            src="/auth-illustration-new.jpg"
            alt="Resume AI Authentication"
            className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
          />
          {/* Overlay gradient for theme blending */}
          <div className="absolute inset-0 bg-green-600/10 dark:bg-green-900/40 mix-blend-overlay" />
        </div>

        {/* LEFT SIDE (Form) */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white dark:bg-gray-800">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get Started With</h1>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-8">Resume AI</h1>

            {/* GOOGLE SIGN UP */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-gray-700 dark:text-gray-200 font-medium mb-8"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">OR</span>
              </div>
            </div>

            {/* EMAIL SIGN UP FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 text-sm"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span>I agree to the <a href="#" className="underline hover:text-green-600">Terms</a> & <a href="#" className="underline hover:text-green-600">Privacy Policy</a></span>
              </label>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all transform hover:scale-[1.02] mt-4"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{' '}
              <Link href="/signin" className="text-green-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
