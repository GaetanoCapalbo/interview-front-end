import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="flex justify-center mb-6 sm:mb-8">
                <Calendar className="size-16" sm:size-20 text-primary />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Benvenuto nella piattaforma EventiCampania
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-2">
                Scopri ed esplora i migliori eventi in Campania. Dai concerti musicali ai festival della pizza, 
                trova la tua prossima esperienza indimenticabile.
        </p>
        <Link to="/events">
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            Vai agli eventi!
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        </div>
    </main>
  );
}