"use client";

import { useState } from "react";

export default function RejectionReasons() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeResume() {
    setLoading(true);
    setError("");
    setReasons([]);

    try {
      const formData = new FormData();
      formData.append("text", "PASTE RESUME TEXT HERE");
      // OR:
      // formData.append("file", selectedFile);

      const res = await fetch("/api/resume-rejection", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setReasons(data.rejectionReasons);
    } catch (err) {
      setError("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={analyzeResume}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Analyze Resume
      </button>

      {loading && <p className="text-sm text-gray-500">Analyzing…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 bg-white dark:bg-zinc-900"
          >
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {r.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
