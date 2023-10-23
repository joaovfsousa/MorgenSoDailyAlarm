import { Event } from "./types";

type GetUrlQueryOptions = {
  accountId: string;
  calendarIds: string[];
  start: Date;
  end: Date;
};

const getUrlQuery = ({
  accountId,
  calendarIds,
  start,
  end,
}: GetUrlQueryOptions) => {
  const formattedCalendarIds = calendarIds.join(",");
  const startDateTime = start.toISOString();
  const endDateTime = end.toISOString();

  return `accountId=${accountId}&calendarIds=${formattedCalendarIds}&start=${startDateTime}&end=${endDateTime}`;
};

type GetCalendarEventsOptions = GetUrlQueryOptions;

type GetCalendarEventsResponse = {
  data: {
    events: Event[];
  };
};

export async function getCalendarEvents(options: GetCalendarEventsOptions) {
  const urlQuery = getUrlQuery(options);

  const response = await fetch(
    `https://api.morgen.so/v3/events/list?${urlQuery}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `ApiKey ${process.env.API_KEY}`,
      },
    },
  );

  const jsonResp = (await response.json()) as GetCalendarEventsResponse;

  return jsonResp;
}
