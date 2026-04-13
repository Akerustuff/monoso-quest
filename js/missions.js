// js/missions.js

let tabActual = 'diarias';
let gruposAbiertos = new Set();

 function fechaHoy(){
    return new Date().toISOString().slice(0,10); //Crea una fecha, la transforma en String y regresa solo los 10 primeros caracteres "2026-04-01"
  }

function getKeyDiarias(){
    return 'estado_diarias_' + fechaHoy();
}

function getKeyDiariasPersonales() {
    return 'estado_diarias_pers_' + Players.current + '_' + fechaHoy();
}

function getKeySemanales(){
    const hoy = new Date();
    const diasDesdeMonday = (hoy.getDay() + 6) % 7;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diasDesdeMonday);
    return 'estado_semanales_' + lunes.toISOString().slice(0, 10);
}

function getKeyMensuales() {
    return 'estado_mensuales_' + fechaHoy().slice(0, 7);
}

function getKeyMensualesPersonales() {
    return 'estado_mensuales_pers_' + Players.current + '_' + fechaHoy().slice(0, 7);
}

function cargarEstado(key){
    return Storage.load(key) || {};
}

function guardarEstado(key, estado) {
    Storage.save(key, estado);
}

function cambiarTab(tab) {
    tabActual = tab;

    //Quitar "active de todos los tabs"
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Poner "active" al tab presionado
    // Los botones dicen onclick="cambiarTab('diarias')" etc.
    // Podemos identificar el botón correcto buscando cuál contiene el texto del tab
    const textos = { diarias: 'Diarias', semanales: 'Semanales', mensuales: 'Mensuales' };
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent === textos[tab]) {
            btn.classList.add('active');
        }
    })

    renderizarMisiones();

}

function buildMisionCard(mision, key, estado) {
    const done = estado[mision.id] ? 'done' : '';
    const checkmark = estado[mision.id] ? '✓' : '';
    return `
        <div class="mission-card ${done}" data-id=${mision.id} data-key="${key}" data-puntos="${mision.puntos}">
            <div class="mission-info">
    <span class="mission-nombre">${mision.nombre}</span>
                  <span class="mission-desc">${mision.desc}</span>
              </div>
              <div class="mission-puntos">+${mision.puntos}</div>
              <div class="mission-check" onclick="completarMision(this)">${checkmark}</div>
          </div>
      `;
}

function buildGrupoCard(grupo, key, estado) {
    const total = grupo.subtareas.length;
    const hechas = grupo.subtareas.filter(s => estado[s.id]).length;
    const completo = hechas === total;

    const subtareasHtml = grupo.subtareas.map(subtarea => {
        const done = estado[subtarea.id] ? 'done' : '';
        const checkmark = estado[subtarea.id] ? '✓' : '';
        return `
              <div class="mission-card subtarea-card ${done}" data-id="${subtarea.id}" data-key="${key}" data-puntos="${subtarea.puntos}">
                  <div class="mission-info">
                      <span class="mission-nombre">${subtarea.nombre}</span>
                      <span class="mission-desc">${subtarea.desc}</span>
                  </div>
                  <div class="mission-puntos">+${subtarea.puntos}</div>
                  <div class="mission-check" onclick="completarMision(this)">${checkmark}</div>
              </div>
          `;
    }).join('');
    return `
          <div class="grupo-card ${completo ? 'grupo-completo' : ''}"
                data-grupo-id="${grupo.id}"
                data-buff="${grupo.buff}"
                data-puntos-buff="${grupo.puntosBuffCompleto}">
                <div class="grupo-header" onclick="toggleGrupo(this.closest('.grupo-card'))">
                    <div class="grupo-info">
                      <span class="grupo-nombre">${grupo.nombre}</span>
                      <span class="grupo-desc">${grupo.desc}</span>
                    </div>
                    <span class="grupo-progreso">${hechas}/${total}</span>
                    <span class="grupo-chevron">›</span>
                </div>
                <div class="grupo-buff ${completo ? 'buff-earned' : ''}">
                    <span class ="grupo-buff-texto">✨ ${grupo.buff}</span>
                </div>
                <div class="grupo-subtareas">
                  ${subtareasHtml}
                 </div>
          </div>
      `;

}

function renderizarMisiones() {
    const contenedor = document.getElementById('missions-container');
    let html = '';

    if (tabActual === 'diarias') {
        const keyPersonales = getKeyDiariasPersonales();
        const keyHogar = getKeyDiarias();
        const estadoPersonales = cargarEstado(keyPersonales);
        const estadoHogar = cargarEstado(keyHogar);

        html += '<h3>Personales</h3>';
        MISIONES_DIARIAS_PERSONALES.forEach(mision => {
            html += buildMisionCard(mision, keyPersonales, estadoPersonales);
        });

        html += '<h3>Hogar</h3>';
        MISIONES_DIARIAS_HOGAR.forEach(mision => {
            html += buildMisionCard(mision, keyHogar, estadoHogar);
        });
    }

    if (tabActual === 'semanales') {
        const key = getKeySemanales();
        const estado = cargarEstado(key);
        const jugador = Players.current;

        html += '<h3>Grupales</h3>';
        MISIONES_SEMANALES_GRUPALES.forEach(grupo => {
            html += buildGrupoCard(grupo, key, estado);
        });

        html += '<h3>Sueltas</h3>';
        MISIONES_SEMANALES_SUELTAS
            .filter(m => m.jugador === null || m.jugador === jugador)
            .forEach(mision => {
                html += buildMisionCard(mision, key, estado);
            });
    }

    if (tabActual === 'mensuales') {
        const keyHogar = getKeyMensuales();
        const keyPersonales = getKeyMensualesPersonales();
        const estadoHogar = cargarEstado(keyHogar);
        const estadoPersonales = cargarEstado(keyPersonales);
        const jugador = Players.current;

        html += '<h3>Hogar</h3>';
        MISIONES_MENSUALES
            .filter(m => m.jugador === null)
            .forEach(mision => {
                html += buildMisionCard(mision, keyHogar, estadoHogar);
            });

        html += '<h3>Personales</h3>';
        MISIONES_MENSUALES
            .filter(m => m.jugador === jugador)
            .forEach(mision => {
                html += buildMisionCard(mision, keyPersonales, estadoPersonales);
            });

        html += '<button class="btn-reset-misiones" onclick="confirmarResetMisiones()">↺ Reiniciar misiones y puntos</button>';
    }

    contenedor.innerHTML = html;

    gruposAbiertos.forEach(function(grupoId) {
        const card = contenedor.querySelector(`[data-grupo-id="${grupoId}"]`);
        if (card) card.classList.add('abierto');
    });

    actualizarDisplayPuntos();
  }

  function completarMision(checkbox) {
    const card = checkbox.closest('.mission-card');
    const id = card.dataset.id;
    const key = card.dataset.key;
    
    card.classList.toggle('done');
    checkbox.textContent = card.classList.contains('done') ? '✓' : '';

    const estado = cargarEstado(key);
    const puntos = parseInt(card.dataset.puntos);

    const esSubtarea = card.classList.contains('subtarea-card');

    if (card.classList.contains('done')) {
        estado[id] = esSubtarea ? Players.current : true;
        guardarEstado(key, estado);
        sumarPuntos(puntos);
        mostrarToastXP(puntos);
    } else {
        delete estado[id];
        guardarEstado(key, estado);
        sumarPuntos(-puntos);
    }

    if (esSubtarea) {
      actualizarGrupo(card);
    }
    actualizarDisplayPuntos();
  }

 function toggleGrupo(grupoCard) {
      grupoCard.classList.toggle('abierto');
      const grupoId = grupoCard.dataset.grupoId;
      if (grupoCard.classList.contains('abierto')) {
          gruposAbiertos.add(grupoId);
      } else {
          gruposAbiertos.delete(grupoId);
      }
  }

  function actualizarGrupo(subtareaCard) {
      const grupoCard = subtareaCard.closest('.grupo-card');
      if (!grupoCard) return;

      const key = subtareaCard.dataset.key;
      const estado = cargarEstado(key);
      const subtareaCards = grupoCard.querySelectorAll('.subtarea-card');
      const total = subtareaCards.length;
      const hechas = grupoCard.querySelectorAll('.subtarea-card.done').length;

      grupoCard.querySelector('.grupo-progreso').textContent = `${hechas}/${total}`;

      const completo = hechas === total;
      grupoCard.classList.toggle('grupo-completo', completo);
      grupoCard.querySelector('.grupo-buff').classList.toggle('buff-earned', completo);

      if (completo) {
        const jugadoresParticipantes = new Set();
        subtareaCards.forEach(function(card) {
            const jugador = estado[card.dataset.id];
            if (jugador) jugadoresParticipantes.add(jugador);
        });

        const buff = grupoCard.dataset.buff;
        const puntosBuff = parseInt(grupoCard.dataset.puntosBuff);

        if (jugadoresParticipantes.size > 1) {
            sumarPuntosAmbosJugadores(puntosBuff);
        } else {
            const jugador = [...jugadoresParticipantes][0] || Players.current;
            sumarPuntosJugador(jugador, puntosBuff);
        }
        mostrarModalBuff(buff, puntosBuff);
      }
  }

  function obtenerPuntos() {
    return Storage.load('puntos_' + Players.current) || 0;
  }

  function sumarPuntos(cantidad) {
    const puntosActuales = obtenerPuntos();
    Storage.save('puntos_' + Players.current, puntosActuales + cantidad);

    const xpActual = Storage.load('xp_' + Players.current) || 0;
    Storage.save('xp_' + Players.current, xpActual + cantidad);
  }

  function sumarPuntosJugador(jugador, cantidad) {
    const puntos = Storage.load('puntos_' + jugador) || 0;
    Storage.save('puntos_' + jugador, puntos + cantidad);
    const xp = Storage.load('xp_' + jugador) || 0;
    Storage.save('xp_' + jugador, xp + cantidad);
  }

  function sumarPuntosAmbosJugadores(total) {
    const mitad = Math.ceil(total / 2);
    sumarPuntosJugador('mono', mitad);
    sumarPuntosJugador('oso', mitad);
  }

  function actualizarDisplayPuntos() {
    const display = document.getElementById('puntos-display');
    display.textContent = '⭐' + obtenerPuntos() + ' Nenurios';
  }

  function mostrarModalBuff(buff, puntos) {
    document.getElementById('modal-buff-nombre').textContent = buff;
    document.getElementById('modal-buff-puntos').textContent = puntos;
    document.getElementById('modal-buff').classList.remove('hidden');
  }

  function cerrarModalBuff() {
    document.getElementById('modal-buff').classList.add('hidden');
  }

  function confirmarResetMisiones() {
    document.getElementById('modal-reset-misiones').classList.remove('hidden');
  }

  function cerrarModalResetMisiones() {
    document.getElementById('modal-reset-misiones').classList.add('hidden');
  }

  function ejecutarResetMisiones() {
    Storage.save(getKeyDiarias(), {});
    Storage.save('estado_diarias_pers_mono_' + fechaHoy(), {});
    Storage.save('estado_diarias_pers_oso_' + fechaHoy(), {});
    Storage.save(getKeySemanales(), {});
    Storage.save(getKeyMensuales(), {});
    Storage.save('estado_mensuales_pers_mono_' + fechaHoy().slice(0, 7), {});
    Storage.save('estado_mensuales_pers_oso_' + fechaHoy().slice(0, 7), {});
    Storage.save('puntos_mono', 0);
    Storage.save('puntos_oso', 0);
    Storage.save('xp_mono', 0);
    Storage.save('xp_oso', 0);
    cerrarModalResetMisiones();
    renderizarMisiones();
  }
  
   let toastTimer = null;

  function mostrarToastXP(puntos) {
    const toast = document.getElementById('toast-xp');
    document.getElementById('toast-xp-texto').textContent = '+' + puntos + ' Nenurios';
    toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.add('hidden');
    }, 2000);
  }