/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Formats a date string or Date object to local date and time string
 * @param date - Date string or Date object
 * @returns Formatted string in local timezone
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date string or Date object to local time string
 * @param date - Date string or Date object
 * @returns Formatted time string in local timezone
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date string or Date object to local date string
 * @param date - Date string or Date object
 * @returns Formatted date string in local timezone
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

/**
 * Converts a UTC date string to local datetime-local input format (YYYY-MM-DDTHH:mm)
 * This accounts for timezone offset so the displayed time matches what the user sees
 * @param utcDateString - UTC date string from the API
 * @returns Local datetime string for datetime-local input
 */
export function toLocalDateTimeString(utcDateString: string): string {
  const date = new Date(utcDateString);
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a local datetime-local input value to UTC ISO string
 * The input value is in local timezone, so we need to convert to UTC for the API
 * @param localDateTimeString - Local datetime string from datetime-local input
 * @returns UTC ISO string for API
 */
export function toUTCDateTimeString(localDateTimeString: string): string {
  // datetime-local input returns format: YYYY-MM-DDTHH:mm
  // This is interpreted as local time by the Date constructor
  const date = new Date(localDateTimeString);
  return date.toISOString();
}

/**
 * Formats currency value
 * @param value - Numeric value
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
