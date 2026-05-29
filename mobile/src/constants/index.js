export const PRIORITY_CONFIG = {
  low: { label: "Low", color: "#10b981", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: "⬇️" },
  medium: { label: "Medium", color: "#f59e0b", bg: "bg-amber-500/20", text: "text-amber-400", icon: "➡️" },
  high: { label: "High", color: "#ef4444", bg: "bg-red-500/20", text: "text-red-400", icon: "⬆️" },
};

export const CATEGORY_CONFIG = {
  personal: { label: "Personal", icon: "👤", color: "#8b5cf6" },
  work: { label: "Work", icon: "💼", color: "#3b82f6" },
  shopping: { label: "Shopping", icon: "🛒", color: "#ec4899" },
  health: { label: "Health", icon: "❤️", color: "#10b981" },
  other: { label: "Other", icon: "📌", color: "#6b7280" },
};

export const FILTER_OPTIONS = {
  priority: ["low", "medium", "high"],
  category: ["personal", "work", "shopping", "health", "other"],
};
