import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCategories } from "@/hooks/useCategories";
import { useUpdateEvent, useUploadImage } from "@/hooks/useEventMutations";
import { useEvent } from "@/hooks/useEvent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { getImageUrl } from "@/lib/api";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import  LoadingState  from "@/components/events/LoadingState";
import  ErrorState  from "@/components/events/ErrorState";

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

export default function EditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: event, isLoading: eventLoading, isError: eventError, error } = useEvent(id || "");
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const updateEventMutation = useUpdateEvent();
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

  // Pre-fill form when event data loads
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      const dateStr = eventDate.toISOString().split('T')[0];
      const timeStr = eventDate.toTimeString().slice(0, 5); // HH:MM format

      form.reset({
        name: event.name,
        description: event.description,
        location: event.location,
        date: dateStr,
        time: timeStr,
        categoryId: event.categoryId,
        imageUrl: event.image || "",
      });

      setImageUrl(event.image || "");
      if (event.image) {
        setImagePreview(null); // Use the existing image URL
      }
    }
  }, [event, form]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      form.setError("imageUrl", { message: "Il file deve essere un'immagine" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      form.setError("imageUrl", { message: "L'immagine deve essere inferiore a 5MB" });
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadedUrl = await uploadImageMutation.mutateAsync(file);
      setImageUrl(uploadedUrl);
      form.setValue("imageUrl", uploadedUrl, { shouldValidate: true });
      form.trigger("imageUrl");
    } catch (err) {
      form.setError("imageUrl", { message: "Errore nel caricamento dell'immagine" });
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.trigger("imageUrl");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    if (!id) return;

    try {
      const isValid = await form.trigger();
      
      if (!isValid) {
        return;
      }

      const finalImageUrl = data.imageUrl || imageUrl;
      if (!finalImageUrl) {
        form.setError("imageUrl", { message: "L'immagine è obbligatoria" });
        return;
      }

      const dateTime = new Date(`${data.date}T${data.time}`).toISOString();

      await updateEventMutation.mutateAsync({
        id,
        data: {
          name: data.name,
          description: data.description,
          location: data.location,
          date: dateTime,
          categoryId: data.categoryId,
          image: finalImageUrl,
        },
      });

      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Failed to update event:", err);
      form.setError("root", { message: "Errore nell'aggiornamento dell'evento. Riprova." });
    }
  };

  const isLoading = updateEventMutation.isPending || uploadImageMutation.isPending;

  if (eventLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <LoadingState />
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ErrorState error={error instanceof Error ? error : null} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        to={`/events/${id}`}
        className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Torna ai dettagli evento</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          Modifica evento
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Evento *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Inserisci il nome dell'evento"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi l'evento in dettaglio"
                      rows={5}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Via, città, ecc."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Indica l'indirizzo completo o la località dell'evento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ora *</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || categoriesLoading}
                    >
                      <option value="">Seleziona una categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immagine *</FormLabel>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-upload">Carica immagine</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isLoading}
                        ref={fileInputRef}
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="relative">
                      <Label htmlFor="image-url-input">Oppure inserisci URL immagine *</Label>
                      <Input
                        id="image-url-input"
                        type="text"
                        placeholder="https://example.com/image.jpg o /uploads/filename.jpg"
                        value={field.value || ""}
                        onChange={(e) => {
                          const url = e.target.value;
                          setImageUrl(url);
                          setImageFile(null);
                          setImagePreview(null);
                          field.onChange(url);
                        }}
                        onBlur={field.onBlur}
                        disabled={isLoading || !!imageFile}
                        aria-invalid={!!form.formState.errors.imageUrl}
                      />
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || imageUrl) && (
                      <div className="relative inline-block">
                        <div className="relative w-full max-w-md">
                          <img
                            src={imagePreview || getImageUrl(imageUrl)}
                            alt="Anteprima"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                            disabled={isLoading}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <FormDescription>
                    Carica un'immagine o inserisci un URL. L'immagine è obbligatoria.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Modifiche"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/events/${id}`)}
                disabled={isLoading}
                className="flex-1"
                size="lg"
              >
                Annulla
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

