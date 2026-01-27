'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      category: 'General',
      items: [
        {
          q: 'What is ResumeAI?',
          a: 'ResumeAI is an AI-powered platform that analyzes your resume and provides detailed feedback to help you optimize it for maximum impact. We use machine learning to identify weaknesses and suggest improvements.',
        },
        {
          q: 'Who should use ResumeAI?',
          a: 'ResumeAI is perfect for anyone looking to improve their resume and increase their chances of getting interviews - whether you&apos;re a recent graduate, career-changer, or experienced professional.',
        },
        {
          q: 'How does ResumeAI work?',
          a: 'Simply upload your resume, and our AI will analyze it against industry standards, ATS optimization, content quality, and more. You&apos;ll get a detailed report with specific, actionable recommendations.',
        },
      ],
    },
    {
      category: 'Pricing & Billing',
      items: [
        {
          q: 'Is there a free trial?',
          a: 'Yes! Our Starter plan is completely free. It includes basic analysis and skills suggestions. For more features, you can upgrade to Professional or Enterprise plans.',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Absolutely! You can cancel your subscription at any time without penalties. If you cancel within 30 days, you&apos;ll receive a full refund.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and more.',
        },
      ],
    },
    {
      category: 'Features',
      items: [
        {
          q: 'What formats do you support?',
          a: 'We support PDF, DOC, DOCX, and TXT file formats. Maximum file size is 5MB.',
        },
        {
          q: 'Can I see my analysis history?',
          a: 'Yes! With an account, you can view all your previous analyses and track improvements over time.',
        },
        {
          q: 'Can I export my suggestions?',
          a: 'Yes, you can download a detailed PDF report of your analysis and recommendations.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      items: [
        {
          q: 'Is my resume data secure?',
          a: 'Absolutely! Your resume is encrypted and stored securely. We never share your data with third parties. Read our privacy policy for more details.',
        },
        {
          q: 'How long do you keep my data?',
          a: 'You can delete your data at any time. If you don&apos;t use your account for 12 months, we&apos;ll automatically delete it.',
        },
        {
          q: 'Do you use my resume for training?',
          a: 'No, we never use your resume data to train our AI models. Your privacy is our priority.',
        },
      ],
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Find answers to common questions about ResumeAI</p>
        </motion.div>

        {/* FAQ Sections */}
        <motion.div
          variants={containerVariants}
          className="space-y-8"
        >
          {faqs.map((section, sectionIdx) => (
            <motion.div
              key={sectionIdx}
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => {
                  const uniqueIndex = sectionIdx * 10 + itemIdx
                  return (
                    <motion.div
                      key={itemIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: itemIdx * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
                    >
                      <motion.button
                        onClick={() => setOpenIndex(openIndex === uniqueIndex ? -1 : uniqueIndex)}
                        className="w-full flex items-center justify-between p-6 text-left"
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.q}</span>
                        <motion.div
                          animate={{
                            rotate: openIndex === uniqueIndex ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="text-gray-600 flex-shrink-0" size={24} />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {openIndex === uniqueIndex && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200"
                          >
                            <p className="p-6 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Didn't find your answer?</h3>
          <p className="text-blue-100 mb-6">Get in touch with our support team</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
