// Guarda y lee datos en localStorage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  const Storage = {                                                                                                                                                                                                                                                   
    save(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    load(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },

    remove(key) {
      localStorage.removeItem(key);
    },

    clearMissionStates() {
      const clavesBorrar = [];
      for(let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        if (clave.startsWith('estado_diarias_') ||
            clave.startsWith('estado_semanales_') ||
            clave.startsWith('estado_mensuales')) {
              clavesBorrar.push(clave);
            }  
      }
      clavesBorrar.forEach(clave => localStorage.removeItem(clave));
    }
  };