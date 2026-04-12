// js/firebase.js
// Sincronización en tiempo real con Firebase Firestore

const firebaseConfig = {
  apiKey:            "AIzaSyAbGHJHmiS8FswN3jZzrGibzZqCnytl1e4",
  authDomain:        "queslog-monoso.firebaseapp.com",
  projectId:         "queslog-monoso",
  storageBucket:     "queslog-monoso.firebasestorage.app",
  messagingSenderId: "775907253734",
  appId:             "1:775907253734:web:1fb4200a0e5f97ea8e8a27"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const docEstado      = db.collection('cacos-quest').doc('estado');
const docProvisiones = db.collection('cacos-quest').doc('provisiones');

let _actualizandoDesdeFirebase = false;

// ── Interceptar Storage.save ───────────────────────────────────────────────
const _guardarOriginal = Storage.save.bind(Storage);
Storage.save = function(key, value) {
  _guardarOriginal(key, value);
  if (_actualizandoDesdeFirebase) return;

  if (key === 'provisiones') {
    docProvisiones.set(value, { merge: true })
      .catch(err => console.warn('[Firebase] Error al guardar provisiones:', err));
  } else {
    docEstado.set({ [key]: value }, { merge: true })
      .catch(err => console.warn('[Firebase] Error al guardar "' + key + '":', err));
  }
};

// ── Escuchar cambios en tiempo real ────────────────────────────────────────
function configurarListenerFirebase() {

  docEstado.onSnapshot(function(snapshot) {
    if (!snapshot.exists) return;
    const datos = snapshot.data();

    _actualizandoDesdeFirebase = true;
    let huboCambios = false;

    Object.keys(datos).forEach(function(key) {
      const valorLocal  = localStorage.getItem(key);
      const valorRemoto = JSON.stringify(datos[key]);
      if (valorLocal !== valorRemoto) {
        localStorage.setItem(key, valorRemoto);
        huboCambios = true;
      }
    });

    _actualizandoDesdeFirebase = false;
    if (huboCambios) refrescarPantallaActual();

  }, function(err) {
    console.warn('[Firebase] Error en listener estado:', err);
  });

  docProvisiones.onSnapshot(function(snapshot) {
    if (!snapshot.exists) return;
    const datos = snapshot.data();
    if (!datos.categorias || datos.categorias.length === 0) return;

    _actualizandoDesdeFirebase = true;
    const valorLocal  = localStorage.getItem('provisiones');
    const valorRemoto = JSON.stringify(datos);
    const huboCambios = valorLocal !== valorRemoto;

    if (huboCambios) {
      localStorage.setItem('provisiones', valorRemoto);
    }

    _actualizandoDesdeFirebase = false;
    if (huboCambios) refrescarPantallaActual();

  }, function(err) {
    console.warn('[Firebase] Error en listener provisiones:', err);
  });
}

// ── Re-renderizar la pantalla visible ─────────────────────────────────────
function refrescarPantallaActual() {
  if (!document.getElementById('screen-missions').classList.contains('hidden')) {
    renderizarMisiones();
    actualizarDisplayPuntos();
  } else if (!document.getElementById('screen-provisions').classList.contains('hidden')) {
    renderizarProvisiones();
  } else if (!document.getElementById('screen-battlepass').classList.contains('hidden')) {
    renderizarBattlepass();
  } else if (!document.getElementById('screen-cycles').classList.contains('hidden')) {
    renderizarCiclos();
  }
}

// ── Subir datos locales si Firestore está vacío ───────────────────────────
async function inicializarFirebase() {
  try {
    const [snapEstado, snapProvisiones] = await Promise.all([
      docEstado.get(),
      docProvisiones.get()
    ]);

    if (!snapEstado.exists) {
      const datosLocales = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'provisiones') {
          const valor = Storage.load(key);
          if (valor !== null) datosLocales[key] = valor;
        }
      }
      if (Object.keys(datosLocales).length > 0) {
        await docEstado.set(datosLocales);
      }
    }

    if (!snapProvisiones.exists || !snapProvisiones.data().categorias) {
      const provisiones = Storage.load('provisiones');
      const datosASubir = (provisiones && provisiones.categorias && provisiones.categorias.length > 0)
        ? provisiones
        : {
            categorias: [...PROVISIONES_DEFAULT.categorias],
            items:      [...PROVISIONES_DEFAULT.items]
          };
      await docProvisiones.set(datosASubir);
    }
  } catch (err) {
    console.warn('[Firebase] Error en inicialización:', err);
  }

  configurarListenerFirebase();
}

// inicializarFirebase() es llamada desde auth.js cuando el usuario está autenticado
