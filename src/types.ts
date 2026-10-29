export const CATEGORIES = [
  "Camisetas", "Blusas", "Camisas", "Pantalones", "Jeans", "Faldas", "Vestidos",
  "Shorts", "Chaquetas", "Suéteres", "Zapatos", "Bolsos", "Collares", "Aretes",
  "Pulseras", "Cinturones", "Relojes", "Otros"
] as const;
export type Category = typeof CATEGORIES[number];
export type StyleTag = "Romántico" | "Elegante" | "Casual" | "Minimalista" | "Urbano" | "Vintage" | "Bohemio" | "Deportivo";
export interface Garment {
  id?: number; name: string; category: Category; colors: string[]; styles: StyleTag[];
  season: string; occasion: string; notes: string; originalBlob?: Blob; cutoutBlob: Blob;
  createdAt: string; favorite: boolean;
}
export interface Outfit { id?: number; title: string; garmentIds: number[]; occasion: string; style: StyleTag; createdAt: string; favorite: boolean; }
export interface Preferences {
  id: "main"; displayName: string; preferredStyles: StyleTag[]; accent: string;
  theme: "light" | "dark" | "system"; avatarTone: string; avatarHair: string;
}