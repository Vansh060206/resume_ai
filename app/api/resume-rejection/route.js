"use client";

import { useState } from "react";

export default function RejectionReasons() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    setLoading(true);
    setError("");
    setReasons([]);

    try {
      const formData = new FormData();

      // TEMP: UI team can replace this with real resume data
      formData.append(
        "text",
        "Frontend developer with React and Next.js experience."
      );

      const res = await fetch("/api/resume-rejection", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setReasons(data.rejectionReasons);
    } catch (e) {
      setError("Unable to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">
        Top 3 Reasons This Resume Was Rejected
      </h2>

      <button
        onClick={analyzeResume}
        className="px-4 py-2 rounded-lg bg-black text-white"
      >
        Analyze Resume
      </button>

      {loading && (
        <p className="text-sm text-gray-500">
          Analyzing resume…
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-white dark:bg-zinc-900"
          >
            <h3 className="font-semibold mb-2">
              {reason.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
