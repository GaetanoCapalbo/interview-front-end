import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  isFetching: boolean;
  eventsLength: number;
  eventsPerPage: number;
  hasMore: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function PaginationControls({
  currentPage,
  isFetching,
  eventsLength,
  eventsPerPage,
  hasMore,
  onPreviousPage,
  onNextPage,
}: PaginationControlsProps) {
  const isPreviousDisabled = currentPage === 1 || isFetching;

  const isNextDisabled = eventsLength < eventsPerPage || !hasMore || isFetching || eventsLength === 0;

  const handlePreviousClick = () => {
    if (currentPage <= 1 || isFetching) {
      return;
    }
    onPreviousPage();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (isNextDisabled) {
      e?.preventDefault();
      e?.stopPropagation();
      return;
    }
    
    if (!hasMore || eventsLength !== eventsPerPage || isFetching || eventsLength === 0) {
      e?.preventDefault();
      e?.stopPropagation();
      return;
    }
    
    if (eventsLength < eventsPerPage) {
      e?.preventDefault();
      e?.stopPropagation();
      return;
    }
    
    onNextPage();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <Button
        variant="outline"
        onClick={handlePreviousClick}
        disabled={isPreviousDisabled}
        className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Precedente</span>
        <span className="sm:hidden">Prec</span>
      </Button>
      
      <span className="text-xs sm:text-sm text-foreground font-medium whitespace-nowrap">
        Pagina {currentPage}
        {isFetching && <span className="ml-2 hidden sm:inline text-muted-foreground">(Caricamento...)</span>}
      </span>
      
      <Button
        variant="outline"
        onClick={isNextDisabled ? undefined : handleNextClick}
        disabled={isNextDisabled}
        type="button"
        aria-disabled={isNextDisabled}
        className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
      >
        <span className="hidden sm:inline">Successivo</span>
        <span className="sm:hidden">Succ</span>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
