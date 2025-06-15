import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const defaultData = [
  { category: "Business", bookmarks: 12 },
  { category: "Entertainment", bookmarks: 9 },
  { category: "Health", bookmarks: 7 },
  { category: "Science", bookmarks: 5 },
  { category: "Sports", bookmarks: 11 },
  { category: "Technology", bookmarks: 14 },
]

export default function BookmarkInsights({ data = defaultData }) {
  const totalBookmarks = data.reduce((sum, item) => sum + item.bookmarks, 0)

  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white dark:bg-zinc-900">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-lg font-semibold">🔖 Bookmark Insights</h2>
        <p className="text-sm text-muted-foreground">
          Total Bookmarks: <span className="font-medium">{totalBookmarks}</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookmarks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
