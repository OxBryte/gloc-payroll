// Helper function to get cookie value
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// utils/truncate.js
export const truncate = (text = "", maxLength = 50) => {
  const ellipsis = "...";

  if (typeof text !== "string") return "";
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};
