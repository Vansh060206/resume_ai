'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Save,
  X,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CalendarDays,
  BadgeCheck,
} from 'lucide-react'
import Link from 'next/link'
import { userAPI } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    jobTitle: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          router.push('/signin')
          return
        }

        const storedUser = JSON.parse(userStr)
        setUser(storedUser)
        const userId = storedUser?.uid || 'default_user'

        const response = await userAPI.getProfile(userId)
        const profileData = response?.data?.data || {}

        setProfile({
          fullName: profileData.name || storedUser.displayName || '',
          email: profileData.email || storedUser.email || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          bio: profileData.bio || '',
          jobTitle: profileData.jobTitle || ''
        })
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const userId = user?.uid || 'default_user'
      await userAPI.updateProfile({
        userId,
        ...profile
      })

      setSuccess('Profile updated successfully!')
      setIsEditing(false)

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Profile update error:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/70 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-3"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Profile Center</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Keep your details fresh to get better insights.</p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={14} />
                  Editing Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
          >
            {success}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-fit"
          >
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-3xl font-bold">
                  {profile.fullName?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">Profile</p>
                  <h2 className="text-xl font-semibold">{profile.fullName || 'User'}</h2>
                  <p className="text-white/80 text-sm">{profile.jobTitle || 'Professional'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={16} className="text-indigo-600" />
                <span className="truncate">{profile.email || 'Email not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone size={16} className="text-indigo-600" />
                <span>{profile.phone || 'Phone not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="text-indigo-600" />
                <span>{profile.location || 'Location not set'}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Account secured
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CalendarDays size={16} className="text-blue-600" />
                  Joined {new Date().getFullYear()}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <BadgeCheck size={16} className="text-purple-600" />
                  ResumeAI Member
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Profile Strength', value: '82%', note: 'Keep it updated', color: 'from-indigo-500 to-blue-500' },
                { label: 'Resume Readiness', value: 'Pro', note: 'Active subscription', color: 'from-emerald-500 to-teal-500' },
                { label: 'Insight Level', value: 'Advanced', note: 'Personalized tips', color: 'from-purple-500 to-pink-500' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} text-white flex items-center justify-center mb-3`}>
                    <Sparkles size={18} />
                  </div>
                  <p className="text-xs text-gray-500">{card.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.note}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Details</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Edit the fields below to keep your profile current.</p>
                </div>
                {isEditing && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Unsaved changes
                  </span>
                )}
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-700 dark:text-white'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed dark:text-gray-400'
                      }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <MapPin size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    placeholder="City, Country"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <Briefcase size={16} />
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <User size={16} />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl transition ${isEditing
                      ? 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3 px-6 pb-6"
                >
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-70 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-70 text-gray-900 px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
