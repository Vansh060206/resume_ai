'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, TrendingUp, Brain, Target, Map, Download, FileText, File, X, Loader2 } from 'lucide-react'
import ATSScoreCard from './ATSScoreCard'
import SkillsMatrix from './SkillsMatrix'
import LearningRoadmap from './LearningRoadmap'

export default function AnalysisResults({ result }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState(null)

  if (!result) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'ats', label: 'ATS Score', icon: Target },
    { id: 'skills', label: 'Skills', icon: TrendingUp },
    { id: 'roadmap', label: 'Roadmap', icon: Map }
  ]

  const aiAnalysis = result.ai_analysis || result
  const atsScore = result.ats_score
  const skills = result.skills
  const roadmap = result.roadmap

  const downloadFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Professional PDF report — ideal for printing and sharing',
      icon: File,
      color: 'from-red-500 to-rose-500',
      extension: '.pdf'
    },
    {
      id: 'docx',
      name: 'Word Document (DOCX)',
      description: 'Editable Word file — open in Microsoft Word or Google Docs',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      extension: '.docx'
    }
  ]

  const handleDownload = async (format) => {
    setDownloading(true)
    setDownloadFormat(format)

    try {
      const response = await fetch(`/api/export?format=download-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Get filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/i)
      const filename = filenameMatch ? filenameMatch[1] : `resume_analysis_${Date.now()}.${format}`

      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Show success and close modal
      setTimeout(() => {
        setShowDownloadModal(false)
        setDownloading(false)
        setDownloadFormat(null)
      }, 500)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download report. Please try again.')
      setDownloading(false)
      setDownloadFormat(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Overall Resume Score</h3>
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <motion.div
                className="flex items-center gap-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="8" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${aiAnalysis.overallScore * 2.83} 283`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 283' }}
                      animate={{ strokeDasharray: `${aiAnalysis.overallScore * 2.83} 283` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <text x="50" y="60" textAnchor="middle" className="text-2xl font-bold fill-gray-900 dark:fill-white">
                      {aiAnalysis.overallScore}
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">out of 100</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{aiAnalysis.summary}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Category Scores */}
            {aiAnalysis.scores && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detailed Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(aiAnalysis.scores).map(([category, score], idx) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600"
                    >
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">{category}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Strengths</h3>
              <div className="space-y-2">
                {aiAnalysis.strengths?.map((strength, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Areas for Improvement</h3>
              <div className="space-y-2">
                {aiAnalysis.improvements?.map((improvement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                  >
                    <AlertCircle className="text-amber-600 dark:text-amber-500 flex-shrink-0" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Actionable Recommendations</h3>
                <div className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <TrendingUp className="text-blue-600 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'ats' && (
          <motion.div
            key="ats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ATSScoreCard atsData={atsScore} />
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SkillsMatrix skillsData={skills} />
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LearningRoadmap roadmapData={roadmap} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setShowDownloadModal(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
      >
        <Download size={20} />
        Download Full Analysis Report
      </motion.button>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => !downloading && setShowDownloadModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Download Your Report</h2>
                      <p className="text-blue-100">Choose your preferred format</p>
                    </div>
                    <button
                      onClick={() => !downloading && setShowDownloadModal(false)}
                      disabled={downloading}
                      className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition disabled:opacity-50"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {downloadFormats.map((format) => {
                    const Icon = format.icon
                    const isDownloading = downloading && downloadFormat === format.id

                    return (
                      <motion.button
                        key={format.id}
                        whileHover={{ scale: downloading ? 1 : 1.02 }}
                        whileTap={{ scale: downloading ? 1 : 0.98 }}
                        onClick={() => !downloading && handleDownload(format.id)}
                        disabled={downloading}
                        className={`w-full p-6 rounded-xl border-2 transition-all text-left ${isDownloading
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'
                          } ${downloading && !isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${format.color} text-white`}>
                            {isDownloading ? (
                              <Loader2 size={24} className="animate-spin" />
                            ) : (
                              <Icon size={24} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {format.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {format.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {format.extension}
                              </span>
                              {isDownloading && (
                                <span className="text-xs text-blue-600 font-medium">
                                  Downloading...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    💡 Tip: PDF is best for sharing and printing; Word for editing!
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
