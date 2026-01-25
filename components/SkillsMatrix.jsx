'use client'

import { motion } from 'framer-motion'
import { Code, Briefcase, Heart, TrendingUp, Plus } from 'lucide-react'

export default function SkillsMatrix({ skillsData }) {
    if (!skillsData) return null

    const { current, suggested, detected_role, skill_gap_count } = skillsData

    const categoryIcons = {
        languages: '💻',
        frameworks: '⚛️',
        databases: '🗄️',
        cloud: '☁️',
        tools: '🛠️',
        concepts: '🧠'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Detected Role: <span className="font-semibold text-blue-600 dark:text-blue-400">{detected_role}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{current.total_technical}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Technical Skills</p>
                </div>
            </div>

            {/* Current Technical Skills by Category */}
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Code size={20} className="text-blue-600 dark:text-blue-400" />
                    Current Technical Skills
                </h4>
                <div className="space-y-4">
                    {Object.entries(current.technical).map(([category, skills], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{categoryIcons[category] || '📌'}</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">({skills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, skillIdx) => (
                                    <motion.span
                                        key={skillIdx}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.1 + skillIdx * 0.05 }}
                                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Current Soft Skills */}
            {current.soft && current.soft.length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Heart size={20} className="text-pink-600 dark:text-pink-400" />
                        Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {current.soft.map((skill, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + idx * 0.05 }}
                                className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Skills */}
            {suggested && suggested.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                            Recommended Skills to Learn
                        </h4>
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {skill_gap_count} Skills
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggested.map((skill, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + idx * 0.05 }}
                                className="bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Plus size={14} />
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                        💡 Learning these skills will make you more competitive for <span className="font-semibold">{detected_role}</span> positions
                    </p>
                </motion.div>
            )}
        </motion.div>
    )
}
