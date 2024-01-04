import { useEffect, useState } from "preact/hooks";

export function Clock() {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const userLanguage = navigator.language;
      const options: Intl.DateTimeFormatOptions & { timeZoneName?: string, weekday?: 'long' } = {
        day: "numeric",
        weekday: "long",
        year: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: "short",
      };
      const newFormattedTime = new Intl.DateTimeFormat(userLanguage, options).format(now);
      setFormattedTime(newFormattedTime.replace(" at", " -"));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <>{formattedTime}</>;
}
