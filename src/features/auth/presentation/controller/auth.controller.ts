import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import { authService } from "../../data/repositories/auth.repository.impl";
import { LoginRequest } from "../../data/request/login.request";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
    onSuccess: () => {
      queryClient.invalidateQueries();

      if (typeof window !== "undefined") {
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        const safeRedirect =
          redirect && redirect.startsWith("/") && !redirect.startsWith("//")
            ? redirect
            : "/dashboard";
        router.push(safeRedirect);
        return;
      }

      router.push("/dashboard");
    },
  });

  return mutation;
};

export const useGetMe = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    retry: false,
  });

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      enqueueSnackbar("Logout berhasil!", { variant: "success" });
      queryClient.clear();
      router.push("/login");
    },
  });

  return mutation;
};
