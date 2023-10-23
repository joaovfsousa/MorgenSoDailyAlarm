export async function fetchCalendarList() {
  const response = await fetch("https://api.morgen.so/v3/calendars/list", {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `ApiKey ${process.env.API_KEY}`,
    },
  });

  return (await response.json()) as Record<string, unknown>;
}
