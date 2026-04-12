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

// Los datos están en dos documentos separados
const docState      = db.collection('questlog').doc('state');
const docProvisiones = db.collection('questlog').doc('provisiones');

// Evita que el onSnapshot reactive nuestras propias escrituras
let _actualizandoDesdeFirebase = false;

// ── Interceptar Storage.save ───────────────────────────────────────────────
// 'provisiones' va a questlog/provisiones, todo lo demás a questlog/state
const _guardarOriginal = Storage.save.bind(Storage);
Storage.save = function(key, value) {
  _guardarOriginal(key, value);
  if (_actualizandoDesdeFirebase) return;

  if (key === 'provisiones') {
    docProvisiones.set(value, { merge: true })
      .catch(err => console.warn('[Firebase] Error al guardar provisiones:', err));
  } else {
    docState.set({ [key]: value }, { merge: true })
      .catch(err => console.warn('[Firebase] Error al guardar "' + key + '":', err));
  }
};

// ── Convertir datos del formato viejo al nuevo ────────────────────────────
// El app viejo usaba: name, cat, qty
// El app nuevo usa:   nombre, categoria, cantidad
function convertirProvisiones(datos) {
  const categorias = (datos.categorias || []).map(function(cat) {
    return {
      id:     cat.id,
      nombre: cat.nombre || cat.name || '',
      icono:  cat.icono  || '📦'
    };
  });

  const items = (datos.items || []).map(function(item) {
    return {
      id:        item.id,
      categoria: item.categoria || item.cat  || '',
      nombre:    item.nombre    || item.name || '',
      hay:       item.hay       || false,
      cantidad:  item.cantidad  !== undefined ? item.cantidad : (item.qty || 0)
    };
  });

  return { categorias, items };
}

// ── Escuchar cambios en tiempo real ────────────────────────────────────────
function configurarListenerFirebase() {

  // Listener de estado (puntos, misiones, ciclos, battle pass)
  docState.onSnapshot(function(snapshot) {
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
    console.warn('[Firebase] Error en listener state:', err);
  });

  // Listener de provisiones
  docProvisiones.onSnapshot(function(snapshot) {
    if (!snapshot.exists) return;

    const datos = snapshot.data();
    const provisiones = convertirProvisiones(datos);

    _actualizandoDesdeFirebase = true;
    const valorLocal  = localStorage.getItem('provisiones');
    const valorRemoto = JSON.stringify(provisiones);
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

// ── Primera vez: subir datos locales si Firestore está vacío ──────────────
async function inicializarFirebase() {
  try {
    const [snapState, snapProvisiones] = await Promise.all([
      docState.get(),
      docProvisiones.get()
    ]);

    if (!snapState.exists) {
      const datosLocales = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'provisiones') {
          const valor = Storage.load(key);
          if (valor !== null) datosLocales[key] = valor;
        }
      }
      if (Object.keys(datosLocales).length > 0) {
        await docState.set(datosLocales);
      }
    }

    if (!snapProvisiones.exists) {
      const provisiones = Storage.load('provisiones');
      if (provisiones) {
        await docProvisiones.set(convertirProvisiones(provisiones));
      }
    }
  } catch (err) {
    console.warn('[Firebase] Error en inicialización:', err);
  }

  configurarListenerFirebase();
}

inicializarFirebase();
