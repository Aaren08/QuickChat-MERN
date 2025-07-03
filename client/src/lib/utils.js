// create a formatMessageTime function which formats the time of a message using 12hr time.

function formatMessageTime(time) {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

export { formatMessageTime };
