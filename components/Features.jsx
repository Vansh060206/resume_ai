'use client'

import { motion } from 'framer-motion'
import { Zap, BarChart3, Lock, Lightbulb, Clock, Users } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get detailed feedback on your resume in seconds',
    },
    {
      icon: BarChart3,
      title: 'Score & Metrics',
      description: 'See how your resume compares to industry standards',
    },
    {
      icon: Lightbulb,
      title: 'AI Suggestions',
      description: 'Receive personalized recommendations to improve',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared',
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Monitor improvements over time',
    },
    {
      icon: Users,
      title: 'Expert Insights',
      description: 'Based on hiring manager best practices',
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create a standout resume
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 rounded-lg p-8 hover:shadow-lg transition duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="mb-4"
                >
                  <Icon className="text-blue-600 dark:text-blue-400" size={40} />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
