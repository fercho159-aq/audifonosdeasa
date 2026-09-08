/* ==========================================================================
   GRUPO DEASA WIDEX — Conversiones de Google Ads y eventos de GA4

   ┌────────────────────────────────────────────────────────────────────┐
   │  PARA AÑADIR UNA CONVERSIÓN NUEVA (por ejemplo, la de llamada):     │
   │                                                                     │
   │  1. Créala en Google Ads:                                           │
   │     Objetivos > Conversiones > Nueva acción de conversión >         │
   │     Sitio web > "Añadir manualmente" > categoría "Contacto" o       │
   │     "Llamada telefónica".                                           │
   │                                                                     │
   │  2. Google te dará un "fragmento de evento" con una línea así:      │
   │     'send_to': 'AW-18341185595/AbCdEfGhIjKlMnOpQ'                   │
   │                                                                     │
   │  3. Copia SOLO esa etiqueta (AW-.../...) y pégala aquí abajo,       │
   │     en la línea que corresponda. Guarda y sube el archivo.          │
   │     No hay que tocar ninguna otra cosa.                             │
   └────────────────────────────────────────────────────────────────────┘
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     ETIQUETAS DE CONVERSIÓN — esto es lo único que se edita
     ------------------------------------------------------------------ */
  var ETIQUETAS = {

    /* Clic en cualquier botón o enlace de WhatsApp */
    whatsapp: 'AW-18341185595/plC9CKiHk9kcELuQ4alE',

    /* Clic en cualquier teléfono (tel:). Pega aquí la etiqueta cuando
       crees la acción de conversión de llamada en Google Ads. */
    llamada: '',

    /* Clic en el correo electrónico (mailto:) */
    correo: '',

    /* Envío del formulario de la página de contacto */
    formulario: ''
  };

  /* Nombre del evento equivalente en Google Analytics 4 */
  var EVENTOS_GA4 = {
    whatsapp:   'clic_whatsapp',
    llamada:    'clic_telefono',
    correo:     'clic_correo',
    formulario: 'envio_formulario'
  };

  /* ------------------------------------------------------------------
     Motor. De aquí para abajo no hace falta tocar nada.
     ------------------------------------------------------------------ */

  function etiquetarElemento(el) {
    if (!el) return '';
    return el.getAttribute('data-track-label') ||
           (el.textContent || '').trim().slice(0, 60) ||
           el.getAttribute('aria-label') || '';
  }

  /**
   * Registra una conversión de Google Ads y su evento equivalente en GA4.
   * @param {string} tipo      Clave de ETIQUETAS: whatsapp | llamada | correo | formulario
   * @param {Element} [el]     Elemento que originó la acción (para la etiqueta descriptiva)
   * @param {Function} [luego] Se ejecuta cuando Google confirma el envío (o a los 800 ms)
   */
  function registrar(tipo, el, luego) {
    var descripcion = etiquetarElemento(el);
    var enviado = false;
    var continuar = function () {
      if (enviado) return;
      enviado = true;
      if (typeof luego === 'function') luego();
    };

    try {
      if (typeof window.gtag === 'function') {

        /* 1) Conversión de Google Ads (solo si la etiqueta está puesta) */
        if (ETIQUETAS[tipo]) {
          window.gtag('event', 'conversion', {
            send_to: ETIQUETAS[tipo],
            event_callback: continuar
          });
        }

        /* 2) Evento de Google Analytics 4 */
        if (EVENTOS_GA4[tipo]) {
          window.gtag('event', EVENTOS_GA4[tipo], {
            event_category: 'contacto',
            event_label: descripcion
          });
        }
      }

      /* 3) dataLayer, por si más adelante se usa Google Tag Manager */
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: EVENTOS_GA4[tipo] || tipo, contacto_etiqueta: descripcion });

    } catch (e) { /* la medición nunca debe romper el sitio */ }

    /* Red de seguridad: si Google no responde, seguimos igual */
    if (typeof luego === 'function') window.setTimeout(continuar, 800);
  }

  /* Disponible para el resto del sitio (lo usa el formulario en main.js) */
  window.deasaConversion = registrar;

  /**
   * Función con la firma oficial de Google Ads, por si se quiere poner
   * un onclick a mano:
   *   <a href="..." onclick="return gtag_report_conversion('...');">
   * Por omisión reporta la conversión de WhatsApp, igual que el
   * fragmento que entrega Google Ads.
   */
  window.gtag_report_conversion = function (url, tipo) {
    registrar(tipo || 'whatsapp', null, function () {
      if (typeof url !== 'undefined' && url) window.location = url;
    });
    return false;
  };

  /* ------------------------------------------------------------------
     Enganche automático: cualquier enlace de teléfono, WhatsApp o correo
     del sitio registra su conversión sin necesidad de ponerle onclick.
     Sirve también para los botones que se añadan en el futuro.
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var a = e.target.closest(
      'a[href^="tel:"], a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="mailto:"]'
    );
    if (!a) return;

    /* Si el enlace ya lleva su propio onclick de Google, no duplicamos */
    if ((a.getAttribute('onclick') || '').indexOf('gtag_report_conversion') !== -1) return;

    var href = a.getAttribute('href') || '';
    var tipo = href.indexOf('tel:') === 0 ? 'llamada'
             : href.indexOf('mailto:') === 0 ? 'correo'
             : 'whatsapp';

    /* No interceptamos la navegación: los tel: abren el marcador sin
       descargar la página y los de WhatsApp abren en otra pestaña,
       así que da tiempo de sobra a que el evento salga. */
    registrar(tipo, a);
  });

})();
