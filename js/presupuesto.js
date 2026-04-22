let categoriasPresAbiertas = new Set();
let subcategoriasPresAbiertas = new Set();

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

function renderizarPresupuesto() {
  const mes = obtenerMesActual();
  const categorias = cargarCategoriasPres();
  const gastos = cargarGastosMes(mes);
  const subcategorias = cargarSubcategoriasPres();

  const totalPresupuestado = subcategorias.reduce((suma, s) => suma + (s.presupuesto || 0), 0);
  const totalGastado = gastos.reduce((suma, g) => suma + g.monto, 0);

  const resumen = document.getElementById('presupuesto-resumen');
  resumen.innerHTML = `
    <div class="presupuesto-resumen-titulo">Mes actual</div>
    <div class="presupuesto-resumen-monto">${formatearPesos(totalGastado)} <span class="presupuesto-resumen-sub">gastado</span></div>
    <div class="presupuesto-resumen-sub">quedan ${formatearPesos(Math.max(0, totalPresupuestado - totalGastado))} de ${formatearPesos(totalPresupuestado)}</div>
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

    const filasSubcategorias = subcatsCat.map(subcat => {
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
              <div class="pres-barra-relleno${esPeligroSubcat ? ' peligro' : ''}" style="width:${porcentajeSubcat}%"></div>
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

    return `
      <div class="pres-categoria${estaAbierta ? ' abierta' : ''}" data-cat-id="${cat.id}">
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
          <div class="pres-barra-fondo">
            <div class="pres-barra-relleno${esPeligroCat ? ' peligro' : ''}" style="width:${porcentajeCat}%"></div>
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
