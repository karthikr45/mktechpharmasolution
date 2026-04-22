"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { PLANTS, PLANT_COOKIE, type PlantId } from "@/lib/tenant";

export async function selectPlant(plantId: string) {
  const valid = PLANTS.find((p) => p.id === plantId);
  if (!valid) {
    throw new Error(`Unknown plant: ${plantId}`);
  }
  cookies().set(PLANT_COOKIE, valid.id, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
  revalidatePath("/portal", "layout");
  return { ok: true, plant: valid.id as PlantId };
}
