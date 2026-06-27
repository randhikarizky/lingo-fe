import { useQuery } from "@tanstack/react-query";
import { progressService } from "../../data/repositories/progress.repository.impl";

export const useProgressSummary = () =>
  useQuery({
    queryKey: ["progress", "summary"],
    queryFn: () => progressService.getSummary(),
  });

export const useProgressActivity = () =>
  useQuery({
    queryKey: ["progress", "activity"],
    queryFn: () => progressService.getActivity(),
  });
