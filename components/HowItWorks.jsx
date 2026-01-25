'use client'

import { motion } from 'framer-motion'
import { Upload, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Upload your current resume in PDF or DOCX format. We secure your data with enterprise-grade encryption.',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Instant AI Analysis',
      description: 'Our advanced algorithms scan for ATS compatibility, keyword gaps, and formatting issues in milliseconds.',
      color: 'purple'
    },
    {
      icon: CheckCircle,
      title: 'Actionable Insights',
      description: 'Get a detailed report with specific, step-by-step recommendations to boost your interview chances.',
      color: 'emerald'
    },
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your resume from ordinary to outstanding in three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 dark:from-blue-900 dark:via-purple-900 dark:to-emerald-900 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center text-center">
                  {/* Icon Wrapper */}
                  <div className={`w-24 h-24 rounded-2xl bg-${step.color}-50 dark:bg-${step.color}-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`text-${step.color}-600 dark:text-${step.color}-400`} size={40} />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400">
                    {idx + 1}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
