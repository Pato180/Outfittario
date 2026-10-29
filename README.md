# Outfitario — MVP privado

PWA móvil para organizar el armario digital, guardar prendas en el dispositivo y proponer combinaciones de ropa.

## Funciones incluidas
- Interfaz móvil con Inicio, Armario, Outfits, Probador y Ajustes.
- Importación y procesamiento local de fotografías.
- Categorías, colores, estilos, temporada, ocasión y notas.
- Búsqueda, favoritos y eliminación de prendas.
- Generador local de combinaciones basado en reglas.
- Perfil de estilo editable con estimación experimental de subtono a partir de una foto procesada localmente, paleta orientativa y campos manuales para cabello, ojos y preferencias.
- Consentimiento de nube guardado localmente, con la conexión remota desactivada hasta configurar un backend seguro.
- Temas y preferencias de estilo.
- Exportación/importación JSON.
- PWA instalable y caché básica.

## Privacidad y limitaciones
Los datos se guardan localmente en IndexedDB. No hay analítica ni publicidad ni envío automático de fotografías a servicios externos. El análisis de foto del perfil es una aproximación local por muestreo de color, no detecta el rostro y puede fallar por la iluminación; revisa y edita los resultados. La opción de consentimiento de nube es solo una preferencia registrada: no hay servicio remoto conectado ni se envían datos. El procesamiento actual redimensiona las fotos, pero todavía no elimina semánticamente el fondo. El avatar es ilustrativo y no simula prendas de forma realista. Los respaldos JSON no están cifrados automáticamente. Borrar los datos del sitio puede eliminar el armario; exporta respaldos y guárdalos de forma privada.

## Requisitos
Node.js 20+ y npm.

## Desarrollo
```bash
npm install
npm run dev
```

## Compilación y pruebas
```bash
npm run build
npm test
npm run preview
```

Para probar desde Android, usa la URL LAN que muestre Vite con el teléfono y la computadora en la misma Wi-Fi. La instalación PWA requiere HTTPS o localhost.

## Próximos pasos
- Integrar un modelo local de eliminación de fondo.
- Mejorar las reglas de combinación y análisis de color.
- Conectar un backend de análisis en la nube solo después de definir proveedor, retención, seguridad, eliminación de datos y consentimiento explícito revocable.
- Evaluar un modelo de probador virtual con consentimiento explícito.
- Cifrar las exportaciones con Web Crypto API.
- Añadir pruebas E2E en Android.
