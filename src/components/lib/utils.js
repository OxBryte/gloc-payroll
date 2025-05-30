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

// Utility function to format numbers with commas
export const formatNumberWithCommas = (number) => {
  if (typeof number !== "number") return "";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// utility function tp export employees to CSV
export const exportEmployeesToCSV = (
  employees,
  workspaceName = "Workspace"
) => {
  if (!employees || employees.length === 0) {
    alert("No employees to export");
    return;
  }

  // Define CSV headers
  const headers = [
    "Employee ID",
    "Name",
    "Email",
    "Role",
    "Employment Type",
    "Wallet Address",
    "Salary",
    "Employement Date",
  ];

  // Convert employees data to CSV format
  const csvData = employees.map((emp) => [
    emp.id || "",
    emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
    emp.email || "",
    emp.role || "",
    emp.employmentType || "",
    emp.address || "",
    emp.salary || 0,
    emp.employmentDate || emp.createdAt || "",
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${workspaceName}_employees_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
