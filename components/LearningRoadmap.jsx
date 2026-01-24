'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  BookOpen,
  FileText,
  Zap,
  CheckCircle2,
  Circle,
} from 'lucide-react'

const STORAGE_PREFIX = 'roadmap_progress_'

function getStorageKey(items) {
  if (!items?.length) return ''
  const skills = items.map((i) => i.skill).sort().join('|')
  return `${STORAGE_PREFIX}${skills}`
}

function loadCompleted(items) {
  if (typeof window === 'undefined' || !items?.length) return new Set()
  const key = getStorageKey(items)
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveCompleted(items, completed) {
  if (typeof window === 'undefined' || !items?.length) return
  const key = getStorageKey(items)
  try {
    localStorage.setItem(key, JSON.stringify([...completed]))
  } catch {}
}

const RESOURCE_CONFIG = [
  { key: 'best_course', label: 'Best Course', icon: GraduationCap, color: 'from-blue-500 to-indigo-500' },
  { key: 'documentation', label: 'Documentation', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
  { key: 'handbook', label: 'Handbook', icon: FileText, color: 'from-amber-500 to-orange-500' },
  { key: 'practice', label: 'Practice & Concepts', icon: Zap, color: 'from-purple-500 to-pink-500' },
]

const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
}

export default function LearningRoadmap({ roadmapData }) {
  const items = roadmapData?.items || []
  const totalTime = roadmapData?.total_time || '6-9 months'
  const role = roadmapData?.role || 'Software Engineer'
  const skillCount = items.length

  const [completedSkills, setCompletedSkills] = useState(() => loadCompleted(items))
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [filter, setFilter] = useState('all') // 'all' | 'free' | 'paid'

  const storageKey = useMemo(() => getStorageKey(items), [items])

  useEffect(() => {
    if (!storageKey) return
    setCompletedSkills(loadCompleted(items))
  }, [storageKey, items])

  useEffect(() => {
    if (storageKey && items.length) setExpandedIndex(0)
  }, [storageKey, items.length])

  const completedCount = completedSkills.size
  const progressPercent = skillCount > 0 ? Math.round((completedCount / skillCount) * 100) : 0

  const toggleComplete = (skill) => {
    setCompletedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      saveCompleted(items, next)
      return next
    })
  }

  const filterResource = (resource) => {
    if (!resource?.url) return false
    if (filter === 'all') return true
    if (filter === 'free') return (resource.type || '').toLowerCase() === 'free'
    if (filter === 'paid') return (resource.type || '').toLowerCase() === 'paid'
    return true
  }

  if (!roadmapData || !items.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <Target className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500">No roadmap data available. Upload a resume to get a personalized learning path.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Target size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Personalized Career Growth Roadmap</h2>
              <p className="text-purple-100 mt-1 text-sm sm:text-base">
                {skillCount} Skills · {totalTime}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-purple-100 text-sm sm:text-base max-w-2xl">
          Based on your resume analysis, we&apos;ve created a customized learning path to help you develop in-demand skills and boost your career prospects.
        </p>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Your Progress</span>
          <span className="text-sm font-medium text-gray-600">
            {completedCount} of {skillCount} completed
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Skill Sections (Accordion) */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isCompleted = completedSkills.has(item.skill)
          const isExpanded = expandedIndex === idx

          return (
            <motion.div
              key={item.skill}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Skill Header - Clickable */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition"
              >
                {/* Tick / Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleComplete(item.skill)
                  }}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all hover:scale-110"
                  style={{
                    borderColor: isCompleted ? '#10b981' : '#d1d5db',
                    backgroundColor: isCompleted ? '#10b981' : 'transparent',
                  }}
                  aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <CheckCircle2 size={22} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <Circle size={20} className="text-gray-400" strokeWidth={2} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{item.skill}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Intermediate
                      }`}
                    >
                      {item.difficulty || 'Intermediate'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {item.estimated_time}
                    </span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp size={22} className="text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown size={22} className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                      {/* Filter Tabs */}
                      <div className="flex gap-2 mb-4 mt-4">
                        {[
                          { id: 'all', label: 'All Resources' },
                          { id: 'free', label: 'Free' },
                          { id: 'paid', label: 'Paid' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              filter === tab.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* 4 Resource Cards */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {RESOURCE_CONFIG.map(({ key, label, icon: Icon, color }) => {
                          const res = item[key]
                          if (!res?.url || !filterResource(res)) return null
                          return (
                            <motion.a
                              key={key}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 }}
                              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all group"
                            >
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon size={20} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 group-hover:text-purple-700 truncate">
                                  {res.name}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <span>{res.source}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      (res.type || '').toLowerCase() === 'paid'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}
                                  >
                                    {res.type || 'Free'}
                                  </span>
                                </p>
                              </div>
                              <ExternalLink
                                size={18}
                                className="text-gray-400 group-hover:text-purple-600 flex-shrink-0"
                              />
                            </motion.a>
                          )
                        })}
                      </div>

                      {RESOURCE_CONFIG.every(({ key }) => !item[key]?.url || !filterResource(item[key])) && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No {filter === 'all' ? '' : filter} resources match. Try another filter.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg"
      >
        <h4 className="text-xl font-bold mb-2">Ready to Start Your Journey?</h4>
        <p className="text-purple-100 mb-4">
          Mark skills complete as you learn. Your progress is saved automatically.
        </p>
      </motion.div>
    </motion.div>
  )
}
