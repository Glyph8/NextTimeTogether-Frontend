import { DateTimeValue } from "../hooks/use-create-promise";

export const convertToISO = (val: DateTimeValue) => {
  const { year, month, day, ampm, hour, minute } = val;
  let hourInt = parseInt(hour);
  
  if (ampm === "오후" && hourInt !== 12) hourInt += 12;
  if (ampm === "오전" && hourInt === 12) hourInt = 0;

  const date = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    hourInt,
    parseInt(minute)
  );

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
};