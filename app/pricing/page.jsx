'use client'

import { motion } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Upload 1 resume per month',
        'Basic score analysis',
        'Skills suggestions',
        'Email support',
      ],
      notIncluded: [
        'Priority support',
        'Resume rewriting',
        'Unlimited uploads',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Professional',
      price: '$9.99',
      period: 'per month',
      description: 'For active job seekers',
      features: [
        'Unlimited resume uploads',
        'Advanced score analysis',
        'AI-powered suggestions',
        'Resume rewriting tips',
        'Email support',
        'Monthly reports',
      ],
      notIncluded: [
        'Priority support',
        'Dedicated consultant',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: 'per month',
      description: 'For professionals',
      features: [
        'Everything in Professional',
        'Priority email support',
        'Phone support',
        'Dedicated consultant',
        'Advanced analytics',
        'Batch processing',
        'API access',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      highlight: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan to optimize your resume and land your dream job
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`rounded-lg p-8 transition ${plan.highlight
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-600 shadow-xl'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-600 dark:text-gray-400 ml-2">{plan.period}</span>}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full font-semibold py-3 px-4 rounded-lg mb-8 transition ${plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
              >
                {plan.cta}
              </motion.button>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm">Included:</p>
                {plan.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Not Included */}
              {plan.notIncluded.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-gray-300 dark:border-gray-700">
                  {plan.notIncluded.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <X className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={20} />
                      <span className="text-gray-500 dark:text-gray-500">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time without penalties.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Our Starter plan is free and includes basic features.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and more.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, 30-day money-back guarantee if you\'re not satisfied.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
