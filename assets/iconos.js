// Íconos compartidos por todas las páginas. Se insertan una sola vez al cargar y se usan con
// <svg class="icono"><use href="#i-nombre"/></svg>. Van en JavaScript y no en un .svg externo
// porque Chrome bloquea las referencias a archivos .svg cuando la página se abre con doble clic.
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-tel" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path d="M3.5 20.5l1.3-4.1A8.6 8.6 0 1 1 8 19.3z"/><path d="M9.1 8.3c.3-.6.8-.6 1.1-.1l.8 1.7c.1.3 0 .6-.2.8l-.6.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.6c.2-.2.5-.3.8-.2l1.7.8c.5.3.5.8-.1 1.1-1.6.9-3.6.2-5.3-1.5S8.2 9.9 9.1 8.3z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-lista" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><polyline points="9 13 11 15 15 11"/></symbol>
<symbol id="i-cerrar" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></symbol>
<symbol id="i-check-circulo" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></symbol>
<symbol id="i-rayo" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></symbol>
<symbol id="i-reloj" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
<symbol id="i-pulso" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></symbol>
<symbol id="i-monitor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="6 10 9 10 10.5 7 13 13 14.5 10 18 10"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></symbol>
<symbol id="i-estetoscopio" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 12 0v-4"/><circle cx="20" cy="10" r="2"/></symbol>
<symbol id="i-escudo" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></symbol>
<symbol id="i-aislado" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="15"/><line x1="8.5" y1="11.5" x2="15.5" y2="11.5"/></symbol>
<symbol id="i-curita" viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><rect x="1.5" y="7.5" width="21" height="9" rx="4.5"/><rect x="8" y="7.5" width="8" height="9"/><circle cx="10.5" cy="10.5" r=".4" fill="currentColor"/><circle cx="13.5" cy="10.5" r=".4" fill="currentColor"/><circle cx="10.5" cy="13.5" r=".4" fill="currentColor"/><circle cx="13.5" cy="13.5" r=".4" fill="currentColor"/></g></symbol>
<symbol id="i-bebe" viewBox="0 0 24 24"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></symbol>
<symbol id="i-cerebro" viewBox="0 0 24 24"><path d="M12.5 3a7.5 7.5 0 0 0-7.4 8.7L4 15.5l2 .5v2.5a2 2 0 0 0 2 2h2V22h7v-4.3A7.5 7.5 0 0 0 12.5 3z"/><polyline points="7.5 11.5 9.5 11.5 10.6 9 12.4 14 13.6 11.5 16 11.5"/></symbol>
<symbol id="i-llama" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></symbol>
<symbol id="i-binomio" viewBox="0 0 24 24"><circle cx="9" cy="5" r="2.6"/><path d="M4 21v-3.5A4.5 4.5 0 0 1 8.5 13h1a4.5 4.5 0 0 1 4.5 4.5V21"/><circle cx="17.5" cy="11.5" r="2"/><path d="M14.8 21v-1.6a2.7 2.7 0 0 1 5.4 0V21"/></symbol>
<symbol id="i-mayor" viewBox="0 0 24 24"><circle cx="10" cy="4" r="2.2"/><path d="M10 7.5c-1.6 0-2.6 1.2-2.8 2.7L6.5 15.5H9l.6 5.5"/><path d="M10.2 7.6c1.5.1 2.3 1.2 2.5 2.5l.5 3.2 2.3 1.2"/><path d="M15.5 14.5V21"/><path d="M15.5 14.5c0-1 .7-1.5 1.5-1.5"/></symbol>
<symbol id="i-pulmones" viewBox="0 0 24 24"><path d="M12 3v8"/><path d="M12 11c-1.2 0-2 .8-3 1.6"/><path d="M12 11c1.2 0 2 .8 3 1.6"/><path d="M8.6 6.2C6 6.6 4 9.8 4 14.6c0 2.8 1.2 4.9 3.3 4.9 2 0 2.7-1.6 2.7-3.6V8.2c0-1.2-.6-2.1-1.4-2z"/><path d="M15.4 6.2c2.6.4 4.6 3.6 4.6 8.4 0 2.8-1.2 4.9-3.3 4.9-2 0-2.7-1.6-2.7-3.6V8.2c0-1.2.6-2.1 1.4-2z"/></symbol>
<symbol id="i-avion" viewBox="0 0 24 24"><path d="M12 2.2c.8 0 1.4 1 1.4 2.4v5.1l7.3 4.2c.4.2.6.6.6 1v1.1l-7.9-2.4v4.6l2 1.6v1.2l-3.4-.9-3.4.9v-1.2l2-1.6v-4.6l-7.9 2.4V15c0-.4.2-.8.6-1l7.3-4.2V4.6c0-1.4.6-2.4 1.4-2.4z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-cama" viewBox="0 0 24 24"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></symbol>
<symbol id="i-ruta" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></symbol>
<symbol id="i-documento" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></symbol>
<symbol id="i-caja" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-calendario" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 15.5 11 17.5 15 13.5"/></symbol>
<symbol id="i-sonrisa" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></symbol>
<symbol id="i-abajo" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></symbol>
<symbol id="i-arriba" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></symbol>
<symbol id="i-flecha" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
<symbol id="i-volver" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></symbol>
<symbol id="i-correo" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></symbol>
<symbol id="i-fb" viewBox="0 0 24 24"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.2V2.2h-3c-3.3 0-4.1 2.4-4.1 4v2.3H8v3.7h2.1V22h3.9v-9.8h2.8l.4-3.7z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-ig" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><line x1="17.4" y1="6.6" x2="17.41" y2="6.6"/></symbol>
<symbol id="i-alerta" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></symbol>
</svg>`);
