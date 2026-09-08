# Contexto del proyecto — Grupo DEASA Widex

> Documento de traspaso. Está escrito para que otra persona —o otra IA— pueda
> retomar el trabajo sin haber estado en la conversación original. Contiene el
> estado del proyecto, las decisiones que se tomaron y por qué, los datos
> canónicos del negocio, y las recomendaciones de Google Ads.
>
> Última actualización: septiembre de 2026.

---

## 1. Qué es esto

Sitio web de **Grupo DEASA Widex**, centros auditivos oficiales en la Ciudad de
México. Venden y adaptan audífonos (auxiliares auditivos) de la marca Widex,
hacen audiometría, moldes a la medida y reparación. Operan desde 1981. También
tienen una óptica, **Óptica Pánuco**, en la misma dirección de la matriz.

- **Sitio en producción (viejo):** https://audifonosdeasa.com — WordPress 6.6.7
- **Sitio nuevo (este repo):** https://github.com/fercho159-aq/audifonosdeasa
- **Referencia de diseño:** https://www.audifonos.com.mx — es un sitio de la
  misma marca, más moderno; el cliente pidió que el nuevo se pareciera a ese.

El sitio nuevo **todavía no está publicado**. Está en el repo, listo para subir.

---

## 2. Qué se hizo

Se rehízo el sitio completo como **HTML + CSS + JavaScript estáticos**, sin
WordPress, sin framework, sin proceso de build. Se sube por FTP y funciona.

Motivo del cambio: el objetivo del cliente es captar llamadas y mensajes de
WhatsApp desde campañas de Google Ads. El sitio viejo tenía tres problemas para
eso (detallados en la sección 6) y una velocidad de carga pobre.

### Punto de partida

La carpeta de trabajo solo contenía `media/uploads` — el volcado de la
biblioteca de medios de WordPress: 3,519 imágenes más un `.tar` de 431 MB. No
había tema, plantillas ni código. El contenido del sitio se reconstruyó a partir
de capturas de pantalla del sitio en producción.

**Advertencia sobre esa biblioteca:** contiene material de varios clientes
distintos mezclado. Hay fotos de un consultorio de "Ortopedia y Cirugía del
Deporte" y demos del tema original de WordPress. Solo se usaron las imágenes
que son verificablemente de DEASA (recepción con el logo, cabina audiométrica,
laboratorio de moldes, el audioprotesista, producto Widex) y las de Óptica
Pánuco. **No tomar imágenes nuevas de `media/` sin verificar que corresponden a
este negocio.**

La carpeta `media/` está excluida del repo con `.gitignore` (el `.tar` supera el
límite de 100 MB por archivo de GitHub). Sigue existiendo en la máquina local.

---

## 3. Datos canónicos del negocio

Esta es la fuente de verdad. Si algo en el código contradice esta tabla, gana
esta tabla.

### Sucursales

| Sucursal | Dirección | Teléfonos |
|---|---|---|
| **Cuauhtémoc** (matriz) | Río Pánuco No. 183, Col. Cuauhtémoc, C.P. 06500, Alcaldía Cuauhtémoc, CDMX | 55 5511 0664 · 55 5525 8945 |
| **Atlántida** | Central No. 92, Local B, Col. Atlántida, C.P. 04370, Alcaldía Coyoacán, CDMX | 55 5535 3672 · 55 5546 4247 |
| **Insurgentes** | Insurgentes Sur 590, Int. D4, Col. Del Valle, C.P. 03100, Alcaldía Benito Juárez, CDMX | 55 5523 5686 · 55 5543 6397 |

**WhatsApp:** 55 4190 3849 (`wa.me/525541903849`) — es el único número de
WhatsApp del negocio y también el que usa Óptica Pánuco.

**Teléfono principal del sitio** (barra superior, botones del hero, barra fija
de móvil): **55 5511 0664**. Para cambiarlo hay que reemplazar dos cadenas en
los cinco HTML: `+525555110664` y `55 5511 0664`.

### Distribuidores en el interior

⚠️ **Estos números NO están verificados.** Se tomaron de audifonos.com.mx porque
en las capturas del sitio en producción el texto era ilegible. Confirmar con el
cliente antes de publicar.

| Estado | Nombre | Ciudad | Teléfono |
|---|---|---|---|
| Michoacán | Dr. Jaime A. Zaragoza | Los Reyes | 354 108 2576 |
| Chiapas | Dra. Adriana Pastrana Ruiz | Tuxtla Gutiérrez | 961 602 6028 |
| Jalisco | María Emilia Jiménez Ávalos | Guadalajara | 331 184 6522 |
| Guanajuato | Dr. Raúl Medina Rivera | Irapuato | 462 625 3142 |
| San Luis Potosí | Dr. José Luis Ramírez Herrera | Cd. Valles | 481 112 9283 |
| Michoacán | Dr. Fernando Oropeza | Uruapan | 452 527 0282 |

### Otros datos

- **Redes:** `facebook.com/grupodeasaoficial/` · `instagram.com/grupodeasaoficial/`
  (confirmados por el cliente).
- **Horario:** Lun–Vie 9:00–19:00, Sáb 9:00–14:00. **Sin confirmar.**
- **Correo:** `contacto@audifonosdeasa.com` es un **marcador**, no el correo real.
  Aparece en `contacto.html` y en el JSON-LD.
- **Servicios (8):** examen diagnóstico, auxiliares auditivos, accesorios y pilas,
  reparación de auxiliares, revisión y servicio, adaptación de auxiliares, venta
  de equipo médico de diagnóstico (Interacoustics), elaboración de moldes.

---

## 4. Arquitectura

```
index.html · nosotros.html · servicios.html · optica.html · contacto.html
assets/css/app.css          Sistema de diseño completo, CSS propio
assets/js/main.js           Interacciones (menú, acordeón, formulario, etc.)
assets/js/conversiones.js   Conversiones de Google Ads y eventos de GA4
assets/img/                 24 imágenes, todas usadas
robots.txt · sitemap.xml · .htaccess
```

Peso total: 1.8 MB. Sin dependencias externas salvo Google Fonts y las
etiquetas de Google.

### Decisiones que conviene no revertir sin motivo

**Sin Tailwind CDN.** El sitio de referencia lo carga, pero el Play CDN compila
el CSS en el navegador: bloquea el render y provoca FOUC. Se escribió un
`app.css` propio (~620 líneas) con el mismo sistema de diseño. Esto importa
porque la velocidad de la página de destino entra en el Nivel de calidad de
Google Ads.

**Sin `onclick` en los botones para medir conversiones.** Google entrega
instrucciones que piden poner `onclick="return gtag_report_conversion(...)"` en
cada enlace. El sitio tiene más de 30 enlaces de teléfono; hacerlo a mano
garantiza olvidos. En vez de eso, `conversiones.js` engancha **un solo escucha
de clics delegado** que cubre todo enlace `tel:`, `wa.me` y `mailto:` —
incluidos los que se agreguen después. Ver sección 5.

**Cabecera y pie repetidos en los cinco HTML.** Es un sitio estático sin build
por decisión: el cliente puede editarlo con un editor de texto y subirlo por
FTP. El costo es que un cambio en el menú o en un teléfono hay que hacerlo en
cinco archivos. Usar "buscar y reemplazar en todos los archivos".

**Tipografía a 19 px y botones de 60 px de alto.** El público son personas con
pérdida auditiva, mayoritariamente mayores de 60 años. Hay además un control
A / A+ / A++ en el pie que agranda todo el sitio y recuerda la elección en
`localStorage`. No reducir estos tamaños.

**Los teléfonos nunca son imágenes.** Siempre texto real dentro de `<a href="tel:">`.
Ver sección 7.

---

## 5. Medición instalada

En el `<head>` de las cinco páginas, la etiqueta de Google con tres destinos:

| Destino | ID | Qué es |
|---|---|---|
| Google Ads | `AW-18341185595` | Conversiones y remarketing |
| Google Analytics 4 | `G-6F4E3QHD6N` | Propiedad del snippet manual del sitio viejo |
| Google Analytics 4 | `G-T2HN7Q577Q` | Propiedad que venía en el contenedor `GT-NCG4C23` de Site Kit |

Se conservaron **las dos** propiedades GA4 porque el sitio viejo mandaba datos a
ambas y no se sabe cuál tiene el histórico bueno. **Hay que decidir cuál se
queda y borrar la línea `gtag('config', ...)` de la otra en los cinco HTML.**
Mientras tanto los informes están partidos.

### Cómo funcionan las conversiones

Todo vive en `assets/js/conversiones.js`. La única parte editable:

```js
var ETIQUETAS = {
  whatsapp:   'AW-18341185595/plC9CKiHk9kcELuQ4alE',  // Click_Whatsapp — activa
  llamada:    'AW-18341185595/R0_vCLmVvvEcELuQ4alE',  // Contacto — activa
  correo:     '',        // pendiente
  formulario: ''         // pendiente
};
```

Para activar una conversión: crearla en Google Ads, copiar la etiqueta del
`send_to` del fragmento de evento (formato `AW-18341185595/XXXXXXXX`) y pegarla
en la línea correspondiente. **Nada más.** No se toca el HTML.

Comportamiento:

| Acción del visitante | Conversión de Ads | Evento en GA4 |
|---|---|---|
| Clic en cualquier WhatsApp | `whatsapp` | `clic_whatsapp` |
| Clic en cualquier teléfono | `llamada` | `clic_telefono` |
| Clic en el correo | `correo` | `clic_correo` |
| Envío del formulario | `formulario` | `envio_formulario` |

Si una etiqueta está vacía, el evento de GA4 se manda igual y la conversión de
Ads se omite en silencio. Nada se rompe.

También queda definida `window.gtag_report_conversion(url)` con la firma exacta
del fragmento oficial de Google, por si hiciera falta un `onclick` manual en
algún botón concreto. Los enlaces que ya lleven ese `onclick` se detectan y se
excluyen del escucha automático, para no contar doble.

Verificado en navegador interceptando las llamadas a `gtag`: el clic en
WhatsApp dispara `AW-18341185595/plC9CKiHk9kcELuQ4alE`, el clic en teléfono
dispara la etiqueta de `llamada` cuando está puesta, y la función oficial
funciona. Sin errores en consola.

---

## 6. Qué estaba mal en el sitio viejo

Auditoría de https://audifonosdeasa.com hecha en septiembre de 2026, cargando el
sitio en un navegador real. Se documenta porque explica por qué las campañas
pueden no estar registrando lo que deberían.

**1. La conversión de WhatsApp nunca se disparó.** La acción `Click_Whatsapp`
(`AW-18341185595/plC9CKiHk9kcELuQ4alE`) estaba creada y su función
`gtag_report_conversion()` estaba definida en el `<head>` de todas las páginas,
pero **ningún botón la llamaba**. Los enlaces de WhatsApp no tenían `onclick` ni
ningún listener. Es decir: esa acción de conversión lleva registrando cero desde
que se creó, y cualquier campaña que optimice hacia ella está optimizando a
ciegas. **Al revisar el histórico de la cuenta hay que tener esto en cuenta: la
ausencia de conversiones no significa que no hubiera contactos.**

**2. Dos propiedades GA4 midiendo el mismo sitio.** Se confirmaron dos hits
`page_view` a IDs distintos: `G-T2HN7Q577Q` (dentro del contenedor de Site Kit)
y `G-6F4E3QHD6N` (snippet pegado a mano). Los datos están divididos.

**3. Error de JavaScript en todas las páginas.** Consola:
`SyntaxError: Unexpected token '<'`. Alguien pegó el snippet completo de Google
—incluyendo `<script async src=...>`— dentro de un bloque que ya abría
`<script>`, produciendo un `<script>` anidado. Google Ads seguía funcionando
porque gtag.js ya venía cargado por las otras etiquetas y levantaba el destino
`AW-` por su cuenta, pero el error salía en cada carga.

**4. Seis de los siete teléfonos no eran clicables.** Solo el 55 4190 3849
estaba como `tel:`. Los seis números de sucursal eran texto plano: no se podía
tocar para llamar desde el celular y Google no podía atribuir esas llamadas.

Los cuatro problemas están resueltos en el sitio nuevo.

---

## 7. Recomendaciones de Google Ads

Esta es la sección que más importa. El objetivo declarado del cliente es
**generar llamadas y mensajes de WhatsApp**, no ventas en línea.

### 7.1 El problema de la palabra «audífonos»

**Es el riesgo más grande de la cuenta y hay que atenderlo antes que nada.**

En México, «audífonos» significa coloquialmente *auriculares* —los de escuchar
música— mucho más a menudo que *aparatos auditivos*. Una campaña que puje por
"audífonos" sin protección va a gastar el presupuesto en gente buscando
AirPods. El dominio del cliente es literalmente `audifonosdeasa.com`, así que la
tentación de pujar por ese término es alta.

**Lista de negativas mínima, en concordancia amplia:**

```
bluetooth · inalámbricos · inalambricos · gamer · gaming · diadema
manos libres · deportivos · con cable · cancelación de ruido
airpods · beats · jbl · sony · bose · samsung · xiaomi · skullcandy
para correr · para nadar · para dormir · para celular · para computadora
liverpool · coppel · elektra · amazon · mercado libre · steren
reparar audifonos bluetooth · fundas · estuche
```

**Términos que sí traen intención correcta:**
*aparatos auditivos, auxiliares auditivos, aparato para sordera, audífonos para
sordos, audífonos para sordera, audiometría, prueba de audición, audioprotesista,
Widex, moldes auditivos, no escucho bien.*

Recomendación: construir los grupos de anuncios alrededor de **«aparatos
auditivos»** y **«auxiliares auditivos»**, no de «audífonos» a secas. Usar
«audífonos» solo en frases largas que desambigüen (`audífonos para sordera`,
`audífonos para adultos mayores`) y en concordancia de frase o exacta, nunca
amplia.

Revisar el informe de términos de búsqueda **semanalmente** las primeras
semanas. Ahí es donde aparecen las negativas que faltan.

### 7.2 Acciones de conversión

**Ya conectadas y funcionando:**

| Acción en Ads | Etiqueta | Qué dispara |
|---|---|---|
| `Click_Whatsapp` | `AW-18341185595/plC9CKiHk9kcELuQ4alE` | Clic en cualquier enlace de WhatsApp |
| `Contacto` | `AW-18341185595/R0_vCLmVvvEcELuQ4alE` | Clic en cualquiera de los 7 teléfonos |

**Falta crear:**

| Acción | Categoría sugerida | Recuento | Principal |
|---|---|---|---|
| Envío de formulario | Enviar formulario de contacto | **Una** | Sí |
| Clic en correo | Contacto | Una | No (secundaria) |

Notas sobre la configuración:

- **Recuento «Una», no «Todas».** Una persona indecisa toca el número tres
  veces antes de llamar. Con «Todas» eso cuenta como tres conversiones e infla
  los datos con los que Smart Bidding aprende.
- **Ventana de conversión: 30 días** es razonable. La decisión de comprar un
  auxiliar auditivo no es impulsiva; hay consulta con la familia de por medio.
  Una ventana de 7 días subcontaría.
- **Valor:** si no se sabe el valor real, dejar sin valor y usar *Maximizar
  conversiones*. Si se quiere pujar por valor más adelante, hay que estimar el
  ticket promedio de un auxiliar auditivo y la tasa de cierre desde contacto.
  No inventar valores: un valor mal puesto es peor que ninguno.
- **Principal vs secundaria:** solo WhatsApp, llamada y formulario deben ser
  **principales**. Todo lo demás (clic en correo, vistas de página, tiempo en
  sitio) va como secundaria: informa pero no dirige las pujas.

### 7.3 Llamadas: hay dos cosas distintas y conviene medir ambas

1. **Clic en `tel:` del sitio** — es lo que mide `conversiones.js`. Mide
   *intención*, no la llamada. Sirve, pero sobreestima: la gente toca y cuelga.
2. **Seguimiento de llamadas de Google** — sustituye el número por uno de
   reenvío y mide la llamada real, con duración. Esto se configura **en Google
   Ads, no en el código**:
   - *Recursos de llamada* (antes «extensiones de llamada») en la campaña.
   - *Informes de llamadas* activado a nivel cuenta.
   - Conversión «Llamadas desde anuncios» con duración mínima —
     **60 segundos es un buen umbral** para este negocio: filtra los
     equivocados y cuenta las consultas reales.

Si se activa el número de reenvío de Google en el sitio, **puede sustituir
visualmente el número en la página**. Verificar que no rompa el diseño de la
barra superior ni de la barra fija de móvil.

### 7.4 Estructura de campañas sugerida

Separar por **intención**, no por sucursal — el volumen en CDMX no da para tres
campañas geográficas separadas y dividirlo retrasa el aprendizaje.

```
Campaña 1 — Búsqueda · Aparatos auditivos (la principal)
  Grupo: Aparatos auditivos genérico   → servicios.html
  Grupo: Marca Widex                   → servicios.html#auxiliares
  Grupo: Audiometría / prueba          → contacto.html
  Grupo: Moldes a la medida            → servicios.html#moldes

Campaña 2 — Búsqueda · Reparación y servicio
  Grupo: Reparación de aparatos        → servicios.html#reparacion
  (intención distinta y mucho más barata; no mezclar con la de venta)

Campaña 3 — Búsqueda · Marca
  Grupo: Grupo DEASA / audifonosdeasa  → index.html
  (defensiva, CPC bajo, protege el nombre)

Campaña 4 — Búsqueda · Óptica  [opcional, presupuesto aparte]
  Grupo: Lentes graduados / examen     → optica.html
```

**Cada grupo apunta a la página que responde a esa búsqueda**, no todo al
inicio. Esto sube el Nivel de calidad y baja el CPC. El sitio nuevo tiene anclas
específicas (`#examen`, `#auxiliares`, `#moldes`, `#reparacion`, `#adaptacion`,
`#equipo`, `#revision`, `#accesorios`) precisamente para esto.

### 7.5 Segmentación

- **Ubicación:** CDMX y zona conurbada. Configurar como *Presencia: personas
  que están habitualmente en* — no «o que muestran interés en», que es el valor
  por omisión y trae clics de fuera.
- **Radios:** si el presupuesto lo permite, radios de 8–10 km alrededor de cada
  sucursal con ajuste de puja positivo. Coyoacán, Del Valle y Cuauhtémoc cubren
  buena parte del sur y centro de la ciudad.
- **Edad:** el que busca no siempre es el que va a usar el aparato. Muchas
  búsquedas las hace un hijo o hija de 35–55 años para un padre. **No excluir
  esos rangos de edad.** El sitio ya contempla esto: el formulario tiene el
  campo «¿Para quién es la cita?».
- **Horario:** subir pujas en horario de atención (Lun–Vie 9–19, Sáb 9–14),
  cuando alguien puede llamar y que le contesten. Bajarlas fuera de ese horario
  o dirigir esos clics a WhatsApp, que sí acepta mensajes a cualquier hora.
- **Dispositivo:** este público llama desde el celular. Revisar el desglose y
  ajustar, pero de entrada no penalizar móvil.

### 7.6 Recursos (extensiones)

| Recurso | Contenido sugerido |
|---|---|
| **Llamada** | 55 5511 0664, limitado al horario de atención |
| **Ubicación** | Vincular el perfil de Google Business de cada sucursal |
| **Enlaces de sitio** | Servicios · Óptica Pánuco · Nosotros · Contacto y sucursales |
| **Textos destacados** | Desde 1981 · Distribuidor autorizado Widex · Laboratorio de moldes propio · 3 sucursales en CDMX · Refacciones originales |
| **Fragmentos estructurados** | Encabezado «Servicios»: Audiometría, Auxiliares auditivos, Moldes a la medida, Reparación, Accesorios |
| **Mensaje / WhatsApp** | Si la cuenta lo permite en México, con el 55 4190 3849 |

**Vincular el Perfil de Empresa de Google** de las tres sucursales es de las
acciones con mejor relación esfuerzo/resultado: habilita los recursos de
ubicación, alimenta las campañas locales y mejora la presencia orgánica en
Maps, que para un negocio de barrio pesa mucho.

### 7.7 Página de destino y Nivel de calidad

Lo que el sitio nuevo ya resuelve:

- Carga rápida (1.8 MB, sin framework, sin CDN que compile en el navegador).
- Teléfono y WhatsApp visibles sin hacer scroll, en todas las páginas.
- Barra fija inferior en móvil con «Llamar» y «WhatsApp» siempre a la vista.
- Datos estructurados `MedicalBusiness` por sucursal con teléfono, dirección y
  horario.
- Correspondencia entre búsqueda y contenido: cada servicio tiene su sección con
  ancla propia.

Lo que conviene vigilar:

- **No mandar todo el tráfico al inicio.** Es el error más común y castiga el
  Nivel de calidad.
- Si se crean páginas de destino específicas para campañas, mantener el mismo
  patrón de teléfonos: texto real en `tel:`, grande, y cargar
  `assets/js/conversiones.js` para que la medición siga funcionando.

### 7.8 Políticas: hay que tener cuidado

Los aparatos auditivos son **dispositivos médicos**. Google aplica políticas de
sanidad más estrictas de lo habitual.

- **No prometer resultados médicos.** «Recupera tu audición», «cura la sordera»
  y similares son terreno peligroso. El sitio está redactado en términos de
  «nuevos horizontes de audición» y «calidad auditiva», que es lo correcto.
- **Cuidado con las afirmaciones de gratuidad.** Ver sección 8: hay una que
  necesita confirmarse antes de publicar. Anunciar un servicio gratuito que
  luego se cobra es motivo de suspensión y, además, destruye la confianza en la
  primera llamada.
- **Widex es marca registrada.** El cliente es distribuidor autorizado, lo que
  normalmente permite usar la marca. Si Google rechaza anuncios por marca
  comercial, se resuelve con la autorización del fabricante mediante el
  formulario de marcas de Google.

### 7.9 Qué vigilar las primeras semanas

1. **Informe de términos de búsqueda**, semanal. Es donde se descubren las
   negativas que faltan. Para este negocio es más importante que en casi
   cualquier otro, por lo de «audífonos».
2. **Que las conversiones estén entrando.** Con el historial que tiene esta
   cuenta —una conversión que llevaba meses sin dispararse— conviene
   confirmarlo activamente: usar el *Asistente de etiquetas de Google* y hacer
   un clic real en WhatsApp y en un teléfono desde el sitio publicado.
3. **Proporción llamada / WhatsApp.** Va a decir dónde poner el esfuerzo. Si
   WhatsApp domina, vale la pena una respuesta rápida configurada del lado del
   negocio.
4. **No tocar las pujas los primeros 14 días.** Smart Bidding necesita datos, y
   ahora por fin los va a tener.

---

## 8. Pendientes y riesgos

### ⚠️ Afirmación por confirmar

En `index.html`, línea 128, el hero dice **«Evaluación auditiva sin costo»**.

Esa afirmación **no existe en el sitio en producción**: se tomó del sitio de
referencia audifonos.com.mx, que anuncia «Tu primera audiometría es sin costo».
**Hay que confirmar con el cliente si DEASA efectivamente da la evaluación sin
costo.** Si no es así, quitarla — y con más razón si se va a anunciar en Google
Ads, donde una promoción falsa es motivo de suspensión de la cuenta.

(La otra afirmación de gratuidad, «Examen de la vista GRATIS» de Óptica Pánuco,
sí está en el sitio en producción y en su material gráfico.)

### Pendientes

| # | Qué | Dónde |
|---|---|---|
| 1 | Confirmar o quitar «Evaluación auditiva sin costo» | `index.html:128` |
| 2 | Correo electrónico real | `contacto.html` y el JSON-LD |
| 3 | Verificar los seis teléfonos de distribuidores | `index.html`, `nosotros.html`, `contacto.html` |
| 4 | Confirmar el horario | Los cinco HTML y el JSON-LD |
| 5 | Decidir cuál propiedad GA4 se queda y borrar la otra | `<head>` de los cinco HTML |
| 6 | ~~Etiqueta de la conversión de llamada~~ — hecho | `conversiones.js` |
| 7 | Fotos propias de las sucursales Atlántida e Insurgentes | `assets/img/` |
| 8 | Publicar el sitio y verificar las etiquetas en producción | — |

---

## 9. Cómo trabajar en este repo

```bash
# Vista previa local
python -m http.server 5599
# → http://localhost:5599
```

Al subir a producción: **no subir `media/`**. Lo demás va tal cual a la raíz del
dominio. No requiere PHP ni base de datos.

Si vas a modificar el sitio, lee antes el `README.md`: documenta el sistema de
diseño, los componentes de CSS disponibles y cómo está montada la medición.
