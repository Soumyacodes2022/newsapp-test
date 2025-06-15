import { useState } from "react"
import BookmarkInsights from "./analytics/BookmarkInsights"
import CommunityEngagement from "./analytics/CommunityEngagement"
import DailyReadingActivity from "./analytics/DailyReadingActivity"
import TopCategoriesRead from "./analytics/TopCategoriesRead"
import Bookmark from "./Bookmark"
// import BookmarkList from "./analytics/BookmarkList"

const tabs = [
  { label: "📊 Analytics", value: "analytics" },
  { label: "🔖 Bookmarks", value: "bookmarks" },
]

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("analytics")

  return (
    <div className="flex p-6 gap-6">
      {/* Sidebar */}
      <div className="w-48 flex flex-col gap-2 border-r pr-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`text-left px-3 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-6">
            <DailyReadingActivity />
            <BookmarkInsights />
            <CommunityEngagement />
            <TopCategoriesRead />
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">🔖 Saved Bookmarks</h2>
            <Bookmark/>
          </div>
        )}
      </div>
    </div>
  )
}
