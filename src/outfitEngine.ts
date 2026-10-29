import type { Garment, StyleTag } from "./types";
const neutral = ["negro","blanco","gris","beige","crema","marfil","marrón","cafe","camel","azul marino"];
const warm = ["rojo","naranja","terracota","mostaza","coral","rosa","burdeos"];
const cool = ["azul","celeste","verde","lila","morado","menta","turquesa"];
const norm=(s:string)=>s.trim().toLocaleLowerCase("es");
function colorScore(a:Garment,b:Garment):number {
 const ca=a.colors.map(norm), cb=b.colors.map(norm);
 if(!ca.length||!cb.length)return 1;
 if(ca.some(c=>cb.includes(c)))return 3;
 if([...ca,...cb].some(c=>neutral.includes(c)))return 2;
 const group=(arr:string[])=>arr.some(c=>warm.includes(c))?"warm":arr.some(c=>cool.includes(c))?"cool":"neutral";
 return group(ca)===group(cb)?2:1;
}
const styleScore=(g:Garment,s:StyleTag)=>g.styles.includes(s)?3:g.styles.length===0?1:0;
export interface OutfitSuggestion { title:string; items:Garment[]; score:number; explanation:string; }
export function generateOutfits(garments:Garment[],style:StyleTag,occasion:string,limit=6):OutfitSuggestion[] {
 const tops=garments.filter(g=>["Camisetas","Blusas","Camisas","Suéteres"].includes(g.category));
 const bottoms=garments.filter(g=>["Pantalones","Jeans","Faldas","Shorts"].includes(g.category));
 const dresses=garments.filter(g=>g.category==="Vestidos");
 const shoes=garments.filter(g=>g.category==="Zapatos");
 const accessories=garments.filter(g=>["Bolsos","Collares","Aretes","Pulseras","Cinturones","Relojes"].includes(g.category));
 const bases:Garment[][]=[];
 for(const top of tops)for(const bottom of bottoms)bases.push([top,bottom]);
 for(const dress of dresses)bases.push([dress]);
 const scored=bases.map(base=>{
  const shoe=shoes.map(g=>({g,s:base.reduce((n,x)=>n+colorScore(x,g),0)+styleScore(g,style)})).sort((a,b)=>b.s-a.s)[0]?.g;
  const full=shoe?[...base,shoe]:[...base];
  const accessory=accessories.map(g=>({g,s:full.reduce((n,x)=>n+colorScore(x,g),0)+styleScore(g,style)})).sort((a,b)=>b.s-a.s)[0]?.g;
  if(accessory)full.push(accessory);
  const score=full.reduce((n,g)=>n+styleScore(g,style),0)+full.slice(1).reduce((n,g,i)=>n+colorScore(full[i],g),0);
  return {title:base.length===1? `Vestido + detalles para ${occasion.toLowerCase()}`:`${style} para ${occasion.toLowerCase()}`,items:full,score,explanation:`Priorizamos prendas de estilo ${style.toLowerCase()} y colores compatibles.`};
 });
 const unique=new Map<string,OutfitSuggestion>();
 for(const x of scored.sort((a,b)=>b.score-a.score)){const k=x.items.map(g=>g.id).join("-");if(!unique.has(k))unique.set(k,x);}
 return [...unique.values()].slice(0,limit);
}