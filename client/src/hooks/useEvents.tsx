import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api";
import type { FetchEventsParams } from "@/lib/api";

const EVENTS_PER_PAGE = 12;

export function useEvents(params: FetchEventsParams = {}) {
  const { page = 1, limit = EVENTS_PER_PAGE, ...filters } = params;

  return useQuery({
    queryKey: ["events", { page, limit, ...filters }],
    queryFn: () => fetchEvents({ page, limit, ...filters }),
    keepPreviousData: false, 
  });
}

