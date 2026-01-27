'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart3, FileText, TrendingUp, Settings, LogOut, AlertCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { resumeAPI, userAPI, authAPI } from '@/lib/api'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          router.push('/signin')
          return
        }

        const storedUser = JSON.parse(userStr)
        setUser(storedUser)
        const userId = storedUser?.uid || 'default_user'

        // Fetch user profile and resumes
        const [profileResponse, resumesResponse] = await Promise.all([
          userAPI.getProfile(),
          resumeAPI.list(1, 10),
        ])

        // Handle profile data with fallback
        const profile = profileResponse?.data?.data || {
          resumesAnalyzed: 0,
          resumeLimit: 10,
          subscription: 'free',
          email: storedUser.email || 'user@example.com'
        }

        const resumesList = resumesResponse?.data?.data?.resumes || []

        setResumes(resumesList)

        // Calculate stats
        const avgScore = resumesList.length > 0
          ? Math.round(resumesList.reduce((sum, r) => sum + Number(r.overallScore ?? r.atsScore ?? 0), 0) / resumesList.length)
          : 0

        setStats([
          {
            icon: FileText,
            label: 'Resumes Analyzed',
            value: (profile.resumesAnalyzed || resumesList.length).toString(),
            change: `${Math.max(0, (profile.resumeLimit || 10) - (profile.resumesAnalyzed || resumesList.length))} remaining`,
          },
          {
            icon: TrendingUp,
            label: 'Average Score',
            value: avgScore.toString(),
            change: (profile.subscription || 'free').charAt(0).toUpperCase() + (profile.subscription || 'free').slice(1),
          },
          {
            icon: BarChart3,
            label: 'Subscription',
            value: (profile.subscription || 'free').charAt(0).toUpperCase() + (profile.subscription || 'free').slice(1),
            change: profile.email || storedUser.email || 'user@example.com',
          },
        ])
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err.response?.data?.error || err.message || 'Failed to load dashboard. Please try again.')

        // Don't redirect on error, just show error message
        // Allow user to stay on dashboard with error displayed
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.clear()
      router.push('/signin')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here&apos;s your resume analysis summary</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/analyze"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Analyze New
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-lg font-semibold transition"
            >
              <LogOut size={20} className="inline mr-2" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</h3>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Resumes</h2>
            <Link href="/analyze" className="text-blue-600 hover:text-blue-700 font-medium">
              Upload New →
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No resumes uploaded yet</p>
              <Link href="/analyze" className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
                Upload your first resume →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">File Name</th>
                    <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">Score</th>
                    <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                    <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((resume, idx) => (
                    <motion.tr
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{resume.fileName}</td>
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                          {resume.overallScore || resume.score || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(resume.createdAt || resume.uploadedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${(resume.status || 'completed') === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                          {(resume.status || 'completed').charAt(0).toUpperCase() + (resume.status || 'completed').slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/resume/${resume.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View →
                        </Link>
                        <Link
                          href={`/resume/${resume.id}/trust`}
                          target="_blank"
                          className="text-purple-600 hover:text-purple-700 font-medium ml-4 flex items-center gap-1 inline-flex"
                        >
                          <Shield size={14} /> Trust Check
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
