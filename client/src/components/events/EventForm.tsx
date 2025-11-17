import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getImageUrl } from "@/lib/api";
import { X, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import * as React from "react";

export type EventFormValues = {
  name: string;
  description: string;
  location: string;
  date: string; 
  time: string; 
  categoryId: string;
  imageUrl: string;
};

type Props = {
  form: import("react-hook-form").UseFormReturn<EventFormValues>;
  isLoading: boolean;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  submitLabel?: string;
  uploadImage?: (file: File) => Promise<string>;
};

export default function EventForm({
  form,
  isLoading,
  onSubmit,
  submitLabel = "Salva",
  uploadImage,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>(form.getValues("imageUrl") || "");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      form.setError("imageUrl", { message: "Il file deve essere un'immagine" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      form.setError("imageUrl", { message: "L'immagine deve essere inferiore a 5MB" });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    if (uploadImage) {
      try {
        const uploadedUrl = await uploadImage(file);
        setImageUrl(uploadedUrl);
        form.setValue("imageUrl", uploadedUrl, { shouldValidate: true });
        form.trigger("imageUrl");
      } catch {
        form.setError("imageUrl", { message: "Errore nel caricamento dell'immagine" });
        setImageFile(null);
        setImagePreview(null);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    form.setValue("imageUrl", "", { shouldValidate: true });
    form.trigger("imageUrl");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Evento *</FormLabel>
            <FormControl><Input placeholder="Inserisci il nome dell'evento" {...field} disabled={isLoading} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione *</FormLabel>
            <FormControl><Textarea rows={5} placeholder="Descrivi l'evento in dettaglio" {...field} disabled={isLoading} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location *</FormLabel>
            <FormControl><Input placeholder="Via, città, ecc." {...field} disabled={isLoading} /></FormControl>
            <FormDescription>Indica l'indirizzo completo o la località dell'evento</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem>
              <FormLabel>Data *</FormLabel>
              <FormControl><Input type="date" {...field} disabled={isLoading} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="time" render={({ field }) => (
            <FormItem>
              <FormLabel>Ora *</FormLabel>
              <FormControl><Input type="time" {...field} disabled={isLoading} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria *</FormLabel>
            <FormControl>
              <Select {...field} disabled={isLoading || categoriesLoading}>
                <option value="">Seleziona una categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="imageUrl" render={({ field }) => (
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
            <FormDescription>Carica un'immagine o inserisci un URL. L'immagine è obbligatoria.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        {form.formState.errors.root && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}


