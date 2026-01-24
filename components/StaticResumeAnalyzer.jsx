import React from 'react';

export default function StaticResumeAnalyzer() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Resume Analyzer</h1>
          <p className="text-xl text-gray-500">Get AI-powered insights on why your resume might be rejected</p>
        </div>
        <div className="flex justify-end mb-8">
          <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold shadow">
            Analyze Resume
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Top 3 Reasons This Resume Was Rejected
        </h2>
        <div className="bg-red-100 border border-red-200 text-red-600 rounded-lg px-6 py-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span className="text-lg font-medium">Unable to analyze resume</span>
        </div>
      </div>
    </div>
  );
}
