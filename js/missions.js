// js/missions.js

let tabActual = 'diarias';

 function fechaHoy(){
    return new Date().toISOString().slice(0,10); //Crea una fecha, la transforma en String y regresa solo los 10 primeros caracteres "2026-04-01"
  }

function getKeyDiarias(){
    return 'estado_diarias_' + fechaHoy();
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
        const key = getKeyDiarias();
        const estado = cargarEstado(key);    

        html+= '<h3>Personales</h3>';
        MISIONES_DIARIAS_PERSONALES.forEach(mision => {
            html += buildMisionCard(mision, key, estado);
        });

        html += '<h3>Hogar</h3>';
        MISIONES_DIARIAS_HOGAR.forEach(mision => {
            html += buildMisionCard(mision, key, estado);
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
        const key = getKeyMensuales();
        const estado = cargarEstado(key);
        const jugador = Players.current;
    
        html += '<h3>Hogar</h3>';
        MISIONES_MENSUALES 
            .filter(m => m.jugador === null)
            .forEach(mision => {
                html += buildMisionCard(mision, key, estado);
            });

        html += '<h3>Personales</h3>';
        MISIONES_MENSUALES
            .filter(m => m.jugador === jugador)
            .forEach(mision => {
                html += buildMisionCard(mision, key, estado);
            });
    }

    contenedor.innerHTML = html;
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

    if (card.classList.contains('done')) {
        estado[id] = true;
        sumarPuntos(puntos);
        mostrarToastXP(puntos);
    } else {
        delete estado[id];
        sumarPuntos(-puntos);
    }
    guardarEstado(key, estado);
   
    if (card.classList.contains('subtarea-card')) {
      actualizarGrupo(card);
    }
    actualizarDisplayPuntos();
  }

 function toggleGrupo(grupoCard) {
      grupoCard.classList.toggle('abierto');
  }

  function actualizarGrupo(subtareaCard) {
      const grupoCard = subtareaCard.closest('.grupo-card');
      if (!grupoCard) return;

      const total = grupoCard.querySelectorAll('.subtarea-card').length;
      const hechas = grupoCard.querySelectorAll('.subtarea-card.done').length;

      grupoCard.querySelector('.grupo-progreso').textContent = `${hechas}/${total}`;

      const completo = hechas === total;
      grupoCard.classList.toggle('grupo-completo', completo);
      grupoCard.querySelector('.grupo-buff').classList.toggle('buff-earned', completo);

      
console.log('hechas:', hechas, 'total:', total, 'completo:', completo);
      if (completo) {
        const buff = grupoCard.dataset.Buff;
        const puntosBuff = parseInt(grupoCard.dataset.puntosBuff);
        sumarPuntos(puntosBuff);
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