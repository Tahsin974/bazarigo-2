export default function FormattedDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: "short", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
