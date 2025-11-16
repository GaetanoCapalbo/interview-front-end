import type { EventWithCategory, Category } from "@/types/event";
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
    throw new Error("Fallito ricerca degli eventi");
  }

  return response.json();
}

export async function fetchEventById(id: string): Promise<EventWithCategory> {
  const response = await fetch(
    `${API_BASE_URL}/events/${id}?_expand=category`
  );

  if (!response.ok) {
    throw new Error("Fallito ricerca dell'evento");
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


export async function markAttendance(eventId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Fallito aggiunta partecipazione");
  }
}

export async function removeAttendance(): Promise<void> {

  return Promise.resolve();
}

export async function addToFavorites(eventId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/favorites`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Fallito aggiunta ai preferiti");
  }
}

export async function removeFromFavorites(): Promise<void> {
  return Promise.resolve();
}

export async function submitRating(
  eventId: string,
  rating: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating,
      date: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Fallito invio valutazione");
  }
}


export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Fallito ricerca delle categorie");
  }

  return response.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Fallito upload dell'immagine");
  }

  const data = await response.json();
  return data.url; // Returns /uploads/filename
}

export interface CreateEventData {
  name: string;
  description: string;
  location: string;
  date: string; // ISO string
  categoryId: string;
  image: string; // Required
}

export async function createEvent(data: CreateEventData): Promise<EventWithCategory> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fallito creazione evento: ${errorText}`);
  }

  return response.json();
}

export interface UpdateEventData {
  name: string;
  description: string;
  location: string;
  date: string; // ISO string
  categoryId: string;
  image: string; // Required
}

export async function updateEvent(id: string, data: UpdateEventData): Promise<EventWithCategory> {
  const existingResponse = await fetch(`${API_BASE_URL}/events/${id}`);
  
  if (!existingResponse.ok) {
    throw new Error("Fallito ricerca dell'evento esistente");
  }

  const existingEvent = await existingResponse.json();

  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      id: existingEvent.id,
      attendees: existingEvent.attendees || 0,
      favorites: existingEvent.favorites || 0,
      averageRating: existingEvent.averageRating || 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fallito aggiornamento evento: ${errorText}`);
  }

  return response.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fallito eliminazione evento: ${errorText}`);
  }
}

