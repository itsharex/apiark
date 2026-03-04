import { create } from "zustand";
import type {
  HttpMethod,
  KeyValuePair,
  RequestBody,
  AuthConfig,
  ResponseData,
  HttpError,
} from "@apiark/types";
import { sendRequest } from "@/lib/tauri-api";

interface RequestState {
  // Request
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: RequestBody;
  auth: AuthConfig;

  // Response
  response: ResponseData | null;
  error: HttpError | null;
  loading: boolean;

  // Actions — Request
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setHeaders: (headers: KeyValuePair[]) => void;
  setParams: (params: KeyValuePair[]) => void;
  setBody: (body: RequestBody) => void;
  setAuth: (auth: AuthConfig) => void;

  // Actions — Execute
  send: () => Promise<void>;
  clearResponse: () => void;
}

const emptyKvRow = (): KeyValuePair => ({ key: "", value: "", enabled: true });

export const useRequestStore = create<RequestState>((set, get) => ({
  // Default state
  method: "GET",
  url: "",
  headers: [emptyKvRow()],
  params: [emptyKvRow()],
  body: { type: "none", content: "", formData: [] },
  auth: { type: "none" },

  response: null,
  error: null,
  loading: false,

  // Setters
  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setParams: (params) => set({ params }),
  setBody: (body) => set({ body }),
  setAuth: (auth) => set({ auth }),

  // Send request
  send: async () => {
    const { method, url, headers, params, body, auth } = get();

    if (!url.trim()) return;

    set({ loading: true, error: null, response: null });

    try {
      const response = await sendRequest({
        method,
        url: url.trim(),
        headers: headers.filter((h) => h.key.trim() !== ""),
        params: params.filter((p) => p.key.trim() !== ""),
        body: body.type !== "none" ? body : undefined,
        auth: auth.type !== "none" ? auth : undefined,
        followRedirects: true,
        verifySsl: true,
      });
      set({ response, loading: false });
    } catch (err) {
      set({
        error: err as HttpError,
        loading: false,
      });
    }
  },

  clearResponse: () => set({ response: null, error: null }),
}));
