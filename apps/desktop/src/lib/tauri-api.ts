import { invoke } from "@tauri-apps/api/core";
import type { SendRequestParams, ResponseData, HttpError } from "@apiark/types";

/**
 * Send an HTTP request via the Rust backend.
 * Returns ResponseData on success, throws HttpError on failure.
 */
export async function sendRequest(
  params: SendRequestParams,
): Promise<ResponseData> {
  try {
    return await invoke<ResponseData>("send_request", { params });
  } catch (err) {
    // Tauri serializes Rust Err(String) as a plain string.
    // Our backend serializes HttpError as JSON inside that string.
    if (typeof err === "string") {
      try {
        const httpError: HttpError = JSON.parse(err);
        throw httpError;
      } catch (parseErr) {
        // If JSON parse fails, wrap the raw string
        if ((parseErr as HttpError).errorType) {
          throw parseErr;
        }
        throw {
          errorType: "unknown",
          message: err,
        } satisfies HttpError;
      }
    }
    throw {
      errorType: "unknown",
      message: String(err),
    } satisfies HttpError;
  }
}
