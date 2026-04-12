// Lógica de jugadores y sesión                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  const Players = {                                                                                                                                                                                                                                                   
    current: null,

    // Lista de jugadores
    list: {
      mono: { name: 'Mono', emoji: '🐵' },
      oso:  { name: 'Oso',  emoji: '🐻' }
    },

    // Seleccionar jugador y guardar sesión
    select(playerId) {
      this.current = playerId;
      Storage.save('session', playerId);
    },

    // Cargar sesión guardada
    loadSession() {
      const saved = Storage.load('session');
      if (saved) {
        this.current = saved;
        return true;
      }
      return false;
    },

    // Obtener datos del jugador actual
    get() {
      return this.list[this.current];
    },

    // Cerrar sesión
    logout() {
      this.current = null;
      Storage.remove('session');
    }
  };