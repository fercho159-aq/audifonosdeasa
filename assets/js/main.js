/* ==========================================================================
   GRUPO DEASA · WIDEX — interacciones
   Vanilla JS, sin dependencias.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Header con sombra al hacer scroll ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('menu-movil');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Tamaño de texto accesible (A / A+ / A++) ---------- */
  try {
    var saved = localStorage.getItem('deasa-text');
    if (saved) document.documentElement.setAttribute('data-text', saved);
  } catch (e) {}

  var sizeButtons = document.querySelectorAll('[data-text-set]');
  sizeButtons.forEach(function (btn) {
    var v = btn.getAttribute('data-text-set');
    if ((document.documentElement.getAttribute('data-text') || '') === v) {
      btn.setAttribute('aria-pressed', 'true');
    }
    btn.addEventListener('click', function () {
      if (v) document.documentElement.setAttribute('data-text', v);
      else document.documentElement.removeAttribute('data-text');
      try { localStorage.setItem('deasa-text', v || ''); } catch (e) {}
      sizeButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  /* ---------- Reveal al hacer scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 3, 2) * 100) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Barras de porcentaje ---------- */
  var meters = document.querySelectorAll('[data-meter]');
  if (meters.length) {
    var fill = function (el) { el.style.width = el.getAttribute('data-meter') + '%'; };
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { fill(entry.target); mo.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      meters.forEach(function (el) { mo.observe(el); });
    } else {
      meters.forEach(fill);
    }
  }

  /* ---------- Acordeón FAQ ---------- */
  document.querySelectorAll('[data-accordion] .faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var open = trigger.getAttribute('aria-expanded') === 'true';
      var group = trigger.closest('[data-accordion]');

      group.querySelectorAll('.faq-trigger').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.classList.add('is-hidden');
      });

      if (!open) {
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) panel.classList.remove('is-hidden');
      }
    });
  });

  /* ---------- Volver arriba ---------- */
  var toTop = document.querySelector('[data-top]');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Formulario de cita ----------
     Envía por WhatsApp (no requiere servidor). Si más adelante se conecta
     un backend, basta con cambiar el bloque marcado abajo.                */
  document.querySelectorAll('form[data-cita]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = new FormData(form);
      var texto =
        'Hola Grupo DEASA Widex, quiero agendar una cita.\n' +
        '• Nombre: ' + (data.get('nombre') || '') + '\n' +
        '• Teléfono: ' + (data.get('telefono') || '') + '\n' +
        '• Correo: ' + (data.get('correo') || 'No proporcionado') + '\n' +
        '• Sucursal: ' + (data.get('sucursal') || '') + '\n' +
        '• Motivo: ' + (data.get('motivo') || '') + '\n' +
        '• Mensaje: ' + (data.get('mensaje') || 'Sin comentarios');

      var numero = form.getAttribute('data-wa') || '525541903849';
      if (window.deasaConversion) window.deasaConversion('formulario', form);

      /* --- Envío --- */
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      var body = form.querySelector('[data-form-body]');
      var ok = form.querySelector('[data-form-ok]');
      if (body) body.classList.add('is-hidden');
      if (ok) {
        ok.classList.remove('is-hidden');
        ok.setAttribute('tabindex', '-1');
        ok.focus();
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- Seguimiento de conversiones ----------
     Vive en assets/js/conversiones.js: registra los clics en teléfonos,
     WhatsApp y correo como conversiones de Google Ads y eventos de GA4. */

  /* ---------- Año en el pie ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

})();
