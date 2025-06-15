import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"]

const defaultData = [
  { name: "Business", value: 10 },
  { name: "Entertainment", value: 8 },
  { name: "Health", value: 6 },
  { name: "Science", value: 5 },
  { name: "Sports", value: 7 },
  { name: "Technology", value: 9 },
]

export default function TopCategoriesRead({ data = defaultData }) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2">📊 Top Categories Read</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
