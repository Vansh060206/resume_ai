'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2, Circle, ArrowLeft, Calendar, BookOpen,
    Code, Download, Share2, MoreHorizontal, Loader2, Sparkles,
    ChevronDown, ChevronRight, PlayCircle
} from 'lucide-react'

// Helper for local storage
const STORAGE_PREFIX = 'roadmap_progress_'

function getStorageKey(skill) {
    return `${STORAGE_PREFIX}${skill?.toLowerCase() || ''}`
}

function loadProgress(skill) {
    if (typeof window === 'undefined' || !skill) return new Set()
    try {
        const raw = localStorage.getItem(getStorageKey(skill))
        return new Set(raw ? JSON.parse(raw) : [])
    } catch {
        return new Set()
    }
}

function saveProgress(skill, completedSet) {
    if (typeof window === 'undefined' || !skill) return
    try {
        localStorage.setItem(getStorageKey(skill), JSON.stringify([...completedSet]))
    } catch { }
}

export default function RoadmapPage({ params }) {
    // Unwrap params using use() hook as per Next.js 15+ recommendations or direct access if compatible
    // We'll treat params as a promise or object depending on next version, but for client components in recent Next.js, 
    // params is often passed directly. To be safe with "use client", we access it directly or via use().
    // However, simpler is to just use the prop.

    // NOTE: In Next 13+ app dir client components, params are props.
    const { skill } = use(params)
    const decodedSkill = decodeURIComponent(skill)

    const searchParams = useSearchParams()
    const daysParam = searchParams.get('days') || '30'
    const roleParam = searchParams.get('role') || 'Sotware Engineer'

    const [roadmap, setRoadmap] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [completedTasks, setCompletedTasks] = useState(new Set())
    const [activeDay, setActiveDay] = useState(1)

    useEffect(() => {
        async function fetchRoadmap() {
            try {
                setLoading(true)
                // Check if we have cached roadmap data (optional optimization, skipping for now to ensure freshness)

                const res = await fetch('/api/roadmap?format=json', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skill: decodedSkill,
                        days: daysParam,
                        role: roleParam
                    })
                })

                if (!res.ok) throw new Error('Failed to generate roadmap')

                const json = await res.json()
                if (json.success) {
                    setRoadmap(json.data)
                    // Load progress
                    const saved = loadProgress(decodedSkill)
                    setCompletedTasks(saved)
                } else {
                    throw new Error(json.error || 'Unknown error')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (decodedSkill) {
            fetchRoadmap()
        }
    }, [decodedSkill, daysParam, roleParam])

    const toggleTask = (taskId) => {
        setCompletedTasks(prev => {
            const next = new Set(prev)
            if (next.has(taskId)) next.delete(taskId)
            else next.add(taskId)
            saveProgress(decodedSkill, next)
            return next
        })
    }

    // Calculate progress
    const totalTasks = roadmap?.daily_plan?.reduce((acc, day) => acc + day.tasks.length, 0) || 0
    const completedCount = completedTasks.size
    const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generating your personalized roadmap...</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Crafting a {daysParam}-day plan for {decodedSkill}</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Generation Failed</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                    <Link href="/analyze" className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:opacity-90">
                        Go Back
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/analyze" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {decodedSkill}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {daysParam} Days • {roleParam}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Progress Bar Label */}
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">{progressPercentage}% Complete</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{completedCount}/{totalTasks} Tasks</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-24 sm:w-32 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Learning Path</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{roadmap.summary}</p>

                            <div className="space-y-4">
                                {roadmap.daily_plan.map((day, idx) => {
                                    const dayId = day.day
                                    // Check if all tasks in this day are complete
                                    const allComplete = day.tasks.every(t => completedTasks.has(`${dayId}-${t}`))
                                    const someComplete = day.tasks.some(t => completedTasks.has(`${dayId}-${t}`))
                                    const isActive = activeDay === dayId

                                    return (
                                        <motion.div
                                            key={dayId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`border rounded-xl transition-all duration-300 overflow-hidden ${allComplete
                                                    ? 'border-green-200 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10'
                                                    : isActive
                                                        ? 'border-blue-500 ring-1 ring-blue-500 bg-white dark:bg-gray-800 shadow-md'
                                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setActiveDay(isActive ? null : dayId)}
                                                className="w-full flex items-center justify-between p-4 text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`
                             w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors
                             ${allComplete
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                                        }
                           `}>
                                                        {allComplete ? <CheckCircle2 size={20} /> : <span>Day {dayId}</span>}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold ${allComplete ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                                                            {day.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                                            {day.focus}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isActive ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                                            </button>

                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 px-4 pb-4 pt-2"
                                                    >
                                                        <div className="space-y-2 mt-2">
                                                            {day.tasks.map((task, i) => {
                                                                const taskId = `${dayId}-${task}`
                                                                const isChecked = completedTasks.has(taskId)

                                                                return (
                                                                    <label
                                                                        key={i}
                                                                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-white dark:hover:bg-gray-800'
                                                                            }`}
                                                                    >
                                                                        <div className="relative flex items-center pt-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox checkbox-primary w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                checked={isChecked}
                                                                                onChange={() => toggleTask(taskId)}
                                                                            />
                                                                        </div>
                                                                        <span className={`text-sm ${isChecked ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                                                                            {task}
                                                                        </span>
                                                                    </label>
                                                                )
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Stats */}
                    <div className="space-y-6">
                        {/* Overview Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-yellow-500" size={18} />
                                Roadmap Overview
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Target Role</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{roleParam}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Objectives</h4>
                                    <ul className="space-y-2">
                                        {roadmap.objectives.map((obj, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                                                {obj}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Resources</h4>
                                    <div className="space-y-2">
                                        {Object.entries(roadmap.resources || {}).map(([key, res]) => (
                                            res.url && (
                                                <a
                                                    key={key}
                                                    href={res.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                                >
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize flex items-center gap-2">
                                                        {key === 'best_course' && <PlayCircle size={14} />}
                                                        {key === 'documentation' && <BookOpen size={14} />}
                                                        {key === 'practice' && <Code size={14} />}
                                                        {key.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                                        {res.type || 'Link'}
                                                    </span>
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
