export interface Category {
    id: string;
    name: string;
}

export interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    date: string;
    categoryId: string;
    attendees: number;
    favorites: number;
    averageRating: number;
    image: string | null;
}

export interface EventWithCategory extends Event {
    category: Category;
}

export interface EventResponse {
    events: EventWithCategory[];
    total: number;
    page: number;
    limit: number;
}

export interface EventRequest {
    page: number;
    limit: number;
    q: string;
}

export interface EventsResponse {
    events: EventWithCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface Rating {
    id: string;
    eventId: string;
    rating: number; 
    date: string; 
  }
  
  