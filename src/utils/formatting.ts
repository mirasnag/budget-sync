// Format Date
export const formatDate = (date: Date | null): string => {
  if (!date) return "";

  const day = new Date(date).getDate();
  const month = new Date(date).toLocaleString("default", { month: "long" });
  const year = new Date(date).getFullYear();

  return `${month} ${day}, ${year}`;
};

export const formatDateMonthStr = (monthYear: string): string => {
  const date = new Date(monthYear + "-01");
  const month = new Date(date).toLocaleString("default", { month: "long" });
  const year = new Date(date).getFullYear();

  return `${month} ${year}`;
};

export const formatDateToInputValue = (date: Date | null): string => {
  if (!date) return "";

  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const dayStr = day < 10 ? `0${day}` : `${day}`;
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${monthStr}-${dayStr}`;
};

// Format Currency
export const formatCurrency = (amount: number, currency?: string) => {
  const amountStr = +(+amount).toFixed(2);
  const currencyStr = currency ? ` ${currency}` : "";
  return amountStr + currencyStr;
};

export const isBlankString = (str: string) => {
  return !str || /^\s*$/.test(str);
};
