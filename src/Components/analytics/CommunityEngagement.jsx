import React from "react"

const defaultData = {
  comments: 28,
  upvotesGiven: 90,
  upvotesReceived: 75,
}

export default function CommunityEngagement({ data = defaultData }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2">💬 Community Engagement</h2>
      <ul className="space-y-2">
        <li>🗨️ Comments Posted: <strong>{data.comments}</strong></li>
        <li>👍 News Liked : <strong>{data.upvotesGiven}</strong></li>
        <li>💖 Total interaction Received: <strong>{data.upvotesReceived}</strong></li>
      </ul>
    </div>
  )
}
