import "server-only";
import { cookies } from "next/headers";
import { PLANTS, PLANT_COOKIE, type Plant } from "./tenant";

export function getPlant(): Plant | null {
  const c = cookies().get(PLANT_COOKIE);
  if (!c) return null;
  return PLANTS.find((p) => p.id === c.value) ?? null;
}

export function getPlantOrDefault(): Plant {
  return getPlant() ?? PLANTS[0];
}
