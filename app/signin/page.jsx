'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { auth, googleProvider } from "@/app/firebase/config"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ EMAIL LOGIN (UNCHANGED)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const token = await user.getIdToken(true)

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
      }))

      router.push("/dashboard")
    } catch (error) {
      setError(error.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  // ✅ GOOGLE LOGIN (NEW)
  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const token = await user.getIdToken(true)

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
      setError("Google login failed")
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
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-[30px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* LEFT SIDE - Illustration */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-gray-700/50 hidden md:block relative overflow-hidden">
          <img
            src="/auth-illustration-new.jpg"
            alt="Resume AI Authentication"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradient for theme blending */}
          <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-900/40 mix-blend-overlay" />
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white dark:bg-gray-800">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to</h1>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">Resume AI</h1>

            {/* GOOGLE LOGIN */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-gray-700 dark:text-gray-200 font-medium mb-8"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">OR</span>
              </div>
            </div>

            {/* EMAIL LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="text-xs text-gray-500 ml-1 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs text-gray-500 ml-1 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  Remember me
                </label>
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
