import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/lib/api";

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
  });
}

