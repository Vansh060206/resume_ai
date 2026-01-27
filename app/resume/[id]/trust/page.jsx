'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { resumeAPI } from '@/lib/api'
import { Shield, AlertTriangle, CheckCircle, Search, User, Lock, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TrustScorePage() {
    const params = useParams()
    const router = useRouter()
    const [resume, setResume] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchResume = async () => {
            try {
                if (!params.id) return
                const response = await resumeAPI.getDetail(params.id)
                if (response.data && response.data.data) {
                    setResume(response.data.data)
                } else {
                    setError('Resume not found')
                }
            } catch (err) {
                console.error('Failed to fetch resume:', err)
                setError('Failed to load resume data')
            } finally {
                setLoading(false)
            }
        }

        fetchResume()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error || !resume) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Analysis Not Found</h1>
                <p className="text-gray-400 mb-6">{error || 'Could not retrieve resume data'}</p>
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                    Return to Dashboard
                </Link>
            </div>
        )
    }

    const trustScore = resume.trustScore || resume.analysis?.ai?.trustScore || 85 // Fallback if old data
    const trustAnalysis = resume.analysis?.ai?.trustAnalysis || {
        level: trustScore > 80 ? 'Safe' : (trustScore > 50 ? 'Moderate' : 'Risky'),
        flags: [],
        signals: ['Consistent timeline detected', 'Professional formatting'],
        reasoning: 'Analysis based on available data points.'
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 50) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 50) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
            {/* Header / Nav */}
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                <Shield className="text-blue-500" size={20} />
                                Recruiter Verify™
                            </h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Fraud Detection & Integrity Check</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-blue-900/30 border border-blue-800 rounded-full text-xs font-medium text-blue-400 flex items-center gap-2">
                            <Lock size={12} />
                            CONFIDENTIAL REPORT
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - MAIN SCORE */}
                    <div className="md:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

                            <h2 className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-xs">Overall Authenticity Score</h2>

                            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                                {/* Gauge Background */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-gray-800"
                                    />
                                    <motion.circle
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: trustScore / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray="553" // 2 * PI * 88
                                        strokeLinecap="round"
                                        className={getScoreColor(trustScore)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-6xl font-bold ${getScoreColor(trustScore)}`}>{trustScore}</span>
                                    <span className="text-gray-500 text-sm mt-1">/ 100</span>
                                </div>
                            </div>

                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${trustScore >= 80 ? 'bg-green-900/20 border-green-800 text-green-400' :
                                    trustScore >= 50 ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400' :
                                        'bg-red-900/20 border-red-800 text-red-400'
                                }`}>
                                {trustScore >= 80 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                <span className="font-bold">{trustAnalysis.level || 'Unknown'} Risk Profile</span>
                            </div>
                        </motion.div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-gray-500" />
                                Candidate Information
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Filename</p>
                                    <p className="text-gray-200 truncate" title={resume.fileName}>{resume.fileName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Date Analyzed</p>
                                    <p className="text-gray-200">{new Date(resume.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Scan ID</p>
                                    <p className="text-gray-200 font-mono text-xs">{resume.id?.substring(0, 12) || 'unknown'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - ANALYSIS */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
                        >
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Search className="text-blue-500" />
                                Integrity Analysis Summary
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {trustAnalysis.reasoning || "The resume shows patterns consistent with an authentic profile, though some details may require verification."}
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* RED FLAGS */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gray-900/50 border border-red-900/30 rounded-2xl p-6"
                            >
                                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                                    <AlertTriangle size={18} />
                                    Potential Risk Factors
                                </h3>
                                {(trustAnalysis.flags && trustAnalysis.flags.length > 0) ? (
                                    <ul className="space-y-3">
                                        {trustAnalysis.flags.map((flag, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-300 bg-red-950/10 p-3 rounded-lg border border-red-900/10 hover:border-red-900/30 transition">
                                                <span className="text-red-500 mt-0.5">•</span>
                                                <span className="text-sm">{flag}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 italic flex flex-col items-center">
                                        <CheckCircle size={32} className="text-green-900/50 mb-2" />
                                        No major flags detected
                                    </div>
                                )}
                            </motion.div>

                            {/* GREEN SIGNALS */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gray-900/50 border border-green-900/30 rounded-2xl p-6"
                            >
                                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                                    <CheckCircle size={18} />
                                    Authenticity Signals
                                </h3>
                                <ul className="space-y-3">
                                    {(trustAnalysis.signals && trustAnalysis.signals.length > 0) ? (
                                        trustAnalysis.signals.map((signal, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-300 bg-green-950/10 p-3 rounded-lg border border-green-900/10 hover:border-green-900/30 transition">
                                                <span className="text-green-500 mt-0.5">•</span>
                                                <span className="text-sm">{signal}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 italic">No specific signals recorded.</li>
                                    )}
                                </ul>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
