let _premioPendienteNivel = null;
let _premioPendienteIndex = null;
let _premioPendienteCosto = null;

function renderizarBattlepass() {
// Leer puntos de XP y nenurios

    const xpMono      = Storage.load('xp_mono') || 0;
      const xpOso       = Storage.load('xp_oso')  || 0;
      const xpTotal     = xpMono + xpOso;
      const disponibles = getNenuriosDisponibles();
      const canjeados   = getCanjeados();

    // Calcular nivel actual basado en XP
    let nivelActual = 0;
      NIVELES_BATTLE_PASS.forEach(nivel => {
          if (xpTotal >= nivel.xpRequerido) nivelActual = nivel.nivel;
      });

    // Actualizar contadores
      document.getElementById('bp-xp-mono').textContent      = xpMono;
      document.getElementById('bp-xp-oso').textContent       = xpOso;
      document.getElementById('bp-xp-total').textContent     = xpTotal;
      document.getElementById('bp-puntos-total').textContent = disponibles;
      document.getElementById('bp-nivel-badge').textContent  = nivelActual === 0
          ? 'Sin nivel'
          : NIVELES_BATTLE_PASS[nivelActual - 1].icono + ' ' + NIVELES_BATTLE_PASS[nivelActual - 1].nombre;

     // Construir tarjetas de niveles
    let html = '';
      NIVELES_BATTLE_PASS.forEach((nivel, index) => {
          const desbloqueado = xpTotal >= nivel.xpRequerido;
          const esSiguiente  = !desbloqueado && (index === 0 || xpTotal >= NIVELES_BATTLE_PASS[index - 1].xpRequerido);

          const xpAnterior  = index === 0 ? 0 : NIVELES_BATTLE_PASS[index - 1].xpRequerido;
          const xpEsteNivel = nivel.xpRequerido - xpAnterior;
          const xpProgreso  = Math.min(Math.max(xpTotal - xpAnterior, 0), xpEsteNivel);
          const porcentaje  = Math.round((xpProgreso / xpEsteNivel) * 100);

          const estadoClass = desbloqueado ? 'desbloqueado' : (esSiguiente ? 'siguiente' : 'bloqueado');

          const premiosHtml = nivel.premios.map((p, i) => {
              const yaCanjeado  = canjeados['n' + nivel.nivel + '_p' + i];
              const puedePagar  = disponibles >= p.costo;

              let boton = '';
              if (desbloqueado) {
                  if (yaCanjeado) {
                      boton = `<span class="bp-premio-canjeado">✅</span>`;
                  } else {
                      boton = `<button class="bp-btn-canjear" onclick="canjearPremio(${nivel.nivel}, ${i}, ${p.costo}, '${p.nombre}')" ${!puedePagar ? 'disabled' : ''}>Canjear</button>`;
                  }
              }

              return `
                  <div class="bp-premio">
                      <span class="bp-premio-emoji">${p.emoji}</span>
                      <span class="bp-premio-nombre">${p.nombre}</span>
                      ${yaCanjeado ? '' : `<span class="bp-premio-costo">⭐ ${p.costo}</span>`}
                      ${boton}
                  </div>
              `;
          }).join('');

          html += `
              <div class="bp-nivel-card ${estadoClass}">
                  <div class="bp-nivel-card-header">
                      <span class="bp-nivel-icono">${nivel.icono}</span>
                      <div class="bp-nivel-info">
                          <span class="bp-nivel-num">Nivel ${nivel.nivel}</span>
                          <span class="bp-nivel-nombre">${nivel.nombre}</span>
                      </div>
                      <span class="bp-nivel-xp-req">⭐ ${nivel.xpRequerido}</span>
                  </div>
                  <div class="bp-barra-track">
                      <div class="bp-barra-fill" style="width: ${desbloqueado ? 100 : porcentaje}%"></div>
                  </div>
                  <div class="bp-nivel-progreso-txt">
                      ${desbloqueado ? '✅ Desbloqueado' : xpTotal + ' / ' + nivel.xpRequerido + ' XP'}
                  </div>
                  <div class="bp-premios-lista">
                      ${premiosHtml}
                  </div>
              </div>
          `;
      });

      document.getElementById('bp-niveles-container').innerHTML = html;
}

function getNenuriosDisponibles() {
    const puntosMono = Storage.load('puntos_mono') || 0;
    const puntosOso = Storage.load('puntos_oso') || 0;
    const gastados   = Storage.load('nenurios_gastados') || 0;
    return (puntosMono + puntosOso) - gastados;
}

function getCanjeados(){
    return Storage.load('bp_canjeados') || {};
}

function canjearPremio(nivelNum, premioIndex, costo, nombre) {
      _premioPendienteNivel = nivelNum;
      _premioPendienteIndex = premioIndex;
      _premioPendienteCosto = costo;

      document.getElementById('modal-canjear-texto').textContent =
          '¿Quieres canjear "' + nombre + '" por ⭐ ' + costo + ' Nenurios?';
      document.getElementById('modal-canjear').classList.remove('hidden');
  }

  function cerrarModalCanjear() {
      document.getElementById('modal-canjear').classList.add('hidden');
  }

  function confirmarCanjear() {
      const disponibles = getNenuriosDisponibles();
      if (disponibles < _premioPendienteCosto) return;

      const gastados = Storage.load('nenurios_gastados') || 0;
      Storage.save('nenurios_gastados', gastados + _premioPendienteCosto);

      const canjeados = getCanjeados();
      canjeados['n' + _premioPendienteNivel + '_p' + _premioPendienteIndex] = true;
      Storage.save('bp_canjeados', canjeados);

      cerrarModalCanjear();
      renderizarBattlepass();
  }