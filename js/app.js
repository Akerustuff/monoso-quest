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
    if (screen === 'registro') {                                                                                                                                                                            
      cambiarTabRegistro('completadas');
    }
    if (screen === 'presupuesto') {
      renderizarPresupuesto();
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
    document.querySelectorAll('.menu-jugador-btn').forEach(function(btn) {
      btn.textContent = player.emoji + ' ' + player.name;
    });
  }

  function toggleMenuJugador() {
    const pantallaVisible = document.querySelector('.screen:not(.hidden)');
    const dropdown = pantallaVisible ? pantallaVisible.querySelector('.menu-jugador-dropdown') : null;
    if (dropdown) dropdown.classList.toggle('visible');
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-jugador-wrap')) {
      document.querySelectorAll('.menu-jugador-dropdown').forEach(function(d) {
        d.classList.remove('visible');
      });
    }
  });

  // Arranque: se ejecuta cuando carga la app
  // La navegación inicial la maneja auth.js después de verificar el login
  window.onload = function () {
    verificarCambioMes();
    document.querySelectorAll('.screen').forEach(function(screen) {
      const footer = document.createElement('div');
      footer.className = 'footer-global';
      footer.textContent = 'Hecho por el 🐻 con amor ♥️';
      screen.appendChild(footer);
    });
  };

