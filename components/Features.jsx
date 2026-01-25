'use client'

import { motion } from 'framer-motion'
import { Zap, BarChart3, Lock, Lightbulb, Clock, Users, ArrowUpRight } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get detailed feedback on your resume in seconds with our lightning-fast AI engine.',
      color: 'amber'
    },
    {
      icon: BarChart3,
      title: 'Score & Metrics',
      description: 'See how your resume compares to industry standards with a comprehensive scoring system.',
      color: 'blue'
    },
    {
      icon: Lightbulb,
      title: 'AI Suggestions',
      description: 'Receive personalized, context-aware recommendations to improve specific bullet points.',
      color: 'purple'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted with bank-level security and deleted automatically after analysis.',
      color: 'emerald'
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Monitor your improvements over time with version history and progress tracking.',
      color: 'rose'
    },
    {
      icon: Users,
      title: 'Expert Insights',
      description: 'Benefit from resume best practices curated by top hiring managers and recruiters.',
      color: 'cyan'
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to create a standout resume that gets you hired.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 hover:cursor-pointer"
              >
                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors duration-300 pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-50 dark:bg-${feature.color}-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`text-${feature.color}-600 dark:text-${feature.color}-400`} size={28} />
                  </div>

                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-500" size={20} />
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.description}
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
