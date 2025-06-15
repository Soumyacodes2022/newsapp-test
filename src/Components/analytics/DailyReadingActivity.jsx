import React from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

const defaultData = [
  { date: "Mon", articles: 3 },
  { date: "Tue", articles: 5 },
  { date: "Wed", articles: 2 },
  { date: "Thu", articles: 4 },
  { date: "Fri", articles: 6 },
  { date: "Sat", articles: 1 },
  { date: "Sun", articles: 4 },
]

export default function DailyReadingActivity({ data = defaultData }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2">📖 Daily Reading Activity</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="articles" stroke="#0ea5e9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
