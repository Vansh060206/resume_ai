'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ATSScoreCard({ atsData }) {
  if (!atsData) return null

  const {
    overall_score = 0,
    category_scores = {},
    recommendations = [],
    ats_friendly = false
  } = atsData || {}

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
  }

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const categories = [
    { key: 'contact_information', label: 'Contact Info', icon: '📧' },
    { key: 'formatting', label: 'Formatting', icon: '📄' },
    { key: 'keywords', label: 'Keywords', icon: '🔑' },
    { key: 'section_completeness', label: 'Sections', icon: '📋' },
    { key: 'action_verbs', label: 'Action Verbs', icon: '⚡' },
    { key: 'length', label: 'Length', icon: '📏' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">ATS Compatibility Score</h3>
        {ats_friendly ? (
          <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
        ) : (
          <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={32} />
        )}
      </div>

      {/* Overall Score */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className={`rounded-xl p-6 border-2 ${getScoreColor(overall_score)}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1 dark:text-gray-300">Overall ATS Score</p>
            <p className="text-5xl font-bold">{overall_score}</p>
            <p className="text-sm mt-1 dark:text-gray-400">out of 100</p>
          </div>
          <div className="text-right">
            {ats_friendly ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp size={24} />
                <span className="font-semibold">ATS Friendly</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <TrendingDown size={24} />
                <span className="font-semibold">Needs Improvement</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Scores */}
      {category_scores && Object.keys(category_scores).length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h4>
          <div className="space-y-4">
            {categories.map((category, idx) => {
              const score = Math.round(category_scores[category.key] || 0)
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{category.label}</span>
                    </div>
                    <span className={`font-bold ${score >= 80 ? 'text-green-600 dark:text-green-400' : score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.4 + idx * 0.1, duration: 0.8 }}
                      className={`h-2.5 rounded-full ${getProgressColor(score)}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h4>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
