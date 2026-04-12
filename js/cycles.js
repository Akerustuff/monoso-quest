function calcularNivel(puntos) {
    let nivelAlcanzado = 0;
    for(let i = 0; i < NIVELES_BATTLE_PASS.length; i++) {
        if (puntos >= NIVELES_BATTLE_PASS[i].xpRequerido) {
            nivelAlcanzado = NIVELES_BATTLE_PASS[i].nivel;
        }
    }
    return nivelAlcanzado;
}

function getCicloActual() {
    return Storage.load('ciclo_actual') || {
        numero: 1,
        inicio: new Date().toISOString().slice(0, 10)
    };
}

function getRegistroCiclos(){
    return Storage.load('registro_ciclos') || [];
}

function finalizarCiclo() {
    const ciclo = getCicloActual();
    const puntosMono = Storage.load('puntos_mono') || 0;
    const puntosOso = Storage.load('puntos_oso') || 0;
    const puntosConjuntos = puntosMono + puntosOso;
    const nivel = calcularNivel(puntosConjuntos);
    const hoy = new Date().toISOString().slice(0, 10);

    const registro = getRegistroCiclos();
    registro.push({
        numero: ciclo.numero,
        inicio: ciclo.inicio,
        fin: hoy,
        puntosConjuntos: puntosConjuntos,
        puntosMono: puntosMono,
        puntosOso: puntosOso,
        nivel: nivel
    });
    Storage.save('registro_ciclos', registro);

    Storage.save('puntos_mono', 0);
    Storage.save('puntos_oso', 0);
    Storage.save('xp_mono', 0);
    Storage.save('xp_oso', 0);
    Storage.save('nenurios_gastados', 0);
    Storage.save('bp_canjeados', {});
    Storage.clearMissionStates();

    Storage.save('ciclo_actual', {
        numero: ciclo.numero + 1,
        inicio: hoy
    });
}

function verificarCambioMes() {
    const ciclo = getCicloActual();
    const mesCiclo = ciclo.inicio.slice(0, 7);
    const mesHoy = new Date().toISOString().slice(0, 7);

    if (mesCiclo !== mesHoy) {
        finalizarCiclo();
    }
}

function renderizarCiclos() {
    const ciclo = getCicloActual();
    const registro = getRegistroCiclos();
    const puntosMono = Storage.load('puntos_mono') || 0;
    const puntosOso = Storage.load('puntos_oso') || 0;
    const puntosConjuntos = puntosMono + puntosOso;
    const nivelActual = calcularNivel(puntosConjuntos);
    const hoy = new Date();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().slice(0, 10);

    document.getElementById('ciclo-numero').textContent = 'Ciclo' + ciclo.numero;
    document.getElementById('ciclo-periodo').textContent = 'Periodo: ' + formatearPeriodo(ciclo.inicio, ultimoDiaMes);
    document.getElementById('ciclo-puntos-mono').textContent = '🐵 ' + puntosMono + ' Nenurios';
    document.getElementById('ciclo-puntos-oso').textContent = '🐻 ' + puntosOso + ' Nenurios';
    document.getElementById('ciclo-puntos').textContent = '⭐ ' + puntosConjuntos + ' Nenurios Totales';
    document.getElementById('ciclo-nivel').textContent = 'Nivel ' + nivelActual;
    
    let html = '';
      if (registro.length === 0) {
          html = '<p class="ciclos-vacio">Aún no hay ciclos finalizados.</p>';
      } else {
          registro.slice().reverse().forEach(c => {
              html += `
                  <div class="ciclo-card">
                      <div class="ciclo-card-header">
                          <span class="ciclo-card-numero">Ciclo ${c.numero}</span>
                          <span class="ciclo-card-periodo">Periodo: ${formatearPeriodo(c.inicio, c.fin)}</span>
                      </div>
                      <div class="ciclo-card-stats">
                          <span>🐵 ${c.puntosMono} Nenurios </span>
                          <span>🐻 ${c.puntosOso} Nenurios </span>
                          <span>⭐ ${c.puntosConjuntos} Nenurios Totales </span>
                          <span>Nivel ${c.nivel}</span>
                      </div>
                  </div>
              `;
          });
      }
      document.getElementById('ciclos-registro').innerHTML = html;
}

function confirmarFinalizarCiclo() {
      document.getElementById('modal-finalizar-ciclo').classList.remove('hidden');
  }

  function cerrarModalFinalizarCiclo() {
      document.getElementById('modal-finalizar-ciclo').classList.add('hidden');
  }

  function confirmarYFinalizar() {
      finalizarCiclo();
      cerrarModalFinalizarCiclo();
      renderizarCiclos();
      actualizarDisplayPuntos();
  }

  function formatearPeriodo(inicio, fin) {
    const meses  = ['enero','febrero','marzo','abril','mayo','junio',
                     'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const fechaInicio = new Date(inicio + 'T00:00:00');
    const fechaFin = new Date(fin + 'T00:00:00');
    const mes = meses[fechaFin.getMonth()];
    const año = fechaFin.getFullYear();
    return `${fechaInicio.getDate()} al ${fechaFin.getDate()} de ${mes} ${año}`;
  }