export default function useEstimatedDelivery(orderDateStr, timeStr) {
  const orderDate = new Date(orderDateStr);
  orderDate.setDate(orderDate.getDate() + 3);
  let minDays = 0;
  let maxDays = 0;

  const match = timeStr.match(/(\d+)-(\d+)/);
  if (match) {
    // minDays = parseInt(match[1], 10);
    maxDays = parseInt(match[2], 10);
  } else {
    // যদি শুধু এক দিন থাকে "1 day"
    const singleMatch = timeStr.match(/(\d+)/);
    if (singleMatch) {
      // minDays = parseInt(singleMatch[1], 10);
      maxDays = minDays;
    }
  }

  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + minDays);

  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + maxDays);

  const options = { month: "short", day: "numeric" };
  return `${minDate.toLocaleDateString(
    "en-US",
    options
  )} – ${maxDate.toLocaleDateString("en-US", options)}`;
}
