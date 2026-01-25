'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, FileText, BarChart3, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const dropdownRef = useRef(null)
    const router = useRouter()

    useEffect(() => {
        // Get user from localStorage
        const userStr = localStorage.getItem('user')
        if (userStr) {
            try {
                const userData = JSON.parse(userStr)
                setUser(userData)
            } catch (err) {
                console.error('Failed to parse user data:', err)
            }
        }
    }, [])

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        router.push('/signin')
        setIsOpen(false)
    }

    if (!user) {
        return (
            <div className="flex items-center space-x-4">
                <Link
                    href="/signin"
                    className="text-gray-700 hover:text-blue-600 font-medium transition dark:text-gray-200 dark:hover:text-blue-400"
                >
                    Sign In
                </Link>
                <Link
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    Sign Up
                </Link>
            </div>
        )
    }

    const menuItems = [
        {
            icon: User,
            label: 'Profile',
            href: '/profile',
            description: 'Manage your account'
        },
        {
            icon: FileText,
            label: 'Dashboard',
            href: '/dashboard',
            description: 'View your resumes'
        },
        {
            icon: BarChart3,
            label: 'Analytics',
            href: '/dashboard',
            description: 'Track your progress'
        },
        {
            icon: Settings,
            label: 'Settings',
            href: '/profile',
            description: 'Preferences & settings'
        }
    ]

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.email?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-gray-700 dark:text-gray-200 font-medium">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                        {/* User Info Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.email?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className="text-sm text-white/80 truncate">
                                        {user.email || 'user@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            {menuItems.map((item, idx) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-lg flex items-center justify-center transition">
                                            <Icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Logout Button */}
                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition group"
                            >
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 rounded-lg flex items-center justify-center transition">
                                    <LogOut size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition">
                                        Sign Out
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Logout from your account</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
