/**
 * Utility functions for date operations in room booking system
 */

/**
 * Get the valid booking date range (current date + 0-6 days offset)
 * Uses Bangladesh (Dhaka) timezone
 * @returns Object with min and max date strings in YYYY-MM-DD format
 */
export const getBookingDateRange = () => {
  // Get current date in Bangladesh (Dhaka) timezone
  const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"}));
  const maxDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  return {
    min: today.toISOString().split('T')[0],
    max: maxDate.toISOString().split('T')[0]
  };
};

/**
 * Get formatted date string for display
 * Uses Bangladesh (Dhaka) timezone and locale
 * @param date Date object or date string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-BD', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Check if a date is within the valid booking range
 * Uses Bangladesh (Dhaka) timezone for comparison
 * @param date Date string in YYYY-MM-DD format
 * @returns Boolean indicating if date is valid for booking
 */
export const isValidBookingDate = (date: string): boolean => {
  const dateRange = getBookingDateRange();
  return date >= dateRange.min && date <= dateRange.max;
};
