# Grupo DEASA Widex — audifonosdeasa.com

> 📄 **¿Retomas el proyecto desde cero, o se lo pasas a otra persona o a una IA?**
> Empieza por [`CONTEXTO.md`](CONTEXTO.md): historia del proyecto, datos
> canónicos del negocio, decisiones tomadas y las recomendaciones de Google Ads.
> Este README cubre solo la parte técnica del sitio.

Sitio estático (HTML + CSS + JS, sin dependencias ni build) con el contenido de
audifonosdeasa.com y el lenguaje visual de audifonos.com.mx.

## Qué se sube al servidor

```
index.html  nosotros.html  servicios.html  optica.html  contacto.html
robots.txt  sitemap.xml  .htaccess
assets/css/app.css
assets/js/main.js
assets/js/conversiones.js
assets/img/*
```

**No subas** la carpeta `media/` ni `media/uploads.tar`: son la biblioteca original
de WordPress (431 MB) de donde se sacaron las imágenes. Las que usa el sitio ya
están copiadas y renombradas en `assets/img/`.

Se sube por FTP a la raíz del dominio. No requiere PHP, base de datos ni WordPress.

## Estructura

| Página          | Contenido |
|-----------------|-----------|
| `index.html`    | Portada: hero, teléfonos de las 3 sucursales, historia, 8 servicios, taller/laboratorio/óptica, sucursales, distribuidores, galería, preguntas frecuentes |
| `nosotros.html` | Historia, "se caracteriza por", cómo trabajamos, galería, distribuidores |
| `servicios.html`| Los 8 servicios con ancla propia (`#examen`, `#auxiliares`, …), taller y laboratorio, audífonos Widex |
| `optica.html`   | Óptica Pánuco: productos, servicios, promoción y contacto |
| `contacto.html` | Formulario, teléfonos grandes, las 3 sucursales con mapa, distribuidores |

Cabecera y pie están repetidos en cada archivo (es un sitio estático). Si cambias
un teléfono, búscalo con "buscar y reemplazar en todos los archivos" para no
dejar ninguno viejo.

## Teléfonos y WhatsApp (importante para Google Ads)

Los números **nunca** son imágenes: son texto real, en `<a href="tel:...">`, con
tamaño grande y alto contraste. Aparecen en:

1. Barra superior (teléfono + WhatsApp), visible en todas las páginas.
2. Botones del hero.
3. Bloque "Teléfonos de nuestras sucursales" en la portada.
4. Tarjeta de cada sucursal.
5. Pie de página (los seis números + WhatsApp).
6. **Barra fija inferior en móvil**: "Llamar" y "WhatsApp" siempre a la vista.
7. Datos estructurados `schema.org` (`MedicalBusiness` con `telephone`,
   dirección y horario por sucursal) para que Google los lea sin ambigüedad.

Números en uso:

| Sucursal | Teléfonos |
|---|---|
| Atlántida (Coyoacán) | 55 5535 3672 · 55 5546 4247 |
| Insurgentes (Del Valle) | 55 5523 5686 · 55 5543 6397 |
| Cuauhtémoc (Río Pánuco) | 55 5511 0664 · 55 5525 8945 |
| WhatsApp | 55 4190 3849 |

El teléfono principal del sitio (barra superior, botones, barra móvil) es
**55 5511 0664**. Para cambiarlo, reemplaza `+525555110664` y `55 5511 0664`.

## Medición: Google Ads y Analytics

### Qué está instalado

En el `<head>` de las cinco páginas va la etiqueta de Google con tres destinos:

| Destino | ID | Qué es |
|---|---|---|
| Google Ads | `AW-18341185595` | Conversiones y remarketing |
| Google Analytics 4 | `G-6F4E3QHD6N` | Propiedad del snippet manual del sitio viejo |
| Google Analytics 4 | `G-T2HN7Q577Q` | Propiedad que venía dentro del contenedor `GT-NCG4C23` de Site Kit |

> **Ojo con las dos propiedades GA4.** El sitio anterior mandaba datos a las dos,
> así que se conservaron ambas para no perder ninguna serie histórica. Cuando
> decidas cuál se queda, borra la línea `gtag('config', ...)` de la otra en las
> cinco páginas. Mientras tanto, los informes están partidos entre las dos.

### Acciones de conversión

Todo vive en **`assets/js/conversiones.js`**. Un solo archivo, un solo lugar que
editar.

```js
var ETIQUETAS = {
  whatsapp:   'AW-18341185595/plC9CKiHk9kcELuQ4alE',   // Click_Whatsapp — activa
  llamada:    '',        // <- pega aquí la etiqueta de la conversión de llamada
  correo:     '',
  formulario: ''
};
```

**Para activar la conversión de llamada** (o cualquier otra que crees en Google
Ads):

1. En Google Ads: *Objetivos > Conversiones > Nueva acción de conversión >
   Sitio web > Añadir manualmente*.
2. Google te entrega un fragmento con una línea `'send_to': 'AW-18341185595/XXXX'`.
3. Copia **solo** esa etiqueta y pégala en la línea `llamada:`. Sube el archivo.

No hace falta tocar el HTML ni poner `onclick` en ningún botón.

### Cómo se disparan

El archivo engancha un único escucha de clics sobre todo el sitio. Cualquier
enlace `tel:`, `wa.me` o `mailto:` —los de ahora y los que añadas después—
registra su conversión solo:

| Acción del visitante | Conversión de Ads | Evento en GA4 |
|---|---|---|
| Clic en cualquier WhatsApp | `whatsapp` | `clic_whatsapp` |
| Clic en cualquier teléfono | `llamada` | `clic_telefono` |
| Clic en el correo | `correo` | `clic_correo` |
| Envío del formulario | `formulario` | `envio_formulario` |

Si una etiqueta está vacía, el evento de GA4 se manda igual y la conversión de
Ads simplemente se omite. Nada se rompe.

También queda definida `gtag_report_conversion(url)` con la firma exacta del
fragmento oficial de Google, por si algún día quieres poner un `onclick` a mano
en un botón concreto. Los enlaces que ya lleven ese `onclick` se detectan y no
se cuentan dos veces.

### Nota sobre las llamadas

Para atribuir llamadas conviene combinar dos cosas:

- Los clics en `tel:` del sitio (lo que hace este archivo).
- Las **extensiones de llamada** en Google Ads con el 55 5511 0664, y el
  *seguimiento de llamadas desde el sitio web*, que sustituye el número por uno
  de reenvío de Google. Eso se configura en Ads, no en el código.

## Formulario de contacto

El formulario de `contacto.html` no usa servidor: al enviarlo abre WhatsApp con
los datos ya escritos. Si más adelante quieres que llegue por correo, cambia el
bloque marcado `/* --- Envío --- */` en `assets/js/main.js` por una petición a tu
backend (por ejemplo Formspree, un `mailto:` o un PHP propio).

## Accesibilidad

Pensado para pacientes mayores: cuerpo de texto de 19 px, botones de 60 px de
alto, contraste alto y un control **A / A+ / A++** en el pie que agranda todo el
sitio y recuerda la elección.

## Confirmado

- Direcciones y teléfonos de las tres sucursales (verificados contra el sitio actual).
- Redes sociales: `facebook.com/grupodeasaoficial/` e `instagram.com/grupodeasaoficial/`.

## Pendientes por confirmar antes de publicar

1. **Correo electrónico.** Se puso `contacto@audifonosdeasa.com` como marcador.
   Cámbialo por el real (aparece en `contacto.html`).
2. **Teléfonos de los distribuidores foráneos** (Michoacán, Chiapas, Jalisco,
   Guanajuato, San Luis Potosí). Se tomaron de audifonos.com.mx porque en las
   capturas del sitio actual no eran legibles. Conviene verificarlos.
3. **Horario.** Se puso Lun–Vie 9:00–19:00 y Sáb 9:00–14:00. Ajústalo si difiere.
4. **Fotos de las sucursales Atlántida e Insurgentes.** Las imágenes actuales son
   de la matriz; si hay fotos propias de cada sucursal, quedarían mejor.

## Vista previa local

```bash
python -m http.server 5599
```

Y abre <http://localhost:5599>.
