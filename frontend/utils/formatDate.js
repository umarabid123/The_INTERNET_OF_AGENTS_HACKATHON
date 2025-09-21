export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatTime = (timeString) => {
  return timeString
}
