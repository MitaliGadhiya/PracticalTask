import { useState, useCallback, useRef } from 'react';
import axiosInstance from '../services/api/axiosInstance';
import { Endpoints } from '../services/api/endpoints';
import { Event, RawEvent, normalizeEvent, EventQueryParams } from '../types';
import { showErrorToast } from '../utils/errorHandler';
import { APP_CONFIG } from '../constants';

// Extracts the event array from any response envelope shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractEvents = (data: any): { events: Event[]; hasMore: boolean; total: number } => {
  // Shape: { data: { data: [...], ... } }  or  { data: [...] }  or  [...]
  const payload = data?.data ?? data;
  const rawList: RawEvent[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  const total: number = payload?.total ?? payload?.count ?? rawList.length;
  const currentPage: number = payload?.current_page ?? payload?.page ?? 1;
  const lastPage: number = payload?.last_page ?? payload?.totalPages ?? 1;
  const hasMore = currentPage < lastPage || rawList.length === APP_CONFIG.defaultPageSize;

  return { events: rawList.map(normalizeEvent), hasMore, total };
};

interface UseEventsResult {
  events: Event[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  fetchEvents: (params?: EventQueryParams) => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useEvents = (): UseEventsResult => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const queryParamsRef = useRef<EventQueryParams>({});

  const fetchEvents = useCallback(async (params: EventQueryParams = {}) => {
    setIsLoading(true);
    setError(null);
    pageRef.current = 1;
    queryParamsRef.current = params;

    try {
      const response = await axiosInstance.get(Endpoints.events, {
        params: { ...params, page: 1, per_page: APP_CONFIG.defaultPageSize },
      });
      const { events: list, hasMore: more } = extractEvents(response.data);
      setEvents(list);
      setHasMore(more);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      setError(message);
      showErrorToast(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    pageRef.current = 1;

    try {
      const response = await axiosInstance.get(Endpoints.events, {
        params: { ...queryParamsRef.current, page: 1, per_page: APP_CONFIG.defaultPageSize },
      });
      const { events: list, hasMore: more } = extractEvents(response.data);
      setEvents(list);
      setHasMore(more);
    } catch (err) {
      showErrorToast(err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      const response = await axiosInstance.get(Endpoints.events, {
        params: {
          ...queryParamsRef.current,
          page: nextPage,
          per_page: APP_CONFIG.defaultPageSize,
        },
      });
      const { events: list, hasMore: more } = extractEvents(response.data);
      setEvents(prev => [...prev, ...list]);
      setHasMore(more);
      pageRef.current = nextPage;
    } catch (err) {
      showErrorToast(err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore]);

  return {
    events,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    fetchEvents,
    refresh,
    loadMore,
  };
};
