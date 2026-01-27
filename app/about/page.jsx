'use client'

import { motion } from 'framer-motion'
import { Users, Target, Zap, Heart } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To help job seekers stand out with perfectly optimized resumes.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community of career-minded professionals.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Using cutting-edge AI to provide actionable resume insights.',
    },
    {
      icon: Heart,
      title: 'Excellence',
      description: 'Committed to helping you achieve your career goals.',
    },
  ]

  const team = [
    {
      name: 'Vansh Mankani',
      role: 'Backend Developer',
     
    },
    {
      name: 'Om Nakrani',
      role: 'Backend Developer',
      
    },
    {
      name: 'Neel Kadchha',
      role: 'Database Engineer',
      description: 'Product strategist with career coaching background',
    },
    {
      name: 'Keval Hansaliya',
      role: 'Frontend Developer',
      description: 'UX/UI designer passionate about user experience',
    },
  ]

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
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">About ResumeAI</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We believe everyone deserves a resume that opens doors. Our mission is to provide AI-powered
            insights that help job seekers create compelling, optimized resumes that get noticed.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-12 mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            ResumeAI was founded in 2023 by a team of HR experts, developers, and career coaches
            who saw a problem: talented professionals were losing opportunities simply because their
            resumes weren&apos;t optimized for modern hiring practices.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We built ResumeAI to democratize career optimization. Our AI analyzes your resume against
            industry standards and hiring trends, providing actionable feedback to help you stand out.
            Today, we&apos;ve helped thousands of professionals land their dream jobs.
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={containerVariants}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 text-center hover:shadow-lg transition"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="inline-block mb-4"
                  >
                    <Icon className="text-blue-600 dark:text-blue-400" size={40} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          variants={containerVariants}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
                <div className="p-6 -mt-8 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-center mb-2">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">By the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Resumes Analyzed' },
              { number: '4.8★', label: 'Average Rating' },
              { number: '95%', label: 'Success Rate' },
              { number: '50+', label: 'Countries' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
