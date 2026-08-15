"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Backend request failed"
        );
      }

      const data = await response.json();

      setAnswer(data.answer);

    } catch (error) {

      setAnswer(
        "Unable to connect to the AI backend."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">

        <h1 className="text-4xl font-bold">
          AI Interview Coach
        </h1>

        <p className="mt-3 text-slate-400">
          AI-powered DSA and software engineering interview preparation.
        </p>

        <div className="mt-10">

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask a DSA interview question..."
            className="w-full rounded-xl border border-slate-700
                       bg-slate-900 p-4 outline-none
                       min-h-40"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="mt-4 rounded-xl bg-blue-600
                       px-6 py-3 font-medium
                       hover:bg-blue-500
                       disabled:opacity-50"
          >
            {loading
              ? "Thinking..."
              : "Ask AI"}
          </button>

        </div>

        {answer && (
          <div className="mt-10 rounded-xl
                          border border-slate-800
                          bg-slate-900 p-6">

            <h2 className="text-lg font-semibold">
              AI Response
            </h2>

            <p className="mt-4 whitespace-pre-wrap
                          leading-7 text-slate-300">
              {answer}
            </p>

          </div>
        )}

      </div>
    </main>
  );
}
