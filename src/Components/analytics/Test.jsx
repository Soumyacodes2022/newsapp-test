import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts"


const defaultData = [
  { date: "Mon", subscribers: 120, interactions: 300 },
  { date: "Tue", subscribers: 200, interactions: 450 },
  { date: "Wed", subscribers: 150, interactions: 400 },
  { date: "Thu", subscribers: 300, interactions: 500 },
  { date: "Fri", subscribers: 250, interactions: 420 },
  { date: "Sat", subscribers: 400, interactions: 600 },
  { date: "Sun", subscribers: 350, interactions: 550 },
]
export const Test = ({ data = defaultData }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 w-full">
      {/* Subscribers Line Chart */}
      <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold mb-2">Weekly Subscribers</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="subscribers"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interactions Bar Chart */}
      <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-semibold mb-2">Weekly Interactions</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="interactions" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}