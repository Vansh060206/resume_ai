'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <AlertCircle className="text-blue-600" size={80} />
          </motion.div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl font-bold text-gray-900 dark:text-white mb-2"
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 text-lg mb-8"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Home
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Contact Support
          </Link>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
          <div className="space-y-2">
            <Link href="/analyze" className="block text-blue-600 hover:text-blue-700 font-medium">
              → Analyze Resume
            </Link>
            <Link href="/pricing" className="block text-blue-600 hover:text-blue-700 font-medium">
              → Pricing Plans
            </Link>
            <Link href="/about" className="block text-blue-600 hover:text-blue-700 font-medium">
              → About Us
            </Link>
            <Link href="/faq" className="block text-blue-600 hover:text-blue-700 font-medium">
              → FAQ
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
