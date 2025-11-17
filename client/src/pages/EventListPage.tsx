import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useEvents } from "@/hooks/useEvents";
import EventsGrid from "@/components/events/EventGrid";
import PaginationControls from "@/components/events/PaginationControls";
import LoadingState from "@/components/events/LoadingState";
import ErrorState from "@/components/events/ErrorState";
import EmptyState from "@/components/events/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchEvents } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const EVENTS_PER_PAGE = 3;

type Period = "all" | "past" | "today" | "future";

export default function EventListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(
    searchParams.get("categoryId") || undefined
  );
  const [location, setLocation] = useState(searchParams.get("location_like") || "");
  const initialPeriod = (searchParams.get("period") as Period) || "all";
  const [period, setPeriod] = useState<Period>(
    ["all", "past", "today", "future"].includes(initialPeriod) ? initialPeriod : "all"
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedLocation(location), 300);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (categoryId) params.categoryId = categoryId;
    if (debouncedLocation) params.location_like = debouncedLocation;
    if (period && period !== "all") params.period = period;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, categoryId, debouncedLocation, period, currentPage, setSearchParams]);

  const { date_gte, date_lte } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    switch (period) {
      case "past":
        return { date_gte: undefined, date_lte: now.toISOString() };
      case "today":
        return { date_gte: startOfToday.toISOString(), date_lte: endOfToday.toISOString() };
      case "future":
        return { date_gte: now.toISOString(), date_lte: undefined };
      default:
        return { date_gte: undefined, date_lte: undefined };
    }
  }, [period]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  const { data: events = [], isLoading, isError, error, refetch, isFetching } = useEvents({
    page: currentPage,
    limit: EVENTS_PER_PAGE,
    q: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
    location_like: debouncedLocation || undefined,
    date_gte,
    date_lte,
  });

  const { data: nextPageEvents = [], isFetched: isNextPageFetched } = useQuery({
    queryKey: ["events", {
      page: currentPage + 1,
      limit: EVENTS_PER_PAGE,
      q: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
      location_like: debouncedLocation || undefined,
      date_gte,
      date_lte,
    }],
    queryFn: () => fetchEvents({
      page: currentPage + 1,
      limit: EVENTS_PER_PAGE,
      q: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
      location_like: debouncedLocation || undefined,
      date_gte,
      date_lte,
    }),
    enabled: events.length === EVENTS_PER_PAGE && !isFetching && !isLoading, 
    staleTime: 1000 * 60 * 5, 
  });

  const hasMoreEvents = events.length < EVENTS_PER_PAGE 
    ? false 
    : isNextPageFetched && nextPageEvents.length === 0
      ? false 
      : events.length === EVENTS_PER_PAGE; 


  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (events.length !== EVENTS_PER_PAGE || isFetching || isLoading) {
      return;
    }
    
    if (events.length < EVENTS_PER_PAGE) {
      return;
    }
    
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    refetch();
  };

  const onFilterChange = () => setCurrentPage(1);

  let content: React.ReactNode = null;
  if (isError) {
    content = <ErrorState error={error instanceof Error ? error : null} onRetry={handleRetry} />;
  } else if (isLoading && events.length === 0) {
    content = <LoadingState />;
  } else if (events.length === 0) {
    content = <EmptyState />;
  } else {
    content = (
      <>
        <EventsGrid events={events} />
        <PaginationControls
          currentPage={currentPage}
          isFetching={isFetching}
          eventsLength={events.length}
          eventsPerPage={EVENTS_PER_PAGE}
          hasMore={hasMoreEvents}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Events</h1>
      
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="search">Cerca</Label>
          <Input
            id="search"
            placeholder="Cerca eventi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onFilterChange();
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Categoria</Label>
          <Select
            value={categoryId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setCategoryId(v || undefined);
              onFilterChange();
            }}
          >
            <option value="">Tutte</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="location">Località</Label>
          <Input
            id="location"
            placeholder="Es. Napoli, Salerno..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              onFilterChange();
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Periodo</Label>
          <Select
            value={period}
            onChange={(e) => {
              const v = e.target.value as Period;
              setPeriod(v);
              onFilterChange();
            }}
          >
            <option value="all">Tutti</option>
            <option value="past">Passati</option>
            <option value="today">Oggi</option>
            <option value="future">Futuri</option>
          </Select>
        </div>
      </div>

      {content}
    </div>
  );
}

