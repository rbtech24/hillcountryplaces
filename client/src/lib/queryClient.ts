import { QueryClient, QueryFunction, useMutation, UseMutationOptions } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

interface ApiMutationOptions<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> 
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export function useApiMutation<TData = unknown, TError = Error, TVariables = unknown, TContext = unknown>(
  options: ApiMutationOptions<TData, TError, TVariables, TContext>
) {
  const { url, method, ...mutationOptions } = options;
  
  return useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: async (variables) => {
      const res = await apiRequest(method, url, variables);
      return await res.json();
    },
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
