// js/registro.js

let tabRegistroActual = 'completadas';                                                                                                                                                                  

function toggleFechaGrupo(titulo) {
    const grupo = titulo.closest('.registro-fecha-grupo');
    grupo.classList.toggle('abierto');
}

function desmarcarMisionCompletada(btn) {
    const card = btn.closest('.registro-mision-card');
    const id = card.dataset.id;
    const key = card.dataset.key;
    const puntos = parseInt(card.dataset.puntos);
    const compartida = card.dataset.compartida === 'true';
    const completadoPor = card.dataset.completadoPor;

    const estado = Storage.load(key) || {};
    delete estado[id];
    Storage.save(key, estado);

    if (compartida) {
        sumarPuntosAmbosJugadores(-puntos);
    } else {
        const jugadorAfectado = completadoPor || Players.current;
        sumarPuntosJugador(jugadorAfectado, -puntos);
    }

    mostrarToastXP(-puntos);
    card.remove();
    actualizarDisplayPuntos();
}

function completarMisionAtrasada(btn) {
    const card = btn.closest('.registro-mision-card');
    const id = card.dataset.id;
    const key = card.dataset.key;
    const puntos = parseInt(card.dataset.puntos);
    const compartida = card.dataset.compartida === 'true';

    const estado = Storage.load(key) || {};
    estado[id] = Players.current;
    Storage.save(key, estado);

    if (compartida) {
        sumarPuntosAmbosJugadores(puntos);
    } else {
        sumarPuntos(puntos);
    }

    mostrarToastXP(puntos);
    card.remove();
    actualizarDisplayPuntos();
}

function fechaAyer() {
    const ahora = new Date();
    ahora.setTime(ahora.getTime() - 5 * 60 * 60 * 1000);
    ahora.setDate(ahora.getDate() - 1);
    const y = ahora.getFullYear();
    const m = String(ahora.getMonth() + 1).padStart(2, '0');
    const d = String(ahora.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getKeySemanaAnterior() {
    const hoy = new Date();
    const diasDesdeMonday = (hoy.getDay() + 6) % 7;
    const lunesEstaSemana = new Date(hoy);
    lunesEstaSemana.setDate(hoy.getDate() - diasDesdeMonday);
    const lunesSemanaAnterior = new Date(lunesEstaSemana);
    lunesSemanaAnterior.setDate(lunesEstaSemana.getDate() - 7);
    const y = lunesSemanaAnterior.getFullYear();
    const m = String(lunesSemanaAnterior.getMonth() + 1).padStart(2, '0');
    const d = String(lunesSemanaAnterior.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function cambiarTabRegistro(tab) {
    tabRegistroActual = tab;
    
    document.querySelectorAll('#screen-registro .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const textos = { completadas: 'Completadas', no_completadas: 'No Completadas' };
    document.querySelectorAll('#screen-registro .tab-btn').forEach(btn => {
        if (btn.textContent === textos[tab]) {
            btn.classList.add('active');
        }
    });

    renderizarRegistro();
}

function buscarMision(id) {
    const todas = [
        ...MISIONES_DIARIAS_PERSONALES.filter(Boolean),
        ...MISIONES_DIARIAS_HOGAR,
        ...MISIONES_SEMANALES_SUELTAS,
        ...MISIONES_SEMANALES_GRUPALES.flatMap(g => g.subtareas),
        ...MISIONES_MENSUALES
    ];
    return todas.find(m => m.id === id);
}

function obtenerMisionesCompletadas() {
    const jugador = Players.current;
    const porFecha = {};

    function agregar(tipo, fecha, id, valor, esSemanales, esHogar, storageKey) {
        const mision = buscarMision(id);
        if (!mision) return;

        let completadoPor = null;

        if (esSemanales) {
            if (valor === true) {
                // Suelta compartida: se muestra a ambos, sin icono
            } else {
                if (mision.jugador && mision.jugador !== jugador) return;
                completadoPor = valor;
            }
        } else if (esHogar) {
            completadoPor = valor || null;
        }

        const clave = tipo + '_' + fecha;
        if (!porFecha[clave]) porFecha[clave] = { tipo, fecha, misiones: [] };
        porFecha[clave].misiones.push({ id, nombre: mision.nombre, puntos: mision.puntos, completadoPor, storageKey, compartida: mision.compartida || false });
    }

    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        let fecha = null;
        let estado = null;
        let tipo = null;
        let esSemanales = false;
        let esHogar = false;

        if (clave.startsWith(`estado_diarias_pers_${jugador}_`)) {
            tipo = 'diaria';
            fecha = clave.replace(`estado_diarias_pers_${jugador}_`, '');
            estado = Storage.load(clave);
        } else if (clave.startsWith('estado_diarias_') && !clave.includes('_pers_')) {
            tipo = 'diaria';
            fecha = clave.replace('estado_diarias_', '');
            estado = Storage.load(clave);
            esHogar = true;
        } else if (clave.startsWith('estado_semanales_')) {
            tipo = 'semanal';
            fecha = clave.replace('estado_semanales_', '');
            estado = Storage.load(clave);
            esSemanales = true;
        } else if (clave.startsWith(`estado_mensuales_pers_${jugador}_`)) {
            tipo = 'mensual';
            fecha = clave.replace(`estado_mensuales_pers_${jugador}_`, '') + '-01';
            estado = Storage.load(clave);
        } else if (clave.startsWith('estado_mensuales_') && !clave.includes('_pers_')) {
            tipo = 'mensual';
            fecha = clave.replace('estado_mensuales_', '') + '-01';
            estado = Storage.load(clave);
            esHogar = true;
        }

        if (!fecha || !estado || !tipo) continue;

        Object.entries(estado).forEach(([id, valor]) => {
            agregar(tipo, fecha, id, valor, esSemanales, esHogar, clave);
        });
    }

    return porFecha;
}

function renderizarRegistro() {
    const contenedor = document.getElementById('registro-container');

    if (tabRegistroActual === 'completadas') {
        const porFecha = obtenerMisionesCompletadas();
        const entradas = Object.values(porFecha).sort((a, b) => b.fecha.localeCompare(a.fecha));

        if (entradas.length === 0) {
            contenedor.innerHTML = '<p class="ciclos-vacio">No hay misiones completadas aún.</p>';
            return;
        }

        let html = '';
        entradas.forEach(entrada => {
            html += `<div class="registro-fecha-grupo">`;
            html += `<div class="registro-fecha-titulo" onclick="toggleFechaGrupo(this)">
                <span>${formatearTituloRegistro(entrada.tipo, entrada.fecha)}</span>
                <span class="registro-fecha-chevron">›</span>
            </div>`;
            entrada.misiones.forEach(mision => {
                const icono = mision.completadoPor === 'mono' ? '🐵 ' : mision.completadoPor === 'oso' ? '🐻 ' : '';
                html += `
                    <div class="registro-mision-card done"
                         data-id="${mision.id}"
                         data-key="${mision.storageKey}"
                         data-puntos="${mision.puntos}"
                         data-compartida="${mision.compartida}"
                         data-completado-por="${mision.completadoPor || ''}">
                        <span class="registro-mision-nombre">${mision.nombre}</span>
                        <div class="registro-mision-acciones">
                            <span class="registro-mision-puntos">${icono}+${mision.puntos}</span>
                            <div class="mission-check done" onclick="desmarcarMisionCompletada(this)">✓</div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        });

        contenedor.innerHTML = html;
    }

    if (tabRegistroActual === 'no_completadas') {
        const misiones = obtenerMisionesNoCompletadas();
        const diarias = misiones.filter(m => m.tipo === 'diaria_personal' || m.tipo === 'diaria_hogar');
        const semanales = misiones.filter(m => m.tipo === 'semanal_grupal' || m.tipo === 'semanal_suelta');

        if (misiones.length === 0) {
            contenedor.innerHTML = '<p class="ciclos-vacio">¡Todo completado! No hay misiones pendientes.</p>';
            return;
        }

        function buildGrupoNoCompletadas(titulo, lista) {
            if (lista.length === 0) return '';
            let html = `<div class="registro-fecha-grupo">`;
            html += `<div class="registro-fecha-titulo" onclick="toggleFechaGrupo(this)">
                <span>${titulo}</span>
                <span class="registro-fecha-chevron">›</span>
            </div>`;
            lista.forEach(mision => {
                const etiqueta = mision.grupo ? `<span class="registro-mision-grupo">${mision.grupo}</span>` : '';
                html += `
                    <div class="registro-mision-card no-completada"
                         data-id="${mision.id}"
                         data-key="${mision.key}"
                         data-puntos="${mision.puntos}"
                         data-compartida="${mision.compartida}">
                        <div class="registro-mision-info">
                            ${etiqueta}
                            <span class="registro-mision-nombre">${mision.nombre}</span>
                        </div>
                        <div class="registro-mision-acciones">
                            <span class="registro-mision-puntos">+${mision.puntos}</span>
                            <div class="mission-check" onclick="completarMisionAtrasada(this)"></div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            return html;
        }

        const ayer = fechaAyer();
        const tituloAyer = formatearTituloRegistro('diaria', ayer);
        const semanaAnterior = getKeySemanaAnterior();
        const tituloSemana = formatearTituloRegistro('semanal', semanaAnterior);

        contenedor.innerHTML = buildGrupoNoCompletadas(tituloAyer, diarias) +
                               buildGrupoNoCompletadas(tituloSemana, semanales);
    }
}

function formatearTituloRegistro(tipo, fecha) {
    const meses = ['enero','febrero','marzo','abril','mayo','junio',
                    'julio','agosto','septiembre','octubre','noviembre','diciembre'];

    if (tipo === 'diaria') {
        const d = new Date(fecha + 'T00:00:00');
        return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
    }

    if (tipo === 'semanal') {                                                                                                                                                                               
    const fecha_d = new Date(fecha + 'T00:00:00');
    const diasDesdeMonday = (fecha_d.getDay() + 6) % 7;
    const inicio = new Date(fecha_d);
    inicio.setDate(fecha_d.getDate() - diasDesdeMonday);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    if (inicio.getMonth() === fin.getMonth()) {
        return `Semana del ${inicio.getDate()} al ${fin.getDate()} de ${meses[fin.getMonth()]} de ${fin.getFullYear()}`;
    } else {
        return `Semana del ${inicio.getDate()} de ${meses[inicio.getMonth()]} al ${fin.getDate()} de ${meses[fin.getMonth()]} de ${fin.getFullYear()}`;
    }
}

    if (tipo === 'mensual') {
        const mesesCap = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const d = new Date(fecha + 'T00:00:00');
        return `${mesesCap[d.getMonth()]} ${d.getFullYear()}`;
    }
}

function obtenerMisionesNoCompletadas() {                                                                                                                                                                     const jugador = Players.current;                                                                                                                                                                    
      const ayer = fechaAyer();                                                                                                                                                                           
      const semanaAnterior = getKeySemanaAnterior();

      const estadoDiariasPersonales = Storage.load(`estado_diarias_pers_${jugador}_${ayer}`) || {};
      const estadoDiariasHogar = Storage.load(`estado_diarias_${ayer}`) || {};
      const estadoSemanales = Storage.load(`estado_semanales_${semanaAnterior}`) || {};

      const resultado = [];

      // Diarias personales no completadas ayer
      const keyDiariasPersonales = `estado_diarias_pers_${jugador}_${ayer}`;
      MISIONES_DIARIAS_PERSONALES.filter(Boolean).forEach(mision => {
          if (!estadoDiariasPersonales[mision.id]) {
              resultado.push({ id: mision.id, nombre: mision.nombre, puntos: mision.puntos, tipo: 'diaria_personal', key: keyDiariasPersonales, compartida: false });
          }
      });

      // Diarias hogar no completadas ayer
      const keyDiariasHogar = `estado_diarias_${ayer}`;
      MISIONES_DIARIAS_HOGAR.forEach(mision => {
          if (!estadoDiariasHogar[mision.id]) {
              resultado.push({ id: mision.id, nombre: mision.nombre, puntos: mision.puntos, tipo: 'diaria_hogar', key: keyDiariasHogar, compartida: false });
          }
      });

      // Subtareas grupales no completadas la semana pasada
      const keySemanales = `estado_semanales_${semanaAnterior}`;
      MISIONES_SEMANALES_GRUPALES.forEach(grupo => {
          grupo.subtareas.forEach(subtarea => {
              if (!estadoSemanales[subtarea.id]) {
                  resultado.push({ id: subtarea.id, nombre: subtarea.nombre, puntos: subtarea.puntos, tipo: 'semanal_grupal', grupo: grupo.nombre, key: keySemanales, compartida: false });
              }
          });
      });

      // Sueltas no completadas la semana pasada
      MISIONES_SEMANALES_SUELTAS
          .filter(m => m.jugador === null || m.jugador === jugador)
          .forEach(mision => {
              if (!estadoSemanales[mision.id]) {
                  resultado.push({ id: mision.id, nombre: mision.nombre, puntos: mision.puntos, tipo: 'semanal_suelta', key: keySemanales, compartida: mision.compartida || false });
              }
          });

      return resultado;
  }