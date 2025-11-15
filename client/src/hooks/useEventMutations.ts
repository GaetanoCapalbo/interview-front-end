import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAttendance, removeAttendance, addToFavorites, removeFromFavorites, submitRating } from "@/lib/api";

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

