import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center text-destructive text-sm sm:text-base mb-4">
        Errore: {error instanceof Error ? error.message : "Impossibile caricare gli eventi"}
      </div>
      <div className="flex justify-center">
        <Button onClick={onRetry} className="w-full sm:w-auto">
          Riprova
        </Button>
      </div>
    </div>
  );
}

