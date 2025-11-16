import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAttendance, removeAttendance, addToFavorites, removeFromFavorites, submitRating, createEvent, uploadImage, updateEvent, deleteEvent, type CreateEventData, type UpdateEventData } from "@/lib/api";

export function useToggleAttendance() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeAttendance,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return {
    add: addMutation,
    remove: removeMutation,
    isPending: addMutation.isPending || removeMutation.isPending,
  };
}

export function useToggleFavorites() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addToFavorites,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return {
    add: addMutation,
    remove: removeMutation,
    isPending: addMutation.isPending || removeMutation.isPending,
  };
}

export function useSubmitRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, rating }: { eventId: string; rating: number }) =>
      submitRating(eventId, rating),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.removeQueries({ queryKey: ["event"] });
    },
  });
}
