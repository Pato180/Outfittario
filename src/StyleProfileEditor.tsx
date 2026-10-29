import { useState } from "react";
import { Camera, Palette, ShieldCheck, Sparkles } from "lucide-react";
import type { ColorSeason, StyleProfile, Undertone } from "./types";

const initialProfile: StyleProfile = {
  skinTone: "#d9a17e",
  undertone: "Por confirmar",
  hairColor: "Castaño",
  eyeColor: "Marrones",
  season: "Por confirmar",
  notes: "",
  updatedAt: "",
  cloudConsent: false
};

type Props = { profile?: StyleProfile; onChange: (profile: StyleProfile) => void };

function inferSeason(undertone: Undertone, hairColor: string, eyeColor: string): ColorSeason {
  if (undertone === "Por confirmar") return "Por confirmar";
  const lightHair = ["Rubio", "Rubio oscuro", "Canoso"].includes(hairColor);
  const lightEyes = ["Azules", "Verdes", "Grises"].includes(eyeColor);
  if (undertone === "Cálido") return lightHair || lightEyes ? "Primavera" : "Otoño";
  if (undertone === "Frío") return lightHair && lightEyes ? "Verano" : "Invierno";
  return "Por confirmar";
}

async function samplePhoto(file: File): Promise<{ skinTone: string; undertone: Undertone }> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("No se pudo abrir la foto."));
    });
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Este navegador no permite analizar la foto.");
    context.drawImage(image, 0, 0, 64, 64);
    const pixels = context.getImageData(16, 10, 32, 40).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i], green = pixels[i + 1], blue = pixels[i + 2], alpha = pixels[i + 3];
      const brightness = (red + green + blue) / 3;
      if (alpha > 180 && brightness > 45 && brightness < 238 && red > blue * 0.82) {
        r += red; g += green; b += blue; count++;
      }
    }
    if (count < 12) throw new Error("No pude estimar un tono con suficiente confianza. Prueba con luz natural y el rostro centrado, o edita el perfil manualmente.");
    r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
    const skinTone = "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
    const undertone: Undertone = r - b > 18 ? "Cálido" : b - r > 10 ? "Frío" : "Neutro";
    return { skinTone, undertone };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function StyleProfileEditor({ profile, onChange }: Props) {
  const current = { ...initialProfile, ...profile };
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  function patch(values: Partial<StyleProfile>) {
    const next = { ...current, ...values, updatedAt: new Date().toISOString() };
    if (values.undertone || values.hairColor || values.eyeColor) {
      next.season = inferSeason(next.undertone, next.hairColor, next.eyeColor);
    }
    onChange(next);
  }
  async function analyze(file?: File) {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await samplePhoto(file);
      patch({ ...result, season: inferSeason(result.undertone, current.hairColor, current.eyeColor) });
      setMessage("Estimación local lista. Revísala y ajusta cualquier campo; la foto no se guarda ni se envía.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo analizar la foto.");
    } finally {
      setBusy(false);
    }
  }
  return <div className="style-profile">
    <div className="profile-intro"><div className="profile-icon"><Palette size={21}/></div><div><h3>Mi perfil de estilo</h3><p>Una guía personalizable para descubrir colores que podrían favorecerte.</p></div></div>
    <div className="profile-photo-row">
      <label className="profile-photo-button"><Camera size={17}/>{busy ? "Analizando…" : "Analizar una foto"}<input type="file" accept="image/*" capture="user" disabled={busy} onChange={e => { void analyze(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label>
      <span className="hint">La foto se analiza en este dispositivo y no se conserva.</span>
    </div>
    <p className="profile-disclaimer">Estimación experimental: no detecta ni verifica el rostro y la iluminación puede alterar los colores. No es un diagnóstico ni una regla definitiva de moda.</p>
    <div className="profile-fields">
      <label>Tono de piel <span className="color-field"><input type="color" value={current.skinTone} onChange={e => patch({ skinTone: e.target.value })}/><code>{current.skinTone}</code></span></label>
      <label>Subtono<select value={current.undertone} onChange={e => patch({ undertone: e.target.value as Undertone })}>{["Por confirmar","Cálido","Frío","Neutro"].map(v => <option key={v}>{v}</option>)}</select></label>
      <label>Color de cabello<select value={current.hairColor} onChange={e => patch({ hairColor: e.target.value })}>{["Negro","Castaño","Castaño claro","Rubio oscuro","Rubio","Pelirrojo","Canoso","Teñido","Otro"].map(v => <option key={v}>{v}</option>)}</select></label>
      <label>Color de ojos<select value={current.eyeColor} onChange={e => patch({ eyeColor: e.target.value })}>{["Marrones","Avellana","Verdes","Azules","Grises","Negros","Otro","No sé"].map(v => <option key={v}>{v}</option>)}</select></label>
      <label>Paleta orientativa<select value={current.season} onChange={e => patch({ season: e.target.value as ColorSeason })}>{["Por confirmar","Primavera","Verano","Otoño","Invierno"].map(v => <option key={v}>{v}</option>)}</select></label>
    </div>
    <label>Notas personales<textarea rows={2} value={current.notes} onChange={e => patch({ notes: e.target.value })} placeholder="Colores que te gustan, preferencias o cosas que quieres probar…"/></label>
    <div className="palette-preview"><b><Sparkles size={16}/> Ideas para explorar</b><div className="palette-swatches">{(current.undertone === "Cálido" ? ["#d97745","#e8bd63","#71805a","#a65c49"] : current.undertone === "Frío" ? ["#7b91bd","#b4a0c8","#6d9291","#8d5265"] : current.undertone === "Neutro" ? ["#a68a72","#82918a","#b9a2a0","#6c737b"] : ["#c9b9a6","#a65c49","#7b8794","#8d9a77"]).map(color => <span key={color} style={{ background: color }} title={color}/>)}</div><p>Son referencias iniciales, no una clasificación rígida. Prueba los colores con tu ropa y tus gustos.</p></div>
    <div className="cloud-consent">
      <div className="consent-heading"><ShieldCheck size={19}/><b>Análisis opcional en la nube</b></div>
      <p>Modo híbrido preparado para una futura conexión segura. La función de nube aún no está conectada, así que Outfitario no enviará fotos ni datos aunque marques esta opción.</p>
      <label className="consent-check"><input type="checkbox" checked={current.cloudConsent} onChange={e => patch({ cloudConsent: e.target.checked, cloudConsentAt: e.target.checked ? new Date().toISOString() : undefined })}/> Doy mi consentimiento para activar análisis en la nube cuando esté disponible. Quiero poder retirarlo cuando quiera.</label>
      {current.cloudConsent && <small>Consentimiento guardado en este dispositivo. No se ha enviado información.</small>}
    </div>
    {message && <p className="profile-message" role="status">{message}</p>}
  </div>;
}
