let categoriasAbiertas = new Set();

function cargarProvisiones() {
    return Storage.load('provisiones') || {
        categorias: [...PROVISIONES_DEFAULT.categorias],
        items: [...PROVISIONES_DEFAULT.items]
    };
}

function guardarProvisiones(datos) {
    Storage.save('provisiones', datos);
}

function generarId() {
    return 'id_' + Date.now();
}

function renderizarProvisiones() {
      const datos = cargarProvisiones();
      const contenedor = document.getElementById('prov-body');
      let html = '';

      datos.categorias.forEach(cat => {
          const items = datos.items.filter(item => item.categoria === cat.id);

          html += `
              <div class="prov-cat-header" data-cat-id="${cat.id}">                                                                                                                                                                    
                <span class="prov-cat-icono">${cat.icono || '📦'}</span>                                                                                                                                                                   
                <span class="prov-cat-nombre">${cat.nombre}</span>                                                                                                                                                                                                       
              <div class="prov-cat-acciones">                                                                                                                                                                                      
                <button class="prov-btn-accion editar" onclick="abrirModalEditarCategoria('${cat.id}')">✏</button>
                <button class="prov-btn-accion eliminar" onclick="abrirModalEliminarCategoria('${cat.id}')">🗑</button>
              </div>
                <span class="prov-cat-chevron">›</span>
              </div>
              <div class="prov-cat-body" data-cat-body="${cat.id}">
                  <table class="prov-tabla">
                      <thead>
                          <tr>
                              <th>Artículo</th>
                              <th class="th-cantidad">Cantidad</th>
                              <th class="th-acciones">Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${items.map(item => `
                              <tr class="prov-fila">
                                  <td class="prov-celda" onclick="abrirModalEditar('${item.id}')">${item.nombre}</td>
                                  <td class="prov-celda-cantidad">
                                      <div class="prov-cantidad-wrap">
                                          <button class="prov-cantidad-btn" onclick="cambiarCantidad('${item.id}', -1)">−</button>
                                          <span class="prov-cantidad-valor">${item.cantidad}</span>
                                          <button class="prov-cantidad-btn" onclick="cambiarCantidad('${item.id}', +1)">+</button>
                                      </div>
                                  </td>
                                  <td class="prov-celda-acciones">
                                    <button class="prov-btn-accion editar" onclick="abrirModalEditar('${item.id}')">✏</button>
                                    <button class="prov-btn-accion eliminar" onclick="abrirModalEditar('${item.id}')">🗑</button>
                                  </td>
                              </tr>
                          `).join('')}
                      </tbody>
                  </table>
              </div>
          `;
      });

      contenedor.innerHTML = html;
      activarColapsables();
  }

    function activarColapsables() {
      document.querySelectorAll('.prov-cat-header').forEach(header => {
          const catId = header.dataset.catId;
          const body = document.querySelector(`[data-cat-body="${catId}"]`);
          const estaAbierta = categoriasAbiertas.has(catId);

          if (estaAbierta) {
              body.style.maxHeight = body.scrollHeight + 'px';
          } else {
              header.classList.add('collapsed');
              body.classList.add('collapsed');
              body.style.maxHeight = '0px';
          }

          header.addEventListener('click', function (e) {
              if (e.target.closest('.prov-cat-acciones')) return;
              const estaColapsado = body.classList.contains('collapsed');

              if (estaColapsado) {
                  categoriasAbiertas.add(catId);
                  body.classList.remove('collapsed');
                  body.style.maxHeight = body.scrollHeight + 'px';
                  header.classList.remove('collapsed');
              } else {
                  categoriasAbiertas.delete(catId);
                  body.style.maxHeight = body.scrollHeight + 'px';
                  requestAnimationFrame(() => {
                      body.classList.add('collapsed');
                      body.style.maxHeight = '0px';
                      header.classList.add('collapsed');
                  });
              }
          });
      });
  }

  function cambiarCantidad(itemId, cambio) {
      const datos = cargarProvisiones();
      const item = datos.items.find(i => i.id === itemId);
      item.cantidad = Math.max(0, item.cantidad + cambio);
      guardarProvisiones(datos);
      renderizarProvisiones();
  }

  function toggleFabMenu() {
      document.getElementById('prov-fab-menu').classList.toggle('visible');
  }

  function cerrarFabMenu() {
      document.getElementById('prov-fab-menu').classList.remove('visible');
  }

  function abrirModalAgregar() {
      cerrarFabMenu();
      const datos = cargarProvisiones();
      const select = document.getElementById('prov-select-categoria');

      select.innerHTML = datos.categorias.map(cat =>
          `<option value="${cat.id}">${cat.nombre}</option>`
      ).join('');

      document.getElementById('prov-input-nombre').value = '';
      document.getElementById('prov-modal-agregar').classList.add('visible');
  }

  function cerrarModalAgregar() {
      document.getElementById('prov-modal-agregar').classList.remove('visible');
  }

  function toggleNuevaCategoria() {
      const wrap = document.getElementById('prov-nueva-cat-wrap');
      const visible = wrap.style.display !== 'none';
      wrap.style.display = visible ? 'none' : 'block';
  }

  function confirmarAgregar() {
      const datos = cargarProvisiones();
      const nombreItem = document.getElementById('prov-input-nombre').value.trim();
      if (!nombreItem) return;

      let categoriaId = document.getElementById('prov-select-categoria').value;

      const nuevoItem = {
          id: generarId(),
          categoria: categoriaId,
          nombre: nombreItem,
          hay: false,
          cantidad: 0
      };
      datos.items.push(nuevoItem);
      guardarProvisiones(datos);
      cerrarModalAgregar();
      renderizarProvisiones();
  }

  let itemEditandoId = null;

  function abrirModalEditar(itemId) {
      const datos = cargarProvisiones();
      const item = datos.items.find(i => i.id === itemId);

      itemEditandoId = itemId;
      document.getElementById('prov-input-editar').value = item.nombre;
      document.getElementById('prov-editar-botones').style.display = 'flex';
      document.getElementById('prov-confirmar-eliminar-botones').style.display = 'none';
      document.getElementById('prov-modal-editar').classList.add('visible');
  }

  function cerrarModalEditar() {
      itemEditandoId = null;
      document.getElementById('prov-modal-editar').classList.remove('visible');
  }

  function confirmarEditar() {
      const nombreNuevo = document.getElementById('prov-input-editar').value.trim();
      if (!nombreNuevo) return;

      const datos = cargarProvisiones();
      const item = datos.items.find(i => i.id === itemEditandoId);
      item.nombre = nombreNuevo;

      guardarProvisiones(datos);
      cerrarModalEditar();
      renderizarProvisiones();
  }

  function pedirConfirmacionEliminar() {
      document.getElementById('prov-editar-botones').style.display = 'none';
      document.getElementById('prov-confirmar-eliminar-botones').style.display = 'flex';
  }

  function cancelarEliminar() {
      document.getElementById('prov-editar-botones').style.display = 'flex';
      document.getElementById('prov-confirmar-eliminar-botones').style.display = 'none';
  }

  function confirmarEliminar() {
      const datos = cargarProvisiones();
      datos.items = datos.items.filter(i => i.id !== itemEditandoId);

      guardarProvisiones(datos);
      cerrarModalEditar();
      renderizarProvisiones();
  }

  function abrirModalAgregarCategoria() {
      cerrarFabMenu();
      document.getElementById('prov-cat-input-icono').value = '';
      document.getElementById('prov-cat-input-nombre').value = '';
      document.getElementById('prov-modal-agregar-categoria').classList.add('visible');
  }

  function cerrarModalAgregarCategoria() {
      document.getElementById('prov-modal-agregar-categoria').classList.remove('visible');
  }

  function confirmarAgregarCategoria() {
      const nombre = document.getElementById('prov-cat-input-nombre').value.trim();
      if (!nombre) return;

      const icono = document.getElementById('prov-cat-input-icono').value.trim() || '📦';
      const datos = cargarProvisiones();
      const nuevaCat = { id: generarId(), nombre: nombre, icono: icono };
      datos.categorias.push(nuevaCat);

      guardarProvisiones(datos);
      cerrarModalAgregarCategoria();
      renderizarProvisiones();
      abrirModalAgregarConCategoria(nuevaCat.id);
  }

  function abrirModalAgregarConCategoria(categoriaId) {
      const datos = cargarProvisiones();
      const select = document.getElementById('prov-select-categoria');

      select.innerHTML = datos.categorias.map(cat =>
          `<option value="${cat.id}">${cat.icono || '📦'} ${cat.nombre}</option>`
      ).join('');

      select.value = categoriaId;
      document.getElementById('prov-input-nombre').value = '';
      document.getElementById('prov-modal-agregar').classList.add('visible');
  }

  let categoriaEditandoId = null;

  function abrirModalEditarCategoria(catId) {
      const datos = cargarProvisiones();
      const cat = datos.categorias.find(c => c.id === catId);
      categoriaEditandoId = catId;
      document.getElementById('prov-edit-cat-icono').value = cat.icono || '';
      document.getElementById('prov-edit-cat-nombre').value = cat.nombre;
      document.getElementById('prov-modal-editar-categoria').classList.add('visible');
  }

  function cerrarModalEditarCategoria() {
      document.getElementById('prov-modal-editar-categoria').classList.remove('visible');
  }

  function confirmarEditarCategoria() {
      const nombre = document.getElementById('prov-edit-cat-nombre').value.trim();
      if (!nombre) return;
      const icono = document.getElementById('prov-edit-cat-icono').value.trim() || '📦';

      const datos = cargarProvisiones();
      const cat = datos.categorias.find(c => c.id === categoriaEditandoId);
      cat.nombre = nombre;
      cat.icono = icono;

      guardarProvisiones(datos);
      cerrarModalEditarCategoria();
      renderizarProvisiones();
  }

  function abrirModalEliminarCategoria(catId) {
      const datos = cargarProvisiones();
      const cat = datos.categorias.find(c => c.id === catId);
      const cantidadItems = datos.items.filter(i => i.categoria === catId).length;
      categoriaEditandoId = catId;

      document.getElementById('prov-eliminar-cat-texto').textContent =
          `¿Eliminar "${cat.nombre}"? También se eliminarán sus ${cantidadItems} artículo(s).`;
      document.getElementById('prov-modal-eliminar-categoria').classList.add('visible');
  }

  function cerrarModalEliminarCategoria() {
      document.getElementById('prov-modal-eliminar-categoria').classList.remove('visible');
  }

  function confirmarEliminarCategoria() {
      const datos = cargarProvisiones();
      datos.categorias = datos.categorias.filter(c => c.id !== categoriaEditandoId);
      datos.items = datos.items.filter(i => i.categoria !== categoriaEditandoId);

      guardarProvisiones(datos);
      cerrarModalEliminarCategoria();
      renderizarProvisiones();
  }