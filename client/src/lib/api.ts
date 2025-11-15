import type { EventWithCategory } from "@/types/event";

const API_BASE_URL = "http://localhost:8081";

export interface FetchEventsParams {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: string;
  location_like?: string;
  date_gte?: string;
  date_lte?: string;
}

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<EventWithCategory[]> {
  const {
    page = 1,
    limit = 12,
    q,
    categoryId,
    location_like,
    date_gte,
    date_lte,
  } = params;

  const queryParams = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
    _expand: "category",
  });

  if (q) queryParams.append("q", q);
  if (categoryId) queryParams.append("categoryId", categoryId);
  if (location_like) queryParams.append("location_like", location_like);
  if (date_gte) queryParams.append("date_gte", date_gte);
  if (date_lte) queryParams.append("date_lte", date_lte);

  const response = await fetch(`${API_BASE_URL}/events?${queryParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function fetchEventById(id: string): Promise<EventWithCategory> {
  const response = await fetch(
    `${API_BASE_URL}/events/${id}?_expand=category`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  return response.json();
}

export function getImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return "/placeholder-event.jpg"; 
  }
  
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  return `${API_BASE_URL}${imagePath}`;
}

