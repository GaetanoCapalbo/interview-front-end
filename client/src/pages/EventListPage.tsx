import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import  PaginationControls  from "@/components/events/PaginationControls";
import  LoadingState  from "@/components/events/LoadingState";
import  ErrorState  from "@/components/events/ErrorState";
import  EmptyState  from "@/components/events/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api";
import EventGrid from "@/components/events/EventGrid";

const EVENTS_PER_PAGE = 3;

export default function EventListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: events = [], isLoading, isError, error, refetch, isFetching } = useEvents({
    page: currentPage,
    limit: EVENTS_PER_PAGE,
  });

  const { data: nextPageEvents = [], isFetched: isNextPageFetched } = useQuery({
    queryKey: ["events", { page: currentPage + 1, limit: EVENTS_PER_PAGE }],
    queryFn: () => fetchEvents({ page: currentPage + 1, limit: EVENTS_PER_PAGE }),
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

  if (isLoading && events.length === 0) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error instanceof Error ? error : null} onRetry={handleRetry} />;
  }


  if (events.length === 0 && !isLoading) {
    return <EmptyState />;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Eventi</h1>
      
      <EventGrid events={events} />

      <PaginationControls
        currentPage={currentPage}
        isFetching={isFetching}
        eventsLength={events.length}
        eventsPerPage={EVENTS_PER_PAGE}
        hasMore={hasMoreEvents}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}

