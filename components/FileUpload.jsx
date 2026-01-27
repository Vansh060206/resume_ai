'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, TrendingUp } from 'lucide-react'

export default function FileUpload({ onAnalysis }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    setError('')

    if (!selectedFile.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError('Please upload a valid resume file (PDF, DOC, DOCX, TXT)')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a file first')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setProgress(0)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)

      // Add userId if available
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user.uid) {
            formData.append('userId', user.uid)
          }
        } catch (e) {
          console.error('Failed to parse user data', e)
        }
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 500)

      // Call Next.js API route
      const response = await fetch('/api/analysis', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      // Better error handling for non-JSON responses
      if (!response.ok) {
        let errorMessage = 'Analysis failed'
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } else {
          // Response is not JSON (likely HTML error page)
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Parse JSON response
      const result = await response.json()

      if (result.success && result.data) {
        onAnalysis(result.data)
      } else {
        throw new Error('Invalid response from server')
      }

    } catch (err) {
      console.error('Analysis error:', err)

      // Better error messages
      let userMessage = err.message
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        userMessage = '❌ Cannot connect to server!\n\nPlease ensure:\n1. Next.js server is running\n2. Run: npm run dev'
      }

      setError(userMessage || 'Failed to analyze resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-3 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${isDragging
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-700'
          }`}
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-block"
          >
            <Upload className="text-blue-600 mx-auto mb-4" size={48} />
          </motion.div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Drop your resume here
          </p>
          <p className="text-gray-600 dark:text-gray-400">or click to browse</p>
          <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, TXT - Max 10MB</p>
        </label>
      </motion.div>

      {/* File Display */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <CheckCircle className="text-green-600" size={24} />
        </motion.div>
      )}

      {/* Progress Bar */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Analyzing your resume...</span>
            <span className="text-blue-600 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {progress < 30 && 'Extracting text from document...'}
            {progress >= 30 && progress < 60 && 'Analyzing with AI...'}
            {progress >= 60 && progress < 90 && 'Calculating ATS score and extracting skills...'}
            {progress >= 90 && 'Generating learning roadmap...'}
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Analysis Failed</p>
            <p className="text-sm text-red-700 whitespace-pre-line mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Analyze Button */}
      {file && !isAnalyzing && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
        >
          <TrendingUp size={20} />
          Analyze Resume with AI
        </motion.button>
      )}

      {isAnalyzing && (
        <motion.button
          disabled
          className="w-full bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <Loader2 className="animate-spin" size={20} />
          Analyzing...
        </motion.button>
      )}
    </div>
  )
}
