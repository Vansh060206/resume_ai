'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FileUpload from '@/components/FileUpload'
import AnalysisResults from '@/components/AnalysisResults'
import RejectionReasons from '@/components/RejectionReasons' // ✅ ADD

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Analyze Your Resume
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Upload your resume and get AI-powered insights to improve it
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT: Upload */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-fit"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Resume
            </h2>
            <FileUpload onAnalysis={setAnalysisResult} />
          </motion.div>

          {/* RIGHT: Results */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-10"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Analysis Results
                </h2>
                <AnalysisResults result={analysisResult} />
              </div>

              {/* ✅ NEW SECTION */}
              <RejectionReasons />
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  )
}
