import { describe, expect, it } from "vitest";
import { generateOutfits } from "./outfitEngine";
import type { Garment } from "./types";
const item=(id:number,category:Garment["category"],name:string,colors:string[],styles:Garment["styles"]=["Casual"]):Garment=>({
 id,category,name,colors,styles,season:"Todo el año",occasion:"Diario",notes:"",
 cutoutBlob:new Blob(["x"],{type:"image/webp"}),createdAt:"2026-01-01",favorite:false
});
describe("generateOutfits",()=>{
 it("combina prendas superiores e inferiores",()=>{
  const garments=[item(1,"Blusas","Blusa blanca",["blanco"]),item(2,"Pantalones","Pantalón negro",["negro"]),item(3,"Zapatos","Zapatos negros",["negro"])];
  const result=generateOutfits(garments,"Casual","Diario");
  expect(result.length).toBeGreaterThan(0);
  expect(result[0].items.some(g=>g.id===1)).toBe(true);
  expect(result[0].items.some(g=>g.id===2)).toBe(true);
 });
 it("no sugiere outfits con solo accesorios",()=>expect(generateOutfits([item(1,"Aretes","Aretes",["dorado"])],"Elegante","Fiesta")).toEqual([]));
 it("puede sugerir un vestido",()=>expect(generateOutfits([item(8,"Vestidos","Vestido azul",["azul"],["Elegante"])],"Elegante","Evento").length).toBe(1));
});