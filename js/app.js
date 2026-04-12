// Navegación y arranque de la app                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  function navigate(screen) {                                                                                                                                                                                                                                         
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    // Mostrar la pantalla pedida
    document.getElementById('screen-' + screen).classList.remove('hidden');

    // Mostrar las misiones diarias por defecto al entrar a Misiones
    if (screen === 'missions') {
      cambiarTab('diarias');  
    }
    if (screen === 'cycles') {
      renderizarCiclos();
    }
    if (screen === 'provisions') {
      categoriasAbiertas.clear();
      renderizarProvisiones();
    }
    if (screen === 'battlepass') {
      renderizarBattlepass();
    }
  }

  function selectPlayer(playerId) {
    Players.select(playerId);
    updatePlayerName();
    navigate('menu');
  }

  function changePlayer() {
    Players.logout();
    navigate('player');
  }

  function updatePlayerName() {
    const player = Players.get();
    document.getElementById('player-name').textContent = player.emoji + ' ' + player.name;
  }

  function toggleMenuJugador() {
    document.getElementById('menu-jugador-dropdown').classList.toggle('visible');
  }

  document.addEventListener('click', function(e) {
    const wrap = document.querySelector('.menu-jugador-wrap');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('menu-jugador-dropdown').classList.remove('visible');
    }
  });

  // Arranque: se ejecuta cuando carga la app
  // La navegación inicial la maneja auth.js después de verificar el login
  window.onload = function () {
    verificarCambioMes();
  };

