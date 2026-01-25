'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Gradient and Blur */}
      <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900" />
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 text-sm font-semibold mb-6 border border-blue-400/30 backdrop-blur-sm">
          Limited Time Offer
        </span>

        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
          Ready to Transform <br /> Your Career?
        </h2>

        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of professionals who have already secured their dream jobs with ResumeAI. Fast, easy, and effective.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Link
            href="/analyze"
            className="group flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20"
          >
            <Sparkles size={20} className="fill-blue-600" />
            Start Analyzing for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <p className="mt-6 text-sm text-blue-200/80">
          No credit card required. Instant analysis.
        </p>
      </motion.div>
    </section>
  )
}
