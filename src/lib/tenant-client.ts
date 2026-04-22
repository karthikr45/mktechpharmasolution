import { PLANT_COOKIE } from "./tenant";

/** Read the current plant id from the cookie on the client. */
export function getPlantClient(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + PLANT_COOKIE + "=([^;]+)"),
  );
  return m ? decodeURIComponent(m[1]) : null;
}
