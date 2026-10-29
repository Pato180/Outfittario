import Dexie, { type Table } from "dexie";
import type { Garment, Outfit, Preferences } from "./types";
class OutfitarioDB extends Dexie {
  garments!: Table<Garment, number>;
  outfits!: Table<Outfit, number>;
  preferences!: Table<Preferences, string>;
  constructor() {
    super("outfitario-db");
    this.version(1).stores({
      garments: "++id, category, name, favorite, createdAt",
      outfits: "++id, title, occasion, style, favorite, createdAt",
      preferences: "id"
    });
  }
}
export const db = new OutfitarioDB();
export const defaultPreferences: Preferences = {
  id: "main", displayName: "Mi armario", preferredStyles: ["Romántico", "Elegante"],
  accent: "#a65c49", theme: "light", avatarTone: "#d9a17e", avatarHair: "#4a3028"
};
export async function getPreferences(): Promise<Preferences> {
  const existing = await db.preferences.get("main");
  if (existing) return existing;
  await db.preferences.put(defaultPreferences);
  return defaultPreferences;
}