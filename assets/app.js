// PacificFly — comportamiento compartido por las páginas de la propuesta (versión 6).
// Cada bloque revisa si su sección existe en la página antes de actuar.
(() => {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  // Cabecera con sombra al desplazarse
  const cabecera = $('.cabecera');
  if (cabecera) {
    const sombra = () => cabecera.classList.toggle('con-sombra', window.scrollY > 8);
    addEventListener('scroll', sombra, { passive: true }); sombra();
  }

  // Menú desplegable «Servicios» (escritorio): clic, Esc o clic afuera lo cierran
  const servBtn = $('.nav__servicios'), servMenu = $('#menu-servicios');
  if (servBtn && servMenu) {
    const fijarServ = (abrir) => { servBtn.setAttribute('aria-expanded', String(abrir)); servMenu.hidden = !abrir; };
    servBtn.addEventListener('click', () => fijarServ(servBtn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('click', (e) => { if (!e.target.closest('.nav__grupo')) fijarServ(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !servMenu.hidden) { fijarServ(false); servBtn.focus(); } });
  }

  // Menú en celular
  const menuBtn = $('.menu-btn'), menu = $('#menu-movil');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const abierto = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!abierto));
      menuBtn.setAttribute('aria-label', abierto ? 'Abrir menú' : 'Cerrar menú');
      menu.hidden = abierto;
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'false'); menu.hidden = true; }));
  }

  // Cifras que cuentan hasta su valor
  const contar = (ambito) => $$('[data-contar]', ambito).forEach(el => {
    const fin = +el.dataset.contar, pre = el.dataset.prefijo || '', suf = el.dataset.sufijo || '';
    const t0 = performance.now(), dur = 1700;
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(fin * e).toLocaleString('es-CO') + suf;
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });

  // Aparición al entrar en pantalla
  const observados = $$('.revelar, .mapa, .pasos, .indicadores');
  if (reducir || !('IntersectionObserver' in window)) {
    observados.forEach(el => el.classList.add('visible', 'en-vista'));
  } else {
    $$('.indicadores [data-contar]').forEach(el => { el.textContent = (el.dataset.prefijo || '') + '0' + (el.dataset.sufijo || ''); });
    const io = new IntersectionObserver((entradas) => entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible', 'en-vista');
      if (e.target.classList.contains('indicadores')) contar(e.target);
      io.unobserve(e.target);
    }), { threshold: .2, rootMargin: '0px 0px -6% 0px' });
    observados.forEach(el => io.observe(el));
  }

  // Carrusel deslizable genérico: lista que se desplaza de lado, flechas y contador «1 de N».
  // En escritorio la lista no se desplaza (es cuadrícula u otra vista) y los controles se ocultan por CSS.
  const deslizable = (lista, controles) => {
    const items = () => [...lista.children];
    const contador = $('[aria-live]', controles);
    const anterior = $('[data-dir="-1"]', controles), siguiente = $('[data-dir="1"]', controles);
    const ancho = () => { const it = items(); return it[1] ? it[1].offsetLeft - it[0].offsetLeft : lista.clientWidth; };
    const actualizar = () => {
      const desliza = lista.scrollWidth > lista.clientWidth + 2;
      lista.tabIndex = desliza ? 0 : -1;
      if (!desliza) return;
      const total = items().length;
      const i = Math.min(total - 1, Math.max(0, Math.round(lista.scrollLeft / ancho())));
      contador.textContent = `${i + 1} de ${total}`;
      anterior.disabled = lista.scrollLeft <= 2;
      siguiente.disabled = lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 2;
    };
    lista.addEventListener('scroll', () => requestAnimationFrame(actualizar), { passive: true });
    [anterior, siguiente].forEach(b => b.addEventListener('click', () => {
      lista.scrollBy({ left: +b.dataset.dir * ancho(), behavior: reducir ? 'auto' : 'smooth' });
    }));
    addEventListener('resize', actualizar);
    actualizar();
  };

  // Tipos de traslado: en celular la cuadrícula se vuelve carrusel deslizable.
  const tiposLista = $('#tipos-lista');
  if (tiposLista && $('.tipos__controles')) deslizable(tiposLista, $('.tipos__controles'));

  // Flota: al seleccionar un avión cambia la imagen. Sin foto, se muestra el aviso de foto pendiente.
  const pestanas = $$('.flota__tab');
  if (pestanas.length) {
    const panel = $('#flota-panel'), foto = $('#flota-foto'), pendiente = $('#flota-pendiente');
    const pie = $('#flota-pie'), nombrePendiente = $('#flota-pendiente-nombre');
    const elegir = (tab, foco) => {
      pestanas.forEach(t => {
        const si = t === tab;
        t.setAttribute('aria-selected', String(si));
        t.tabIndex = si ? 0 : -1;
      });
      if (foco) tab.focus();
      panel.setAttribute('aria-labelledby', tab.id);
      panel.dataset.marca = tab.dataset.marca;
      pie.textContent = tab.dataset.nombre;
      const src = tab.dataset.imagen;
      pie.hidden = !src; // sin foto, el nombre ya va en el aviso
      if (!src) {
        foto.hidden = true; pendiente.hidden = false;
        nombrePendiente.textContent = tab.dataset.nombre;
        return;
      }
      pendiente.hidden = true; foto.hidden = false;
      if (foto.getAttribute('src') === src) return;
      foto.classList.add('cambiando');
      setTimeout(() => {
        foto.src = src; foto.alt = tab.dataset.alt || tab.dataset.nombre;
        foto.classList.toggle('flota__foto--estudio', tab.dataset.estudio === 'si');
        foto.classList.remove('cambiando');
      }, reducir ? 0 : 180);
    };
    pestanas.forEach((t, i) => {
      t.addEventListener('click', () => elegir(t));
      t.addEventListener('keydown', (e) => {
        const teclas = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (!(e.key in teclas)) return;
        e.preventDefault();
        elegir(pestanas[(i + teclas[e.key] + pestanas.length) % pestanas.length], true);
      });
    });
  }

  // Flota en celular: en lugar de las pestañas, las aeronaves se deslizan una a una con su foto y sus datos
  const flotaIn = $('.flota__in');
  if (flotaIn && pestanas.length) {
    const carrusel = document.createElement('div');
    carrusel.className = 'flota__carrusel';
    carrusel.innerHTML = '<ul class="flota__deslizable" id="flota-deslizable" aria-label="Aeronaves de la flota, desliza para ver las tres"></ul>' +
      '<div class="flota__controles"><button class="flota__btn" type="button" data-dir="-1" aria-label="Ver la aeronave anterior"><svg class="icono"><use href="#i-volver"/></svg></button>' +
      '<span class="flota__contador" aria-live="polite"></span>' +
      '<button class="flota__btn" type="button" data-dir="1" aria-label="Ver la aeronave siguiente"><svg class="icono"><use href="#i-flecha"/></svg></button></div>';
    const ul = $('ul', carrusel);
    pestanas.forEach(t => {
      const li = document.createElement('li');
      li.className = 'flota__slide';
      const img = document.createElement('img');
      img.src = t.dataset.imagen; img.alt = t.dataset.alt || t.dataset.nombre; img.loading = 'lazy';
      if (t.dataset.estudio === 'si') img.className = 'flota__foto--estudio';
      const h = document.createElement('h3'); h.textContent = t.dataset.nombre;
      const d = document.createElement('p'); d.textContent = $('small', t).textContent;
      li.append(img, h, d); ul.append(li);
    });
    flotaIn.append(carrusel);
    deslizable(ul, $('.flota__controles', carrusel));
  }

  // Widget «Ten a la mano»: la persona lo muestra u oculta cuando lo necesita (botón, X o Esc)
  const ayudaBtn = $('.ayuda__boton'), ayudaPanel = $('#ayuda-panel');
  if (ayudaBtn && ayudaPanel) {
    const fijar = (abrir, devolverFoco) => {
      ayudaBtn.setAttribute('aria-expanded', String(abrir));
      ayudaPanel.hidden = !abrir;
      if (abrir) $('#ayuda-titulo').focus({ preventScroll: true });
      else if (devolverFoco) ayudaBtn.focus({ preventScroll: true });
    };
    ayudaBtn.addEventListener('click', () => fijar(ayudaBtn.getAttribute('aria-expanded') !== 'true'));
    $('.ayuda__cerrar').addEventListener('click', () => fijar(false, true));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ayudaPanel.hidden) fijar(false, true); });
  }

  // Preguntas frecuentes
  $$('.acordeon__btn').forEach(b => b.addEventListener('click', () => {
    const abierto = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!abierto));
    document.getElementById(b.getAttribute('aria-controls')).hidden = abierto;
  }));

  // Cómo funciona, en celular: cada paso se colorea cuando pasa por el 65 % de la pantalla
  const celular = window.matchMedia('(max-width: 860px)');
  $$('.pasos').forEach(bloque => {
    const pasos = $$('.paso', bloque), progreso = $('.pasos__progreso', bloque);
    const marcar = () => {
      if (!celular.matches) return;
      const umbral = window.innerHeight * 0.65, arriba = bloque.getBoundingClientRect().top;
      pasos.forEach(p => p.classList.toggle('activo', p.getBoundingClientRect().top + 35 <= umbral));
      const ultimo = pasos[pasos.length - 1];
      const fin = ultimo.getBoundingClientRect().top + 35 - arriba;
      if (progreso) progreso.style.height = Math.max(0, Math.min(fin, umbral - arriba)) + 'px';
    };
    addEventListener('scroll', () => requestAnimationFrame(marcar), { passive: true });
    addEventListener('resize', marcar);
    marcar();
  });

  // Mapa de cobertura: todo el país en tono claro de la marca, operación más fuerte en rojo,
  // San Andrés y Providencia en recuadro, Cali con pin y pulso, rutas propias sólidas y con aliados punteadas.
  // ?zona=tumaco (u otra ciudad del mapa) resalta esa ruta y la nombra en el texto.
  const datos = window.MAPA_COLOMBIA, svg = $('#mapa-svg');
  if (datos && svg) {
    const NS = 'http://www.w3.org/2000/svg';
    const nodo = (t, a = {}) => { const n = document.createElementNS(NS, t); Object.entries(a).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
    const llave = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-');
    svg.setAttribute('viewBox', datos.viewBox.join(' '));
    const fuerte = { 'CHOCO': 1, 'CAUCA': 1, 'PUTUMAYO': 1, 'SANTANDER': 1, 'CAQUETA': 1, 'VALLE DEL CAUCA': 2, 'NARIÑO': 2, 'HUILA': 2, 'ARAUCA': 2 };
    const gDeptos = nodo('g');
    let k = 0;
    Object.entries(datos.deptos).forEach(([nombre, d]) => {
      const c = fuerte[nombre];
      const p = nodo('path', { d, class: 'depto' + (c === 1 ? ' depto--cob' : c === 2 ? ' depto--cob2' : '') });
      if (c) p.style.transitionDelay = (0.15 + 0.09 * k++) + 's';
      gDeptos.append(p);
    });
    // San Andrés y Providencia: recuadro en la esquina superior izquierda
    const [vx, vy] = datos.viewBox;
    const gInsular = nodo('g');
    gInsular.append(nodo('rect', { x: vx + 14, y: vy + 14, width: 74, height: 132, rx: 10, class: 'insular__caja' }));
    if (datos.insular) gInsular.append(nodo('path', { d: datos.insular, class: 'insular__isla', transform: `translate(${vx + 28} ${vy + 22}) scale(1.85)` }));
    const tIns = nodo('text', { class: 'etiqueta etiqueta--insular', x: vx + 14, y: vy + 166 });
    tIns.textContent = 'San Andrés y Providencia';
    const proyectar = (lon, lat) => [67.441663 * lon + 5510.949961, -67.743605 * lat + 905.537433];
    const [bx, by] = proyectar(-76.3819, 3.5427); // Cali
    // [nombre, lon, lat, lado de la etiqueta, secundaria (se oculta en celular), ajuste vertical, con aliados]
    const destinos = [
      ['Barranquilla', -74.7808, 10.8896, 'der', false, 0, true],
      ['Arauca', -70.7369, 7.0689, 'abajo', false, 0, true],
      ['Bucaramanga', -73.1848, 7.1265, 'der', false, 0, true],
      ['Medellín', -75.4231, 6.1645, 'der', false, 0, true],
      ['Bogotá', -74.1469, 4.7016, 'der', false, 0, true],
      ['Florencia', -75.5644, 1.5892, 'der'],
      ['Quibdó', -76.6412, 5.6908, 'der', true],
      ['Bahía Solano', -77.3947, 6.2029, 'izq', true],
      ['Buenaventura', -76.9898, 3.8196, 'izq'],
      ['Timbiquí', -77.6680, 2.7786, 'izq', false, -9],
      ['Guapi', -77.8980, 2.5701, 'izq', true, 15],
      ['Popayán', -76.6093, 2.4544, 'der', true],
      ['Neiva', -75.2940, 2.9502, 'der', true],
      ['Tumaco', -78.7492, 1.8144, 'abajo'],
      ['Pasto', -77.2909, 1.3967, 'der'],
      ['Puerto Asís', -76.5008, 0.5051, 'der', true]
    ];
    // Capitales departamentales que no son destino de una ruta: punto y nombre pequeño (el nombre solo en escritorio).
    // San Andrés queda en el recuadro insular. [nombre, lon, lat, lado de la etiqueta, ajuste vertical]
    const capitales = [
      ['Leticia', -69.9406, -4.2153, 'izq'], ['Cartagena', -75.4794, 10.391, 'izq'], ['Tunja', -73.3678, 5.5353, 'der'],
      ['Manizales', -75.5138, 5.0703, 'der'], ['Yopal', -72.3959, 5.3378, 'der'], ['Valledupar', -73.2532, 10.4631, 'der'],
      ['Montería', -75.8814, 8.7479, 'izq'], ['Inírida', -67.9239, 3.8653, 'izq'], ['San José del Guaviare', -72.6459, 2.5729, 'der'],
      ['Riohacha', -72.9072, 11.5444, 'der'], ['Santa Marta', -74.199, 11.2408, 'izq', -4], ['Villavicencio', -73.6266, 4.142, 'der'],
      ['Cúcuta', -72.5078, 7.8939, 'der'], ['Mocoa', -76.6463, 1.1528, 'der', 14], ['Armenia', -75.6811, 4.5339, 'izq', 5],
      ['Pereira', -75.6961, 4.8133, 'izq', -5], ['Sincelejo', -75.3978, 9.3047, 'izq'], ['Ibagué', -75.2322, 4.4389, 'der'],
      ['Mitú', -70.2346, 1.2536, 'der'], ['Puerto Carreño', -67.4859, 6.189, 'izq']
    ];
    const gCapitales = nodo('g'), gEtCapitales = nodo('g');
    capitales.forEach(([nombre, lon, lat, lado, ajuste = 0]) => {
      const [x, y] = proyectar(lon, lat);
      gCapitales.append(nodo('circle', { cx: x, cy: y, r: 4.5, class: 'capital' }));
      const t = nodo('text', { class: 'etiqueta etiqueta--capital', x: lado === 'izq' ? x - 9 : x + 9, y: y + 5 + ajuste, 'text-anchor': lado === 'izq' ? 'end' : 'start' });
      t.textContent = nombre;
      gEtCapitales.append(t);
    });
    const zona = llave(new URLSearchParams(location.search).get('zona') || '');
    const gRutas = nodo('g'), gNodos = nodo('g'), gEtiquetas = nodo('g');
    let zonaEncontrada = null;
    destinos.forEach(([nombre, lon, lat, lado, sec, ajuste = 0, aliado = false], i) => {
      const [x, y] = proyectar(lon, lat);
      const dx = x - bx, dy = y - by, largo = Math.hypot(dx, dy);
      let nx = -dy / largo, ny = dx / largo;
      if (ny > 0) { nx = -nx; ny = -ny; }
      const curva = Math.min(80, largo * .3);
      const cx = (bx + x) / 2 + nx * curva, cy = (by + y) / 2 + ny * curva;
      const esZona = zona && llave(nombre) === zona;
      if (esZona) zonaEncontrada = { nombre, aliado };
      const ruta = nodo('path', { d: `M${bx},${by} Q${cx},${cy} ${x},${y}`, class: 'ruta' + (aliado ? ' ruta--aliado' : '') + (esZona ? ' ruta--zona' : ''), pathLength: aliado ? '100' : '1' });
      ruta.style.transitionDelay = (0.7 + i * 0.08) + 's';
      if (nombre === 'Timbiquí') ruta.id = 'ruta-destacada';
      gRutas.append(ruta);
      gNodos.append(nodo('circle', { cx: x, cy: y, r: esZona ? 10 : 7, class: 'nodo' + (esZona ? ' nodo--zona' : '') }));
      const t = nodo('text', {
        class: 'etiqueta' + (sec && !esZona ? ' etiqueta--sec' : '') + (esZona ? ' etiqueta--zona' : ''),
        x: lado === 'izq' ? x - 13 : lado === 'abajo' ? x : x + 13,
        y: (lado === 'abajo' ? y + 30 : y + 6) + ajuste,
        'text-anchor': lado === 'izq' ? 'end' : lado === 'abajo' ? 'middle' : 'start'
      });
      t.textContent = nombre;
      gEtiquetas.append(t);
    });
    // Cali: pin destacado con un pulso sutil (la única base marcada)
    const gBase = nodo('g', { transform: `translate(${bx} ${by})` });
    gBase.append(
      nodo('circle', { r: 10, class: 'base-pulso movil-anim' }),
      nodo('path', { d: 'M0 0C-7-9-15-17-15-27a15 15 0 1 1 30 0C15-17 7-9 0 0z', class: 'base-pin' }),
      nodo('circle', { cy: -27, r: 5.5, fill: '#fff' })
    );
    const tBase = nodo('text', { class: 'etiqueta etiqueta--base', x: bx + 20, y: by + 8 });
    tBase.textContent = 'Cali';
    gEtiquetas.append(tBase, tIns);
    const avion = nodo('g', { class: 'avioncito movil-anim' });
    const forma = nodo('use', { href: '#i-avion', x: -17, y: -17, width: 34, height: 34, transform: 'rotate(90)' });
    const mov = nodo('animateMotion', { dur: '4.8s', repeatCount: 'indefinite', rotate: 'auto', calcMode: 'spline', keyTimes: '0;1', keyPoints: '0;1', keySplines: '.45 0 .25 1' });
    mov.append(nodo('mpath', { href: '#ruta-destacada' }));
    avion.append(forma, mov);
    svg.append(gDeptos, gInsular, gCapitales, gRutas, gNodos, gBase, avion, gEtCapitales, gEtiquetas);
    // Páginas de campaña por zona: el párrafo nombra la ciudad
    const parrafo = $('#cobertura-zona');
    if (parrafo && (zonaEncontrada || zona === 'cali')) {
      const n = zonaEncontrada ? zonaEncontrada.nombre : 'Cali';
      parrafo.innerHTML = zona === 'cali'
        ? 'Nuestra base principal está en <strong>Cali</strong>: desde aquí despegamos hacia toda Colombia.'
        : zonaEncontrada.aliado
          ? `Llegamos a <strong>${n}</strong> con nuestra red de aliados. Llámanos y coordinamos el traslado de tu paciente.`
          : `Volamos desde Cali hasta <strong>${n}</strong>. Llámanos y coordinamos el traslado de tu paciente.`;
      parrafo.hidden = false;
    }
  }

  // Compartido por los formularios de Contacto y PQRS: cada campo tiene su <p class="error" id="<id>-error">.
  const marcarCampo = (el, msg) => {
    const err = document.getElementById(el.id + '-error');
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.hidden = !msg; $('span', err).textContent = msg;
  };
  const correoValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Formulario de Contacto: llega a a.arango@pacificflycol.com (FormSubmit). Si falla, conserva lo digitado.
  const formContacto = $('#form-contacto');
  if (formContacto) {
    const ok = $('#contacto-ok'), fallo = $('#contacto-error'), enviar = $('button[type=submit]', formContacto);
    const digitos = (v) => v.replace(/\D/g, '').replace(/^57(?=\d{10}$)/, '');
    const reglas = {
      'c-nombre': (v) => v.trim() ? '' : 'Falta tu nombre, para saber a quién llamar.',
      'c-telefono': (v) => digitos(v).length === 10 ? '' : 'Revisa el teléfono: debe tener 10 dígitos, por ejemplo 301 337 3413.',
      'c-correo': (v) => !v.trim() || correoValido(v) ? '' : 'Revisa el correo: le falta la @ o el dominio. Si prefieres, déjalo vacío.',
      'c-motivo': (v) => v ? '' : 'Escoge el motivo, para que te contacte el área correcta.',
      'c-datos': (v, el) => el.checked ? '' : 'Para enviar tus datos necesitamos tu autorización.'
    };
    const revisar = (e) => {
      const r = reglas[e.target.id];
      if (r && e.target.getAttribute('aria-invalid') === 'true' && !r(e.target.value, e.target)) marcarCampo(e.target, '');
    };
    formContacto.addEventListener('input', revisar);
    formContacto.addEventListener('change', revisar);
    formContacto.addEventListener('submit', async (e) => {
      e.preventDefault();
      let primero = null;
      Object.entries(reglas).forEach(([id, r]) => {
        const el = document.getElementById(id), msg = r(el.value, el);
        marcarCampo(el, msg);
        if (msg && !primero) primero = el;
      });
      if (primero) { primero.focus(); return; }
      if ($('input[name=_honey]', formContacto).value) return;
      const tel = '+57 ' + digitos($('#c-telefono').value).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      const motivo = $('#c-motivo').value;
      const datos = {
        _subject: `Contacto desde la página web: ${motivo}`,
        _template: 'table',
        'Nombre': $('#c-nombre').value.trim(),
        'Teléfono': tel,
        'Correo': $('#c-correo').value.trim() || '(no lo dejó)',
        'Motivo': motivo,
        'Mensaje': $('#c-mensaje').value.trim() || '(sin mensaje)',
        'Autorizó el tratamiento de datos': 'Sí'
      };
      enviar.disabled = true; enviar.firstElementChild.textContent = 'Enviando…';
      fallo.hidden = true;
      try {
        const r = await fetch(formContacto.dataset.envio, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos)
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || r.status);
        $('.contacto-tel', ok).textContent = tel;
        formContacto.hidden = true; ok.hidden = false; ok.focus();
      } catch (err) {
        fallo.hidden = false; fallo.focus();
      } finally {
        enviar.disabled = false; enviar.firstElementChild.textContent = 'Solicitar que me contacten';
      }
    });
  }

  // Formulario PQRS: se radica en el ERP (data-api) con FormData, sin cookies. El éxito solo se muestra
  // con un 201 que traiga radicado; cualquier otra respuesta deja el formulario con lo digitado.
  const formPqrs = $('#form-pqrs');
  if (formPqrs) {
    const cargada = performance.now(); // para tiempo_llenado: ms desde que cargó la página, sin depender del reloj del equipo
    const ok = $('#pqrs-ok'), fallo = $('#pqrs-error'), limite = $('#pqrs-limite'), revisarAviso = $('#pqrs-revisar');
    const enviar = $('button[type=submit]', formPqrs), rotulo = enviar.firstElementChild.textContent;
    const inputArchivos = $('#p-adjuntos'), lista = $('#p-adjuntos-lista');
    const descripcion = $('#p-descripcion'), contador = $('#p-descripcion-contador');
    const MB = 1024 * 1024, MAX_ARCHIVOS = 5, MAX_ARCHIVO = 5 * MB, MAX_TOTAL = 10 * MB;
    const EXTENSIONES = ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx'];
    const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const peso = (b) => b < MB ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / MB).toFixed(1).replace('.', ',')} MB`;
    const extension = (n) => (n.split('.').pop() || '').toLowerCase();
    let archivos = [];

    const pintarContador = () => { contador.textContent = `${miles(descripcion.value.length)} de 5.000 caracteres`; };
    descripcion.addEventListener('input', pintarContador); pintarContador();

    // Adjuntos: la lista vive en `archivos`; el input solo sirve para elegir (se vacía tras cada elección)
    const reglaArchivos = () => {
      if (archivos.length > MAX_ARCHIVOS) return `Puedes adjuntar hasta ${MAX_ARCHIVOS} archivos. Quita ${archivos.length - MAX_ARCHIVOS}.`;
      const malo = archivos.find(f => !EXTENSIONES.includes(extension(f.name)));
      if (malo) return `«${malo.name}» no es un formato permitido. Sube PDF, JPG, PNG, Word (.docx) o Excel (.xlsx).`;
      const grande = archivos.find(f => f.size > MAX_ARCHIVO);
      if (grande) return `«${grande.name}» pesa ${peso(grande.size)}: cada archivo puede pesar hasta 5 MB.`;
      const total = archivos.reduce((t, f) => t + f.size, 0);
      if (total > MAX_TOTAL) return `Los archivos suman ${peso(total)}: entre todos pueden pesar hasta 10 MB.`;
      return '';
    };
    const pintarArchivos = () => {
      lista.replaceChildren(...archivos.map((f, i) => {
        const li = document.createElement('li');
        const nombre = document.createElement('span'); nombre.className = 'archivos__nombre'; nombre.textContent = f.name;
        const tam = document.createElement('span'); tam.className = 'archivos__peso'; tam.textContent = peso(f.size);
        const quitar = document.createElement('button');
        quitar.type = 'button'; quitar.className = 'archivos__quitar'; quitar.textContent = 'Quitar';
        quitar.setAttribute('aria-label', `Quitar ${f.name}`);
        quitar.addEventListener('click', () => {
          archivos.splice(i, 1); pintarArchivos();
          if (inputArchivos.getAttribute('aria-invalid') === 'true') marcarCampo(inputArchivos, reglaArchivos());
          const botones = $$('.archivos__quitar', lista);
          (botones[Math.min(i, botones.length - 1)] || inputArchivos).focus();
        });
        li.append(nombre, tam, quitar);
        return li;
      }));
      lista.hidden = !archivos.length;
    };
    inputArchivos.addEventListener('change', () => {
      const nuevos = [...inputArchivos.files].filter(f => !archivos.some(a => a.name === f.name && a.size === f.size && a.lastModified === f.lastModified));
      inputArchivos.value = '';
      // Se rechazan de una vez los que no sirven, para que no queden en la lista
      const rechazos = [];
      nuevos.forEach(f => {
        const total = archivos.reduce((t, a) => t + a.size, 0);
        if (!EXTENSIONES.includes(extension(f.name))) rechazos.push(`«${f.name}» no es un formato permitido. Sube PDF, JPG, PNG, Word (.docx) o Excel (.xlsx).`);
        else if (f.size > MAX_ARCHIVO) rechazos.push(`«${f.name}» pesa ${peso(f.size)}: cada archivo puede pesar hasta 5 MB.`);
        else if (archivos.length >= MAX_ARCHIVOS) rechazos.push(`«${f.name}» no se agregó: puedes adjuntar hasta ${MAX_ARCHIVOS} archivos.`);
        else if (total + f.size > MAX_TOTAL) rechazos.push(`«${f.name}» no se agregó: entre todos los archivos pueden pesar hasta 10 MB.`);
        else archivos.push(f);
      });
      pintarArchivos();
      marcarCampo(inputArchivos, rechazos.join(' ') || reglaArchivos());
    });

    const valor = (id) => $('#' + id).value.trim();
    const reglas = {
      'p-tipo': (v) => v ? '' : 'Escoge si es una petición, una queja, un reclamo o una sugerencia.',
      'p-servicio': (v) => v ? '' : 'Escoge el servicio con el que se relaciona tu solicitud.',
      'p-nombre': (v) => v.trim() ? '' : 'Falta tu nombre completo.',
      'p-tipo-documento': (v) => v || !valor('p-numero-documento') ? '' : 'Escoge el tipo del documento que escribiste.',
      'p-numero-documento': (v) => v.trim() || !$('#p-tipo-documento').value ? '' : 'Escribe el número del documento que escogiste, o deja el tipo en «Selecciona».',
      'p-email': (v) => !v.trim() ? 'Falta tu correo: ahí te enviaremos la respuesta.' : correoValido(v) ? '' : 'Revisa el correo: le falta la @ o el dominio.',
      'p-telefono': (v) => !v.trim() ? 'Falta un teléfono de contacto.' : /^[\d\s()+.-]+$/.test(v.trim()) && v.replace(/\D/g, '').length >= 7 ? '' : 'Revisa el teléfono: escribe solo números, con el indicativo si es de otro país.',
      'p-asunto': (v) => v.trim() ? '' : 'Escribe el asunto, en pocas palabras.',
      'p-descripcion': (v) => !v.trim() ? 'Cuéntanos tu solicitud.' : v.trim().length < 20 ? `Cuéntanos un poco más: la descripción debe tener al menos 20 caracteres (va en ${v.trim().length}).` : '',
      'p-adjuntos': () => reglaArchivos(),
      'p-autorizacion': (v, el) => el.checked ? '' : 'Para radicar tu solicitud necesitamos tu autorización para tratar tus datos.'
    };
    // La pareja tipo/número de documento se revisa junta: corregir uno puede limpiar el error del otro
    const pareja = { 'p-tipo-documento': 'p-numero-documento', 'p-numero-documento': 'p-tipo-documento' };
    const revisar = (e) => {
      const id = e.target.id;
      [id, pareja[id]].filter(Boolean).forEach(i => {
        const el = document.getElementById(i), r = reglas[i];
        if (r && i !== 'p-adjuntos' && el.getAttribute('aria-invalid') === 'true' && !r(el.value, el)) marcarCampo(el, '');
      });
    };
    formPqrs.addEventListener('input', revisar);
    formPqrs.addEventListener('change', revisar);

    const ocultarAvisos = () => { [fallo, limite, revisarAviso].forEach(a => { a.hidden = true; }); };
    const mostrar = (aviso) => { aviso.hidden = false; aviso.focus(); };

    // 422: cada mensaje junto a su campo (adjuntos.0, adjuntos.1… van al campo de adjuntos)
    const pintarErroresServidor = (errores) => {
      const porCampo = new Map(), sueltos = [];
      Object.entries(errores).forEach(([clave, msgs]) => {
        const texto = [].concat(msgs).filter(m => typeof m === 'string').join(' ');
        if (!texto) return;
        const base = clave.split('.')[0].replace(/\[\]$/, '');
        const el = base === 'adjuntos' ? inputArchivos : formPqrs.elements[base];
        if (el && el.id && document.getElementById(el.id + '-error')) {
          porCampo.set(el, [porCampo.get(el), texto].filter(Boolean).join(' '));
        } else sueltos.push(texto);
      });
      porCampo.forEach((texto, el) => marcarCampo(el, texto));
      const orden = Object.keys(reglas).map(id => document.getElementById(id)).filter(el => porCampo.has(el));
      if (sueltos.length) {
        revisarAviso.textContent = `No pudimos radicar tu solicitud: ${sueltos.join(' ')}`;
        revisarAviso.hidden = false;
      }
      if (orden.length) orden[0].focus();
      else if (sueltos.length) revisarAviso.focus();
      else mostrar(fallo);
    };

    formPqrs.addEventListener('submit', async (e) => {
      e.preventDefault();
      ocultarAvisos();
      let primero = null;
      Object.entries(reglas).forEach(([id, r]) => {
        const el = document.getElementById(id), msg = r(el.value, el);
        marcarCampo(el, msg);
        if (msg && !primero) primero = el;
      });
      if (primero) { primero.focus(); return; }

      formPqrs.elements.tiempo_llenado.value = String(Math.round(performance.now() - cargada));
      const datos = new FormData(formPqrs);
      datos.delete('adjuntos[]');
      archivos.forEach(f => datos.append('adjuntos[]', f, f.name));

      enviar.disabled = true; enviar.firstElementChild.textContent = 'Enviando…';
      try {
        let r;
        try {
          r = await fetch(formPqrs.dataset.api, { method: 'POST', body: datos, headers: { Accept: 'application/json' } });
        } catch (err) { mostrar(fallo); return; }
        const j = await r.json().catch(() => null);
        const radicado = j && j.success === true && j.data && typeof j.data.radicado === 'string' ? j.data.radicado.trim() : '';
        if (r.status === 201 && radicado) {
          $('#pqrs-radicado').textContent = radicado;
          const recibido = j.data.recibido_texto;
          if (typeof recibido === 'string' && recibido.trim()) {
            $('#pqrs-recibido-texto').textContent = recibido.trim();
            $('#pqrs-recibido').hidden = false;
          }
          const copiar = $('#pqrs-copiar');
          if (navigator.clipboard && window.isSecureContext) {
            copiar.hidden = false;
            copiar.onclick = () => navigator.clipboard.writeText(radicado).then(() => { copiar.textContent = 'Copiado'; }, () => {});
          }
          formPqrs.hidden = true; ok.hidden = false; ok.focus();
          ok.scrollIntoView({ block: 'center', behavior: reducir ? 'auto' : 'smooth' });
        } else if (r.status === 422 && j && j.errors && typeof j.errors === 'object') {
          pintarErroresServidor(j.errors);
        } else if (r.status === 429) {
          mostrar(limite);
        } else {
          mostrar(fallo);
        }
      } finally {
        enviar.disabled = false; enviar.firstElementChild.textContent = rotulo;
      }
    });
  }

  if (reducir) $$('svg').forEach(s => s.pauseAnimations && s.pauseAnimations());
})();
