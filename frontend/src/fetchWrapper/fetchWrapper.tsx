import { useQuery, QueryKey, useMutation } from "react-query";

interface FetchOptions {
  headers?: Record<string, string>;
  method: string;
  params?: Record<string, string>;
  body?: object;
}

async function fetchWrapper<T>(url: string, { method, params, body }: FetchOptions): Promise<T> {
  const queryParams = new URLSearchParams(params).toString();
  const fullUrl = queryParams ? `${url}?${queryParams}` : url;
  const requestBody = body ? JSON.stringify(body) : undefined;
  const response = await fetch("http://localhost:8000/" + fullUrl, {
    method,
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(Object.values(error).join(","));
  }

  return response.json();
}

/**
 *
 * @param key  querykey key // ex: 'userId'
 * @param url  url of the  back end  // ex :  oauth/token
 * @param options   object with  {method : 'get', header: {.....}, param : {....}, body : {....}}
 * @returns
 */
function useFetchQuery<T>(key: QueryKey, url: string, options: FetchOptions) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      return fetchWrapper<T>(url, options);
    },
  });
}
function useFetchMutation<T>(url: string) {
  const mutation = useMutation<T, Error, FetchOptions>(async (options: FetchOptions) => {
    return fetchWrapper<T>(url, options);
  });

  return mutation;
}
export { useFetchQuery, useFetchMutation, fetchWrapper };
