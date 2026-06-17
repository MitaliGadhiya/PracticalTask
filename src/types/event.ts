export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  imageUrl: string;
  category: string;
  price: number | null;
  isFree: boolean;
  organizer: Organizer;
  attendees: number;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

export interface Organizer {
  id: string;
  name: string;
  imageUrl: string;
}

export interface EventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  date?: string;
}

// Raw API shape from the server (fields may differ — normalized in apiService)
export interface RawEvent {
  id?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const normalizeEvent = (raw: RawEvent): Event => ({
  id: String(raw.id ?? raw._id ?? ''),
  title: raw.title ?? raw.name ?? '',
  description: raw.description ?? raw.details ?? '',
  date: raw.date ?? raw.event_date ?? raw.start_date ?? '',
  startTime: raw.start_time ?? raw.startTime ?? '00:00',
  endTime: raw.end_time ?? raw.endTime ?? '00:00',
  location: raw.location ?? raw.venue ?? raw.city ?? '',
  address: raw.address ?? raw.full_address ?? raw.location ?? '',
  imageUrl: raw.image ?? raw.image_url ?? raw.imageUrl ?? raw.thumbnail ?? '',
  category: raw.category ?? raw.type ?? 'General',
  price: raw.price != null ? Number(raw.price) : null,
  isFree: raw.is_free != null ? Boolean(raw.is_free) : raw.isFree != null ? Boolean(raw.isFree) : raw.price == null || Number(raw.price) === 0,
  organizer: {
    id: String(raw.organizer?.id ?? raw.organizer_id ?? ''),
    name: raw.organizer?.name ?? raw.organizer_name ?? 'Unknown',
    imageUrl: raw.organizer?.image ?? raw.organizer?.imageUrl ?? '',
  },
  attendees: Number(raw.attendees ?? raw.attendee_count ?? 0),
  tags: Array.isArray(raw.tags) ? raw.tags : [],
  latitude: raw.latitude ?? raw.lat,
  longitude: raw.longitude ?? raw.lng ?? raw.lon,
});
