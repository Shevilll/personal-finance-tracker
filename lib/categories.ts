export const EXPENSE_CATEGORIES = [
  { id: "food", name: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
  { id: "transportation", name: "Transportation", color: "#4ECDC4", icon: "🚗" },
  { id: "shopping", name: "Shopping", color: "#45B7D1", icon: "🛍️" },
  { id: "entertainment", name: "Entertainment", color: "#96CEB4", icon: "🎬" },
  { id: "bills", name: "Bills & Utilities", color: "#FFEAA7", icon: "💡" },
  { id: "healthcare", name: "Healthcare", color: "#DDA0DD", icon: "🏥" },
  { id: "education", name: "Education", color: "#98D8C8", icon: "📚" },
  { id: "travel", name: "Travel", color: "#F7DC6F", icon: "✈️" },
  { id: "fitness", name: "Fitness & Sports", color: "#BB8FCE", icon: "💪" },
  { id: "other", name: "Other", color: "#AEB6BF", icon: "📦" },
] as const

export type CategoryId = (typeof EXPENSE_CATEGORIES)[number]["id"]

export function getCategoryById(id: string) {
  return EXPENSE_CATEGORIES.find((cat) => cat.id === id) || EXPENSE_CATEGORIES.find((cat) => cat.id === "other")!
}

export function getCategoryColor(id: string) {
  return getCategoryById(id).color
}
