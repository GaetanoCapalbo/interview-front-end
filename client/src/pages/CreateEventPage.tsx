
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEvent, useUploadImage } from "@/hooks/useEventMutations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import  EventForm, { type EventFormValues as SharedEventFormValues }  from "@/components/events/EventForm";

const eventFormSchema = z.object({
  name: z.string().min(3, "Il nome deve essere di almeno 3 caratteri"),
  description: z.string().min(10, "La descrizione deve essere di almeno 10 caratteri"),
  location: z.string().min(3, "La location deve essere di almeno 3 caratteri"),
  date: z.string().min(1, "La data è obbligatoria"),
  time: z.string().min(1, "L'ora è obbligatoria"),
  categoryId: z.string().min(1, "La categoria è obbligatoria"),
  imageUrl: z.string().min(1, "L'immagine è obbligatoria"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function CreateEventPage() {
  const navigate = useNavigate();

  const createEventMutation = useCreateEvent();
  const uploadImageMutation = useUploadImage();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur", 
    shouldFocusError: true, 
    defaultValues: {
      name: "",
      description: "",
      location: "",
      date: "",
      time: "",
      categoryId: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    try {
      const isValid = await form.trigger(); 
      
      if (!isValid) {
        return; 
      }

      const finalImageUrl = data.imageUrl;
      if (!finalImageUrl) {
        form.setError("imageUrl", { message: "L'immagine è obbligatoria" });
        return;
      }

      const dateTime = new Date(`${data.date}T${data.time}`).toISOString();

      await createEventMutation.mutateAsync({
        name: data.name,
        description: data.description,
        location: data.location,
        date: dateTime,
        categoryId: data.categoryId,
        image: finalImageUrl,
      });

      navigate("/events");
    } catch (err) {
      console.error("Failed to create event:", err);
      form.setError("root", { message: "Errore nella creazione dell'evento. Riprova." });
    }
  };

  const isLoading = createEventMutation.isPending || uploadImageMutation.isPending;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Torna alla lista eventi</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Crea nuovo evento
        </h1>

        <EventForm
          form={form as unknown as import("react-hook-form").UseFormReturn<SharedEventFormValues>}
          isLoading={isLoading}
          onSubmit={onSubmit as unknown as (v: SharedEventFormValues) => Promise<void>}
          submitLabel="Crea Evento"
          uploadImage={(file) => uploadImageMutation.mutateAsync(file)}
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/events")}
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            Annulla
          </Button>
        </div>
      </div>
    </div>
  );
}

