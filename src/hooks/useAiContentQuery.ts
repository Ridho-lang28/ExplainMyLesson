// src/hooks/useAiContentQuery.ts — BARU pada Tugas 8. Padanan langsung dari
// AiContentPanel (dulu ASYNC Server Component) yang kini menjadi Client
// Component murni memakai TanStack Query. queryKey menyertakan `chapter`,
// `mode`, DAN `refreshNonce` — persis fungsi query string `?r=<timestamp>`
// yang dulu memaksa React membongkar ulang <Suspense> pada RefreshAiButton.

import { fetchAiContent } from "@/lib/api/classApi";
import type { AiMode } from "@shared/catalog";
import { useQuery } from "@tanstack/react-query";

export function useAiContentQuery(chapterId: string, mode: AiMode, refreshNonce: string) {
  return useQuery({
    queryKey: ["ai-content", chapterId, mode, refreshNonce],
    queryFn: () => fetchAiContent(chapterId, mode),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 0,
  });
}
