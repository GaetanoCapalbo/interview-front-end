import { useParams, Link, useNavigate } from "react-router";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useEvent } from "@/hooks/useEvent";
import { useToggleAttendance, useToggleFavorites, useSubmitRating, useDeleteEvent } from "@/hooks/useEventMutations";
import { getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import  StarRating  from "@/components/events/StarRating";
import  LoadingState  from "@/components/events/LoadingState";
import  ErrorState  from "@/components/events/ErrorState";
import { MapPin, Calendar, Users, Heart, Star, ArrowLeft, CheckCircle2, Edit, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY_ATTENDANCE = "eventiCampania_attendance";
const STORAGE_KEY_FAVORITES = "eventiCampania_favorites";
const STORAGE_KEY_RATINGS = "eventiCampania_ratings";

function getUserAttendanceState(eventId: string): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
  if (!stored) return false;
  try {
    const attendance = JSON.parse(stored);
    return attendance[eventId] === true;
  } catch {
    return false;
  }
}

function setUserAttendanceState(eventId: string, attending: boolean) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
  const attendance = stored ? JSON.parse(stored) : {};
  if (attending) {
    attendance[eventId] = true;
  } else {
    delete attendance[eventId];
  }
  localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendance));
}

function getUserFavoriteState(eventId: string): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
  if (!stored) return false;
  try {
    const favorites = JSON.parse(stored);
    return favorites[eventId] === true;
  } catch {
    return false;
  }
}

function setUserFavoriteState(eventId: string, favorite: boolean) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
  const favorites = stored ? JSON.parse(stored) : {};
  if (favorite) {
    favorites[eventId] = true;
  } else {
    delete favorites[eventId];
  }
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
}

function getUserRatingState(eventId: string): { rating: number } | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY_RATINGS);
  if (!stored) return null;
  try {
    const ratings = JSON.parse(stored);
    return ratings[eventId] ? { rating: ratings[eventId] } : null;
  } catch {
    return null;
  }
}

function setUserRatingState(eventId: string, rating: number | null) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY_RATINGS);
  const ratings = stored ? JSON.parse(stored) : {};
  if (rating !== null) {
    ratings[eventId] = rating;
  } else {
    delete ratings[eventId];
  }
  localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratings));
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading, isError, error, refetch } = useEvent(id || "");
  
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      setIsAttending(getUserAttendanceState(id));
      setIsFavorite(getUserFavoriteState(id));
      const userRating = getUserRatingState(id);
      if (userRating) {
        setRating(userRating.rating);
        setHasRated(true);
      }
    }
  }, [id]);

  const attendanceMutation = useToggleAttendance();
  const favoritesMutation = useToggleFavorites();
  const submitRatingMutation = useSubmitRating();
  const deleteEventMutation = useDeleteEvent();

  const handleToggleAttendance = async () => {
    if (!id) return;
    
    const newState = !isAttending;
    
    try {
      if (newState) {
        await attendanceMutation.add.mutateAsync(id);
        setIsAttending(true);
        setUserAttendanceState(id, true);
        await refetch();
      } else {
        await attendanceMutation.remove.mutateAsync(id);
        setIsAttending(false);
        setUserAttendanceState(id, false);
        await refetch();
      }
    } catch (err) {
      console.error("Errore nel gestire la partecipazione all'evento:", err);
      setIsAttending(!newState);
      setUserAttendanceState(id, !newState);
    }
  };

  const handleToggleFavorites = async () => {
    if (!id) return;
    
    const newState = !isFavorite;
    
    try {
      if (newState) {
        await favoritesMutation.add.mutateAsync(id);
        setIsFavorite(true);
        setUserFavoriteState(id, true);
        await refetch();
      } else {
        await favoritesMutation.remove.mutateAsync(id);
        setIsFavorite(false);
        setUserFavoriteState(id, false);
        await refetch();
      }
    } catch (err) {
      console.error("Errore nel gestire i preferiti dell'evento:", err);
      setIsFavorite(!newState);
      setUserFavoriteState(id, !newState);
    }
  };

  const handleToggleRating = async () => {
    if (!id) return;
    
    if (hasRated) {
      setHasRated(false);
      setRating(0);
      setUserRatingState(id, null);
      refetch();
    } else {
      if (rating === 0) return;
      
      try {
        await submitRatingMutation.mutateAsync({ eventId: id, rating });
        setHasRated(true);
        setUserRatingState(id, rating);
        refetch();
      } catch (err) {
        console.error("Errore nel gestire la valutazione dell'evento:", err);
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!id) return;

    try {
      await deleteEventMutation.mutateAsync(id);
      navigate("/events");
    } catch (err) {
      console.error("Errore nell'eliminazione dell'evento:", err);
      alert("Errore nell'eliminazione dell'evento. Riprova.");
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !event) {
    return (
      <ErrorState
        error={error instanceof Error ? error : null}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Torna alla lista eventi</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={`/events/${id}/edit`}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            <Edit className="size-4" />
            <span className="hidden sm:inline">Modifica Evento</span>
            <span className="sm:hidden">Modifica</span>
          </Link>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base"
            disabled={deleteEventMutation.isPending}
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Cancella Evento</span>
            <span className="sm:hidden">Cancella</span>
          </Button>
        </div>
      </div>
    
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold">Conferma eliminazione</h2>
            <p className="text-muted-foreground">
              Sei sicuro di voler eliminare l'evento <strong>"{event?.name}"</strong>? Questa azione non può essere annullata.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteEventMutation.isPending}
              >
                Annulla
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteEvent}
                disabled={deleteEventMutation.isPending}
              >
                {deleteEventMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Eliminazione...
                  </>
                ) : (
                  "Elimina"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {event.image && (
          <div className="w-full h-64 sm:h-96 mb-6 sm:mb-8 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(event.image)}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          {event.category && (
            <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium text-primary bg-primary/10 rounded-full mb-3 sm:mb-4">
              {event.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {event.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="size-4 sm:size-5" />
              <span>{event.attendees} partecipanti</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="size-4 sm:size-5 text-red-500 fill-red-500" />
              <span>{event.favorites} preferiti</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="size-4 sm:size-5 text-yellow-500 fill-yellow-500" />
              <span>
                {event.averageRating > 0
                  ? `${event.averageRating.toFixed(1)}/5`
                  : "Nessuna valutazione"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Descrizione</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Luogo</h2>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 sm:size-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Data e Ora</h2>
              <div className="flex items-start gap-3">
                <Calendar className="size-5 sm:size-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  {format(new Date(event.date), "PPP 'alle' p", { locale: it })}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-4 sm:space-y-6">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleAttendance();
                }}
                disabled={attendanceMutation.isPending}
                type="button"
                className={cn(
                  "w-full text-sm sm:text-base",
                  isAttending && "bg-green-600 hover:bg-green-700"
                )}
                size="lg"
              >
                {isAttending ? (
                  <>
                    <CheckCircle2 className="size-4 sm:size-5 mr-2" />
                    <span>Partecipazione confermata</span>
                  </>
                ) : (
                  <>
                    <Users className="size-4 sm:size-5 mr-2" />
                    <span>Parteciperò</span>
                  </>
                )}
              </Button>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorites();
                }}
                disabled={favoritesMutation.isPending}
                type="button"
                variant={isFavorite ? "default" : "outline"}
                className={cn(
                  "w-full text-sm sm:text-base",
                  isFavorite && "bg-red-600 hover:bg-red-700"
                )}
                size="lg"
              >
                <Heart
                  className={cn(
                    "size-4 sm:size-5 mr-2",
                    isFavorite && "fill-white"
                  )}
                />
                {isFavorite ? "Nei preferiti" : "Aggiungi ai preferiti"}
              </Button>

              <div className="border rounded-lg p-4 sm:p-6 space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">
                  {hasRated ? "La tua valutazione" : "Valuta l'evento"}
                </h3>
                {hasRated ? (
                  <div className="space-y-4">
                    <StarRating
                      value={rating}
                      onChange={() => {}}
                      disabled
                    />
                    <Button
                      onClick={handleToggleRating}
                      disabled={submitRatingMutation.isPending}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Rimuovi valutazione
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <StarRating
                      value={rating}
                      onChange={setRating}
                      disabled={submitRatingMutation.isPending}
                    />
                    <Button
                      onClick={handleToggleRating}
                      disabled={rating === 0 || submitRatingMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {submitRatingMutation.isPending
                        ? "Invio..."
                        : "Invia valutazione"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

