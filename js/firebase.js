// js/firebase.js
// Sincronización en tiempo real con Firebase Firestore

// ── CONFIGURACIÓN ──────────────────────────────────────────────────────────
// Reemplaza estos valores con los de tu proyecto en Firebase Console
// (Configuración del proyecto → General → Tus apps → SDK de Firebase)
const firebaseConfig = {
  apiKey:            "AIzaSyAbGHJHmiS8FswN3jZzrGibzZqCnytl1e4",
  authDomain:        "queslog-monoso.firebaseapp.com",
  projectId:         "queslog-monoso",
  storageBucket:     "queslog-monoso.firebasestorage.app",
  messagingSenderId: "775907253734",
  appId:             "1:775907253734:web:1fb4200a0e5f97ea8e8a27"
};
// ───────────────────────────────────────────────────────────────────────────

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const docEstado = db.collection('cacos-quest').doc('estado');

// Evita que el onSnapshot reactive nuestras propias escrituras
let _actualizandoDesdeFirebase = false;

// ── Interceptar Storage.save para que cada escritura llegue a Firestore ────
const _guardarOriginal = Storage.save.bind(Storage);
Storage.save = function(key, value) {
  _guardarOriginal(key, value);
  if (!_actualizandoDesdeFirebase) {
    docEstado.set({ [key]: value }, { merge: true })
      .catch(err => console.warn('[Firebase] Error al guardar "' + key + '":', err));
  }
};

// ── Escuchar cambios del otro jugador en tiempo real ──────────────────────
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

    if (huboCambios) {
      refrescarPantallaActual();
    }
  }, function(err) {
    console.warn('[Firebase] Error en listener:', err);
  });
}

// ── Re-renderizar la pantalla que está visible ahora mismo ─────────────────
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

// ── Primera vez: si Firestore está vacío, sube los datos locales ───────────
async function inicializarFirebase() {
  try {
    const snapshot = await docEstado.get();
    if (!snapshot.exists) {
      const datosLocales = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const valor = Storage.load(key);
        if (valor !== null) datosLocales[key] = valor;
      }
      if (Object.keys(datosLocales).length > 0) {
        await docEstado.set(datosLocales);
      }
    }
  } catch (err) {
    console.warn('[Firebase] Error en inicialización:', err);
  }

  configurarListenerFirebase();
}

inicializarFirebase();
