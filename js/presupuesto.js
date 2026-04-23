let categoriasPresAbiertas = new Set();
let subcategoriasPresAbiertas = new Set();

function migrarPresupuesto() {
  let subcats = Storage.load('presupuesto_subcategorias');
  if (!subcats) return;

  const tieneSubcatsViejas = subcats.some(function(s) {
    return s.id === 'psub_seguros' || s.id === 'psub_suscripciones';
  });
  if (!tieneSubcatsViejas) return;

  let cats = Storage.load('presupuesto_categorias');
  if (cats && !cats.some(function(c) { return c.id === 'pcat_seguros'; })) {
    cats = cats.map(function(c) {
      if (c.id === 'pcat_suscripciones') return { id: 'pcat_suscripciones', nombre: 'Suscripciones', icono: '📱' };
      return c;
    });
    const idx = cats.findIndex(function(c) { return c.id === 'pcat_suscripciones'; });
    cats.splice(idx + 1, 0, { id: 'pcat_seguros', nombre: 'Seguros', icono: '🛡️' });
    Storage.save('presupuesto_categorias', cats);
  }

  subcats = subcats.filter(function(s) { return s.id !== 'psub_seguros' && s.id !== 'psub_suscripciones'; });
  subcats.push(
    { id: 'psub_suscrip_ocio',     categoriaId: 'pcat_suscripciones', icono: '🎬', nombre: 'Ocio',         presupuesto: 0 },
    { id: 'psub_suscrip_utilidad', categoriaId: 'pcat_suscripciones', icono: '🔧', nombre: 'Utilidad',     presupuesto: 0 },
    { id: 'psub_seguros_mono',     categoriaId: 'pcat_seguros',       icono: '🐵', nombre: 'Seguros Mono', presupuesto: 0 },
    { id: 'psub_seguros_oso',      categoriaId: 'pcat_seguros',       icono: '🐻', nombre: 'Seguros Oso',  presupuesto: 0 }
  );
  Storage.save('presupuesto_subcategorias', subcats);
}

function obtenerMesActual() {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
}

function cargarCategoriasPres() {
  const guardadas = Storage.load('presupuesto_categorias');
  if (guardadas && guardadas.length > 0) return guardadas;
  return [...PRESUPUESTO_DEFAULT.categorias];
}

function guardarCategoriasPres(categorias) {
  Storage.save('presupuesto_categorias', categorias);
}

function cargarGastosMes(mes) {
  return Storage.load(`presupuesto_gastos_${mes}`) || [];
}

function guardarGastosMes(mes, gastos) {
  Storage.save(`presupuesto_gastos_${mes}`, gastos);
}

function cargarSubcategoriasPres() {
  const guardadas = Storage.load('presupuesto_subcategorias');
  if (guardadas && guardadas.length > 0) return guardadas;
  return [...PRESUPUESTO_DEFAULT.subcategorias];
}

function guardarSubcategoriasPres(subcategorias) {
  Storage.save('presupuesto_subcategorias', subcategorias);
}

function formatearPesos(monto) {
  return '$' + monto.toLocaleString('es-CL');
}

const PALETA_SUBCATEGORIAS = [
  '#4caf7d', '#5b8edb', '#e8a838', '#c47ed4',
  '#e05c5c', '#4ec9c9', '#e87d4e', '#a0c44c',
  '#e85c9a', '#7b6ee8', '#4cbbdb', '#c4a44c'
];

function generarColoresRubro(clase, n) {
  return PALETA_SUBCATEGORIAS.slice(0, n);
}

function renderizarPresupuesto() {
  migrarPresupuesto();
  const mes = obtenerMesActual();
  const categorias = cargarCategoriasPres();
  const gastos = cargarGastosMes(mes);
  const subcategorias = cargarSubcategoriasPres();

  const totalGastado = gastos.reduce((suma, g) => suma + g.monto, 0);
  const ingresosData = cargarIngresosMes(mes);
  const totalIngresos = (ingresosData.mono || []).reduce((s, e) => s + e.monto, 0)
                      + (ingresosData.oso  || []).reduce((s, e) => s + e.monto, 0);

  renderizarIngresos();

  const resumen = document.getElementById('presupuesto-resumen');
  resumen.innerHTML = `
    <div class="presupuesto-resumen-titulo">Mes actual</div>
    <div class="presupuesto-resumen-monto">${formatearPesos(totalGastado)} <span class="presupuesto-resumen-sub">gastado</span></div>
    <div class="presupuesto-resumen-sub">quedan ${formatearPesos(Math.max(0, totalIngresos - totalGastado))} de ${formatearPesos(totalIngresos)}</div>
  `;

  const body = document.getElementById('presupuesto-body');
  if (categorias.length === 0) {
    body.innerHTML = '<p style="text-align:center; color:var(--color-texto-suave); padding:2rem;">Agrega una categoría para comenzar</p>';
    return;
  }

  body.innerHTML = categorias.map(cat => {
    const subcatsCat = subcategorias.filter(s => s.categoriaId === cat.id);
    const gastosCat = gastos.filter(g => g.categoriaId === cat.id);
    const presupuestoCat = subcatsCat.reduce((suma, s) => suma + (s.presupuesto || 0), 0);
    const gastadoCat = gastosCat.reduce((suma, g) => suma + g.monto, 0);
    const porcentajeCat = presupuestoCat > 0 ? Math.min(100, (gastadoCat / presupuestoCat) * 100) : 0;
    const esPeligroCat = gastadoCat > presupuestoCat;
    const estaAbierta = categoriasPresAbiertas.has(cat.id);

    const rubrocat = DISTRIBUCION_INGRESO.find(function(d) { return d.categoriaIds.includes(cat.id); });
    const claseRubro = rubrocat ? ' pres-categoria--' + rubrocat.clase : '';
    const coloresCat = generarColoresRubro(rubrocat ? rubrocat.clase : '', subcatsCat.length + 1);

    const filasSubcategorias = subcatsCat.map((subcat, subcatIdx) => {
      const gastosSubcat = gastosCat.filter(g => g.subcategoriaId === subcat.id);
      const gastadoSubcat = gastosSubcat.reduce((suma, g) => suma + g.monto, 0);
      const porcentajeSubcat = subcat.presupuesto > 0 ? Math.min(100, (gastadoSubcat / subcat.presupuesto) * 100) : 0;
      const esPeligroSubcat = gastadoSubcat > subcat.presupuesto;
      const subcatAbierta = subcategoriasPresAbiertas.has(subcat.id);

      return `
        <div class="pres-subcat-seccion${subcatAbierta ? ' abierta' : ''}">
          <div class="pres-subcat-header" onclick="toggleSubcategoriaPres('${subcat.id}')">
            <span class="pres-subcat-nombre">${subcat.icono ? subcat.icono + ' ' : ''}${subcat.nombre}</span>
            <span class="pres-subcat-montos">${formatearPesos(gastadoSubcat)} / ${formatearPesos(subcat.presupuesto)}</span>
            <button class="prov-btn-accion editar" onclick="event.stopPropagation(); abrirModalEditarSubcategoriaPres('${subcat.id}')">✏</button>
            <span class="pres-subcat-flecha">▾</span>
          </div>
          <div class="pres-barra-wrap">
            <div class="pres-barra-fondo">
              <div class="pres-barra-relleno" style="width:${porcentajeSubcat}%;background:${esPeligroSubcat ? '#e05c5c' : coloresCat[subcatIdx]}"></div>
            </div>
          </div>
          <div class="pres-subcat-gastos${subcatAbierta ? ' abierta' : ''}">
            ${gastosSubcat.length === 0
              ? `<div class="pres-sin-gastos">Sin gastos registrados</div>`
              : gastosSubcat.map(g => `
                <div class="pres-gasto-item">
                  <span class="pres-gasto-jugador">${Players.list[g.jugador]?.emoji || '👤'}</span>
                  <div class="pres-gasto-info">
                    <span class="pres-gasto-titulo">${g.titulo}</span>
                  </div>
                  <span class="pres-gasto-monto">${formatearPesos(g.monto)}</span>
                  <button class="pres-gasto-btn-eliminar" onclick="eliminarGasto('${g.id}')">🗑</button>
                </div>
              `).join('')
            }
          </div>
        </div>
      `;
    }).join('');

    const gastossinSubcat = gastosCat.filter(g => !g.subcategoriaId || !subcatsCat.find(s => s.id === g.subcategoriaId));
    const filasSinSubcat = gastossinSubcat.map(g => `
      <div class="pres-gasto-item">
        <span class="pres-gasto-jugador">${Players.list[g.jugador]?.emoji || '👤'}</span>
        <div class="pres-gasto-info">
          <span class="pres-gasto-titulo">${g.titulo}</span>
        </div>
        <span class="pres-gasto-monto">${formatearPesos(g.monto)}</span>
        <button class="pres-gasto-btn-eliminar" onclick="eliminarGasto('${g.id}')">🗑</button>
      </div>
    `).join('');

    const segsCat = subcatsCat
      .map(function(subcat, i) {
        const gastado = gastosCat.filter(function(g) { return g.subcategoriaId === subcat.id; })
          .reduce(function(s, g) { return s + g.monto; }, 0);
        return { gastado: gastado, color: coloresCat[i] };
      })
      .concat([{ gastado: gastossinSubcat.reduce(function(s, g) { return s + g.monto; }, 0), color: coloresCat[subcatsCat.length] }])
      .filter(function(seg) { return seg.gastado > 0; });
    const barraSegCat = gastadoCat > 0
      ? segsCat.map(function(seg) {
          const pct = (seg.gastado / gastadoCat) * porcentajeCat;
          return '<div class="pres-barra-seg" style="width:' + pct + '%;background:' + seg.color + '"></div>';
        }).join('')
      : '';

    return `
      <div class="pres-categoria${estaAbierta ? ' abierta' : ''}${claseRubro}" data-cat-id="${cat.id}">
        <div class="pres-categoria-header" onclick="toggleCategoriaPres('${cat.id}')">
          <span class="pres-categoria-icono">${cat.icono || '📦'}</span>
          <div class="pres-categoria-info">
            <div class="pres-categoria-nombre">${cat.nombre}</div>
            <div class="pres-categoria-montos">queda ${formatearPesos(Math.max(0, presupuestoCat - gastadoCat))} de ${formatearPesos(presupuestoCat)}</div>
          </div>
          <button class="prov-btn-accion editar" onclick="event.stopPropagation(); abrirModalEditarCategoriaPres('${cat.id}')">✏</button>
          <span class="pres-categoria-flecha">▾</span>
        </div>
        <div class="pres-barra-wrap">
          <div class="pres-barra-fondo pres-barra-segmentada">
            ${barraSegCat}
          </div>
        </div>
        <div class="pres-gastos-lista">
          ${subcatsCat.length === 0 && gastosCat.length === 0
            ? '<div style="padding:0.75rem 1rem; color:var(--color-texto-suave); font-size:0.85rem;">Sin subcategorías ni gastos</div>'
            : filasSubcategorias + filasSinSubcat
          }
        </div>
      </div>
    `;
  }).join('');
}

function toggleCategoriaPres(catId) {
  if (categoriasPresAbiertas.has(catId)) {
    categoriasPresAbiertas.delete(catId);
  } else {
    categoriasPresAbiertas.add(catId);
  }
  renderizarPresupuesto();
}

function toggleSubcategoriaPres(subcatId) {
  if (subcategoriasPresAbiertas.has(subcatId)) {
    subcategoriasPresAbiertas.delete(subcatId);
  } else {
    subcategoriasPresAbiertas.add(subcatId);
  }
  renderizarPresupuesto();
}

function toggleFabMenuPres() {
  document.getElementById('presupuesto-fab-menu').classList.toggle('visible');
}

function cerrarFabMenuPres() {
  document.getElementById('presupuesto-fab-menu').classList.remove('visible');
}

// ── Agregar categoría ──────────────────────────────────────────

function abrirModalAgregarCategoriaPres() {
  cerrarFabMenuPres();
  document.getElementById('pres-cat-input-icono').value = '';
  document.getElementById('pres-cat-input-nombre').value = '';
  document.getElementById('pres-cat-input-presupuesto').value = '';
  document.getElementById('modal-agregar-categoria-pres').classList.add('visible');
}

function cerrarModalAgregarCategoriaPres() {
  document.getElementById('modal-agregar-categoria-pres').classList.remove('visible');
}

function confirmarAgregarCategoriaPres() {
  const nombre = document.getElementById('pres-cat-input-nombre').value.trim();
  const icono = document.getElementById('pres-cat-input-icono').value.trim() || '📦';
  if (!nombre) return;

  const categorias = cargarCategoriasPres();
  categorias.push({ id: 'id_' + Date.now(), nombre, icono });
  guardarCategoriasPres(categorias);
  cerrarModalAgregarCategoriaPres();
  renderizarPresupuesto();
}

// ── Editar / eliminar categoría ────────────────────────────────

let categoriaPresEditandoId = null;

function abrirModalEditarCategoriaPres(catId) {
  const categorias = cargarCategoriasPres();
  const cat = categorias.find(c => c.id === catId);
  categoriaPresEditandoId = catId;
  document.getElementById('pres-edit-cat-icono').value = cat.icono || '';
  document.getElementById('pres-edit-cat-nombre').value = cat.nombre;
  document.getElementById('pres-edit-cat-botones').style.display = 'flex';
  document.getElementById('pres-confirmar-eliminar-cat-botones').style.display = 'none';
  document.getElementById('modal-editar-categoria-pres').classList.add('visible');
}

function cerrarModalEditarCategoriaPres() {
  document.getElementById('modal-editar-categoria-pres').classList.remove('visible');
}

function confirmarEditarCategoriaPres() {
  const nombre = document.getElementById('pres-edit-cat-nombre').value.trim();
  const icono = document.getElementById('pres-edit-cat-icono').value.trim() || '📦';
  if (!nombre) return;

  const categorias = cargarCategoriasPres();
  const cat = categorias.find(c => c.id === categoriaPresEditandoId);
  cat.nombre = nombre;
  cat.icono = icono;
  guardarCategoriasPres(categorias);
  cerrarModalEditarCategoriaPres();
  renderizarPresupuesto();
}

function pedirConfirmacionEliminarCategoriaPres() {
  document.getElementById('pres-edit-cat-botones').style.display = 'none';
  document.getElementById('pres-confirmar-eliminar-cat-botones').style.display = 'flex';
}

function cancelarEliminarCategoriaPres() {
  document.getElementById('pres-edit-cat-botones').style.display = 'flex';
  document.getElementById('pres-confirmar-eliminar-cat-botones').style.display = 'none';
}

function confirmarEliminarCategoriaPres() {
  const mes = obtenerMesActual();

  let categorias = cargarCategoriasPres();
  categorias = categorias.filter(c => c.id !== categoriaPresEditandoId);
  guardarCategoriasPres(categorias);

  let subcategorias = cargarSubcategoriasPres();
  subcategorias = subcategorias.filter(s => s.categoriaId !== categoriaPresEditandoId);
  guardarSubcategoriasPres(subcategorias);

  let gastos = cargarGastosMes(mes);
  gastos = gastos.filter(g => g.categoriaId !== categoriaPresEditandoId);
  guardarGastosMes(mes, gastos);

  cerrarModalEditarCategoriaPres();
  renderizarPresupuesto();
}

// ── Agregar subcategoría ───────────────────────────────────────

function abrirModalAgregarSubcategoriaPres() {
  cerrarFabMenuPres();
  const categorias = cargarCategoriasPres();
  const select = document.getElementById('pres-subcat-select-categoria');
  select.innerHTML = categorias.map(cat =>
    `<option value="${cat.id}">${cat.icono || '📦'} ${cat.nombre}</option>`
  ).join('');
  document.getElementById('pres-subcat-input-nombre').value = '';
  document.getElementById('modal-agregar-subcategoria-pres').classList.add('visible');
}

function cerrarModalAgregarSubcategoriaPres() {
  document.getElementById('modal-agregar-subcategoria-pres').classList.remove('visible');
}

function confirmarAgregarSubcategoriaPres() {
  const nombre = document.getElementById('pres-subcat-input-nombre').value.trim();
  const categoriaId = document.getElementById('pres-subcat-select-categoria').value;
  const presupuesto = parseInt(document.getElementById('pres-subcat-input-presupuesto').value);
  if (!nombre || !categoriaId || !presupuesto) return;

  const subcategorias = cargarSubcategoriasPres();
  subcategorias.push({ id: 'id_' + Date.now(), nombre, categoriaId, presupuesto });
  guardarSubcategoriasPres(subcategorias);
  cerrarModalAgregarSubcategoriaPres();
  renderizarPresupuesto();
}

// ── Editar / eliminar subcategoría ────────────────────────────

let subcategoriaPresEditandoId = null;

function abrirModalEditarSubcategoriaPres(subcatId) {
  const subcategorias = cargarSubcategoriasPres();
  const subcat = subcategorias.find(s => s.id === subcatId);
  subcategoriaPresEditandoId = subcatId;
  document.getElementById('pres-edit-subcat-icono').value = subcat.icono || '';
  document.getElementById('pres-edit-subcat-nombre').value = subcat.nombre;
  document.getElementById('pres-edit-subcat-presupuesto').value = subcat.presupuesto || 0;
  document.getElementById('pres-edit-subcat-botones').style.display = 'flex';
  document.getElementById('pres-confirmar-eliminar-subcat-botones').style.display = 'none';
  document.getElementById('modal-editar-subcategoria-pres').classList.add('visible');
}

function cerrarModalEditarSubcategoriaPres() {
  document.getElementById('modal-editar-subcategoria-pres').classList.remove('visible');
}

function confirmarEditarSubcategoriaPres() {
  const nombre = document.getElementById('pres-edit-subcat-nombre').value.trim();
  const icono = document.getElementById('pres-edit-subcat-icono').value.trim() || '';
  const presupuesto = parseInt(document.getElementById('pres-edit-subcat-presupuesto').value) || 0;
  if (!nombre) return;

  const subcategorias = cargarSubcategoriasPres();
  const subcat = subcategorias.find(s => s.id === subcategoriaPresEditandoId);
  subcat.nombre = nombre;
  subcat.icono = icono;
  subcat.presupuesto = presupuesto;
  guardarSubcategoriasPres(subcategorias);
  cerrarModalEditarSubcategoriaPres();
  renderizarPresupuesto();
}

function pedirConfirmacionEliminarSubcategoriaPres() {
  document.getElementById('pres-edit-subcat-botones').style.display = 'none';
  document.getElementById('pres-confirmar-eliminar-subcat-botones').style.display = 'flex';
}

function cancelarEliminarSubcategoriaPres() {
  document.getElementById('pres-edit-subcat-botones').style.display = 'flex';
  document.getElementById('pres-confirmar-eliminar-subcat-botones').style.display = 'none';
}

function confirmarEliminarSubcategoriaPres() {
  const mes = obtenerMesActual();
  let subcategorias = cargarSubcategoriasPres();
  subcategorias = subcategorias.filter(s => s.id !== subcategoriaPresEditandoId);
  guardarSubcategoriasPres(subcategorias);

  let gastos = cargarGastosMes(mes);
  gastos = gastos.filter(g => g.subcategoriaId !== subcategoriaPresEditandoId);
  guardarGastosMes(mes, gastos);

  cerrarModalEditarSubcategoriaPres();
  renderizarPresupuesto();
}

// ── Agregar gasto ──────────────────────────────────────────────

function abrirModalAgregarGasto() {
  cerrarFabMenuPres();
  const categorias = cargarCategoriasPres();
  const select = document.getElementById('pres-gasto-select-categoria');
  select.innerHTML = categorias.map(cat =>
    `<option value="${cat.id}">${cat.icono || '📦'} ${cat.nombre}</option>`
  ).join('');
  actualizarSubcategoriasGasto();
  document.getElementById('pres-gasto-input-titulo').value = '';
  document.getElementById('pres-gasto-input-monto').value = '';
  document.getElementById('modal-agregar-gasto').classList.add('visible');
}

function actualizarSubcategoriasGasto() {
  const categoriaId = document.getElementById('pres-gasto-select-categoria').value;
  const subcategorias = cargarSubcategoriasPres().filter(s => s.categoriaId === categoriaId);
  const select = document.getElementById('pres-gasto-select-subcategoria');
  select.innerHTML = subcategorias.length === 0
    ? '<option value="">Sin subcategorías</option>'
    : subcategorias.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('');
}

function cerrarModalAgregarGasto() {
  document.getElementById('modal-agregar-gasto').classList.remove('visible');
}

function confirmarAgregarGasto() {
  const titulo = document.getElementById('pres-gasto-input-titulo').value.trim();
  const monto = parseInt(document.getElementById('pres-gasto-input-monto').value);
  const categoriaId = document.getElementById('pres-gasto-select-categoria').value;
  const subcategoriaId = document.getElementById('pres-gasto-select-subcategoria').value || null;
  if (!titulo || !monto) return;

  const mes = obtenerMesActual();
  const gastos = cargarGastosMes(mes);
  gastos.push({
    id: 'id_' + Date.now(),
    titulo,
    monto,
    categoriaId,
    subcategoriaId,
    fecha: new Date().toISOString().slice(0, 10),
    jugador: Players.current
  });
  guardarGastosMes(mes, gastos);

  categoriasPresAbiertas.add(categoriaId);
  if (subcategoriaId) subcategoriasPresAbiertas.add(subcategoriaId);
  cerrarModalAgregarGasto();
  renderizarPresupuesto();
}

// ── Eliminar gasto ─────────────────────────────────────────────

function eliminarGasto(gastoId) {
  const mes = obtenerMesActual();
  let gastos = cargarGastosMes(mes);
  gastos = gastos.filter(g => g.id !== gastoId);
  guardarGastosMes(mes, gastos);
  renderizarPresupuesto();
}

// ── Ingresos ──────────────────────────────────────────────────

const DISTRIBUCION_INGRESO = [
  {
    nombre: 'Necesidades',
    porcentaje: 0.50,
    clase: 'necesidades',
    categoriaIds: ['pcat_hogar', 'pcat_familia', 'pcat_salud', 'pcat_transporte', 'pcat_seguros']
  },
  {
    nombre: 'Deuda y futuro',
    porcentaje: 0.30,
    clase: 'deuda',
    categoriaIds: ['pcat_tdcs', 'pcat_inversion']
  },
  {
    nombre: 'Estilo de vida',
    porcentaje: 0.20,
    clase: 'estilo',
    categoriaIds: ['pcat_compras', 'pcat_entretenimiento', 'pcat_suscripciones']
  }
];

let ingresosAbiertos = new Set();

function cargarIngresosMes(mes) {
  const data = Storage.load('presupuesto_ingresos_' + mes) || { mono: [], oso: [] };
  if (typeof data.mono === 'number') data.mono = data.mono > 0 ? [{ id: 'legacy_mono', titulo: 'Ingreso', monto: data.mono }] : [];
  if (typeof data.oso  === 'number') data.oso  = data.oso  > 0 ? [{ id: 'legacy_oso',  titulo: 'Ingreso', monto: data.oso  }] : [];
  return data;
}

function guardarIngresosMes(mes, ingresos) {
  Storage.save('presupuesto_ingresos_' + mes, ingresos);
}

function toggleSeccionIngresos() {
  if (ingresosAbiertos.has('seccion')) ingresosAbiertos.delete('seccion');
  else ingresosAbiertos.add('seccion');
  renderizarIngresos();
}

function toggleIngreso(jugadorId) {
  if (ingresosAbiertos.has(jugadorId)) ingresosAbiertos.delete(jugadorId);
  else ingresosAbiertos.add(jugadorId);
  renderizarIngresos();
}

function renderizarIngresos() {
  const mes      = obtenerMesActual();
  const ingresos = cargarIngresosMes(mes);
  const gastos   = cargarGastosMes(mes);

  const totalMono = (ingresos.mono || []).reduce(function(s, e) { return s + e.monto; }, 0);
  const totalOso  = (ingresos.oso  || []).reduce(function(s, e) { return s + e.monto; }, 0);
  const total = totalMono + totalOso;
  const seccionAbierta = ingresosAbiertos.has('seccion');

  const jugadores = [
    { id: 'mono', emoji: '🐵', nombre: 'Mono', total: totalMono, entries: ingresos.mono || [] },
    { id: 'oso',  emoji: '🐻', nombre: 'Oso',  total: totalOso,  entries: ingresos.oso  || [] }
  ];

  const realesPorRubro = DISTRIBUCION_INGRESO.map(function(d) {
    return gastos
      .filter(function(g) { return d.categoriaIds.includes(g.categoriaId); })
      .reduce(function(s, g) { return s + g.monto; }, 0);
  });
  const totalRealGastos = realesPorRubro.reduce(function(s, v) { return s + v; }, 0);

  const barraMainHtml = totalRealGastos > 0
    ? DISTRIBUCION_INGRESO.map(function(d, i) {
        const pct = Math.round((realesPorRubro[i] / totalRealGastos) * 100);
        return '<div class="pres-barra-seg pres-barra-seg--' + d.clase + '" style="width:' + pct + '%"></div>';
      }).join('')
    : '';

  const filasJugadores = jugadores.map(function(j, i) {
    const abierto = ingresosAbiertos.has(j.id);
    const pct     = total > 0 ? Math.round((j.total / total) * 100) : 0;
    const color   = PALETA_SUBCATEGORIAS[i];
    const entriesHtml = j.entries.length === 0
      ? '<div class="pres-sin-gastos">Sin ingresos registrados</div>'
      : j.entries.map(function(e) {
          return '<div class="pres-gasto-item">' +
            '<div class="pres-gasto-info"><span class="pres-gasto-titulo">' + e.titulo + '</span></div>' +
            '<span class="pres-gasto-monto">' + formatearPesos(e.monto) + '</span>' +
            '<button class="pres-gasto-btn-eliminar" onclick="eliminarIngreso(\'' + j.id + '\',\'' + e.id + '\')">🗑</button>' +
            '</div>';
        }).join('');
    return '<div class="pres-subcat-seccion' + (abierto ? ' abierta' : '') + '">' +
      '<div class="pres-subcat-header" onclick="toggleIngreso(\'' + j.id + '\')">' +
        '<span class="pres-subcat-nombre">' + j.emoji + ' ' + j.nombre + '</span>' +
        '<span class="pres-subcat-montos">' + formatearPesos(j.total) + '</span>' +
        '<button class="prov-btn-accion editar" onclick="event.stopPropagation(); abrirModalAgregarIngreso(\'' + j.id + '\')">＋</button>' +
        '<span class="pres-subcat-flecha">▾</span>' +
      '</div>' +
      '<div class="pres-subcat-gastos' + (abierto ? ' abierta' : '') + '">' + entriesHtml + '</div>' +
    '</div>';
  }).join('');

  const rubrosHtml = DISTRIBUCION_INGRESO.map(function(d) {
    const estimado = Math.round(total * d.porcentaje);
    const real = gastos
      .filter(function(g) { return d.categoriaIds.includes(g.categoriaId); })
      .reduce(function(s, g) { return s + g.monto; }, 0);
    const excede = real > estimado;
    return '<div class="pres-ingreso-item">' +
      '<span class="pres-ingreso-item-icono pres-ingreso-item-icono--' + d.clase + '"></span>' +
      '<span class="pres-ingreso-item-nombre">' + d.nombre + '</span>' +
      '<span class="pres-ingreso-item-montos' + (excede ? ' excede' : '') + '">' + formatearPesos(real) + ' / ' + formatearPesos(estimado) + '</span>' +
    '</div>';
  }).join('');

  document.getElementById('presupuesto-ingresos').innerHTML =
    '<div class="pres-ingresos-seccion' + (seccionAbierta ? ' abierta' : '') + '">' +
      '<div class="pres-categoria-header" onclick="toggleSeccionIngresos()">' +
        '<span class="pres-categoria-icono">💰</span>' +
        '<div class="pres-categoria-info">' +
          '<div class="pres-categoria-nombre">Ingresos del mes</div>' +
          '<div class="pres-categoria-montos">' + formatearPesos(total) + '</div>' +
        '</div>' +
        '<span class="pres-categoria-flecha">▾</span>' +
      '</div>' +
      '<div class="pres-barra-wrap"><div class="pres-barra-fondo pres-barra-segmentada">' + barraMainHtml + '</div></div>' +
      '<div class="pres-ingreso-panel">' + filasJugadores + '<div class="pres-ingreso-rubros">' + rubrosHtml + '</div></div>' +
    '</div>';
}

let ingresoJugadorEditando = null;

function abrirModalAgregarIngreso(jugadorId) {
  ingresoJugadorEditando = jugadorId;
  const emoji  = jugadorId === 'mono' ? '🐵' : '🐻';
  const nombre = jugadorId === 'mono' ? 'Mono' : 'Oso';
  document.getElementById('ingreso-modal-titulo').textContent = emoji + ' Ingreso de ' + nombre;
  document.getElementById('ingreso-input-titulo').value = '';
  document.getElementById('ingreso-input-monto').value  = '';
  document.getElementById('modal-agregar-ingreso').classList.add('visible');
}

function cerrarModalAgregarIngreso() {
  document.getElementById('modal-agregar-ingreso').classList.remove('visible');
  ingresoJugadorEditando = null;
}

function confirmarAgregarIngreso() {
  const titulo = document.getElementById('ingreso-input-titulo').value.trim();
  const monto  = parseInt(document.getElementById('ingreso-input-monto').value) || 0;
  if (!titulo || !monto) return;
  const mes = obtenerMesActual();
  const ingresos = cargarIngresosMes(mes);
  ingresos[ingresoJugadorEditando].push({ id: 'ing_' + Date.now(), titulo: titulo, monto: monto });
  guardarIngresosMes(mes, ingresos);
  ingresosAbiertos.add('seccion');
  ingresosAbiertos.add(ingresoJugadorEditando);
  cerrarModalAgregarIngreso();
  renderizarIngresos();
}

function eliminarIngreso(jugadorId, entradaId) {
  const mes = obtenerMesActual();
  const ingresos = cargarIngresosMes(mes);
  ingresos[jugadorId] = ingresos[jugadorId].filter(function(e) { return e.id !== entradaId; });
  guardarIngresosMes(mes, ingresos);
  renderizarIngresos();
}

// ── Presupuestos Históricos ────────────────────────────────────

let histCategoriasAbiertas = new Set();
let histSubcategoriasAbiertas = new Set();

function toggleHistCategoria(key) {
  if (histCategoriasAbiertas.has(key)) histCategoriasAbiertas.delete(key);
  else histCategoriasAbiertas.add(key);
  renderizarPresupuestosHistoricos();
}

function toggleHistSubcategoria(key) {
  if (histSubcategoriasAbiertas.has(key)) histSubcategoriasAbiertas.delete(key);
  else histSubcategoriasAbiertas.add(key);
  renderizarPresupuestosHistoricos();
}

function renderizarPresupuestosHistoricos() {
  const mesActual = obtenerMesActual();
  const anio = new Date().getFullYear();
  const categorias = cargarCategoriasPres();
  const subcategorias = cargarSubcategoriasPres();

  const mesesConDatos = [];
  for (let m = 1; m <= 12; m++) {
    const clave = `${anio}-${String(m).padStart(2, '0')}`;
    if (clave === mesActual) continue;
    const gastos = cargarGastosMes(clave);
    if (gastos.length > 0) mesesConDatos.push(clave);
  }

  const body = document.getElementById('presupuestos-historicos-body');

  if (mesesConDatos.length === 0) {
    body.innerHTML = '<p style="text-align:center; color:var(--text2); padding:2rem;">No hay meses anteriores con registros.</p>';
    return;
  }

  const nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  body.innerHTML = mesesConDatos.map(mes => {
    const gastos = cargarGastosMes(mes);
    const totalGastado = gastos.reduce((suma, g) => suma + g.monto, 0);
    const totalPresupuestado = subcategorias.reduce((suma, s) => suma + (s.presupuesto || 0), 0);
    const [anioMes, numMes] = mes.split('-');
    const nombreMes = nombresMeses[parseInt(numMes) - 1];

    const filasCategorias = categorias.map(cat => {
      const gastosCat = gastos.filter(g => g.categoriaId === cat.id);
      if (gastosCat.length === 0) return '';

      const subcatsCat = subcategorias.filter(s => s.categoriaId === cat.id);
      const gastadoCat = gastosCat.reduce((suma, g) => suma + g.monto, 0);
      const presupuestoCat = subcatsCat.reduce((suma, s) => suma + (s.presupuesto || 0), 0);
      const porcentajeCat = presupuestoCat > 0 ? Math.min(100, (gastadoCat / presupuestoCat) * 100) : 0;
      const esPeligroCat = gastadoCat > presupuestoCat;
      const catKey = `${mes}_${cat.id}`;
      const catAbierta = histCategoriasAbiertas.has(catKey);

      const filasSubcats = subcatsCat.map(subcat => {
        const gastosSubcat = gastosCat.filter(g => g.subcategoriaId === subcat.id);
        if (gastosSubcat.length === 0) return '';

        const gastadoSubcat = gastosSubcat.reduce((suma, g) => suma + g.monto, 0);
        const porcentajeSubcat = subcat.presupuesto > 0 ? Math.min(100, (gastadoSubcat / subcat.presupuesto) * 100) : 0;
        const esPeligroSubcat = gastadoSubcat > subcat.presupuesto;
        const subcatKey = `${mes}_${subcat.id}`;
        const subcatAbierta = histSubcategoriasAbiertas.has(subcatKey);

        return `
          <div class="pres-subcat-seccion${subcatAbierta ? ' abierta' : ''}">
            <div class="pres-subcat-header" onclick="toggleHistSubcategoria('${subcatKey}')">
              <span class="pres-subcat-nombre">${subcat.icono ? subcat.icono + ' ' : ''}${subcat.nombre}</span>
              <span class="pres-subcat-montos">${formatearPesos(gastadoSubcat)} / ${formatearPesos(subcat.presupuesto)}</span>
              <span class="pres-subcat-flecha">▾</span>
            </div>
            <div class="pres-barra-wrap">
              <div class="pres-barra-fondo">
                <div class="pres-barra-relleno${esPeligroSubcat ? ' peligro' : ''}" style="width:${porcentajeSubcat}%"></div>
              </div>
            </div>
            <div class="pres-subcat-gastos${subcatAbierta ? ' abierta' : ''}">
              ${gastosSubcat.map(g => `
                <div class="pres-gasto-item">
                  <span class="pres-gasto-jugador">${Players.list[g.jugador]?.emoji || '👤'}</span>
                  <div class="pres-gasto-info">
                    <span class="pres-gasto-titulo">${g.titulo}</span>
                  </div>
                  <span class="pres-gasto-monto">${formatearPesos(g.monto)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="pres-categoria${catAbierta ? ' abierta' : ''}">
          <div class="pres-categoria-header" onclick="toggleHistCategoria('${catKey}')">
            <span class="pres-categoria-icono">${cat.icono || '📦'}</span>
            <div class="pres-categoria-info">
              <div class="pres-categoria-nombre">${cat.nombre}</div>
              <div class="pres-categoria-montos">queda ${formatearPesos(Math.max(0, presupuestoCat - gastadoCat))} de ${formatearPesos(presupuestoCat)}</div>
            </div>
            <span class="pres-categoria-flecha">▾</span>
          </div>
          <div class="pres-barra-wrap">
            <div class="pres-barra-fondo">
              <div class="pres-barra-relleno${esPeligroCat ? ' peligro' : ''}" style="width:${porcentajeCat}%"></div>
            </div>
          </div>
          <div class="pres-gastos-lista">
            ${filasSubcats}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="hist-mes">
        <div class="hist-mes-header">
          <span class="hist-mes-nombre">${nombreMes} ${anioMes}</span>
          <span class="hist-mes-total">quedan ${formatearPesos(Math.max(0, totalPresupuestado - totalGastado))} de ${formatearPesos(totalPresupuestado)}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; padding:0.75rem;">
          ${filasCategorias}
        </div>
      </div>
    `;
  }).join('');
}
