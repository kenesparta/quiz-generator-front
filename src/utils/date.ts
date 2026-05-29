const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function formatFecha(input: string | Date | null | undefined): string {
  if (input === null || input === undefined || input === "") return "—";

  if (typeof input === "string" && DATE_ONLY_REGEX.test(input)) {
    const [year, month, day] = input.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return typeof input === "string" ? input : "—";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const rawHours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = rawHours >= 12 ? "pm" : "am";
  const hours12 = rawHours % 12 || 12;
  const hours = String(hours12).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes} ${period}`;
}
