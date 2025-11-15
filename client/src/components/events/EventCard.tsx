import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/lib/api";
import type { EventWithCategory } from "@/types/event";
import { MapPin, Calendar, Users, Star, Heart } from "lucide-react";
import { Link } from "react-router";

interface EventCardProps {
  event: EventWithCategory;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.id}`} className="block h-full">
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {event.image && (
        <div className="w-full h-40 sm:h-48 overflow-hidden">
          <img
            src={getImageUrl(event.image)}
            alt={event.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-base sm:text-lg">{event.name}</CardTitle>
        {event.category && (
          <CardDescription className="font-medium text-primary text-xs sm:text-sm">
            {event.category.name}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 shrink-0">
          {event.description}
        </p>
        
        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
          <MapPin className="size-3.5 sm:size-4 mt-0.5 shrink-0" />
          <span className="line-clamp-1 wrap-break-words">{event.location}</span>
        </div>
        
        <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
          <Calendar className="size-3.5 sm:size-4 mt-0.5 shrink-0" />
            <span className="wrap-break-words">
                {format(new Date(event.date), "PPP 'at' p", { locale: it })}
            </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 pt-2 sm:pt-3 text-xs sm:text-sm border-t mt-auto">
          <div className="flex items-center gap-1">
            <Users className="size-3.5 sm:size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{event.attendees}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-3.5 sm:size-4 text-red-500 fill-red-500" />
            <span className="text-muted-foreground">{event.favorites}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-3.5 sm:size-4 text-yellow-500 fill-yellow-500" />
            <span className="text-muted-foreground">
              {event.averageRating > 0 ? event.averageRating.toFixed(1) : "Ancora nessun voto."}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

