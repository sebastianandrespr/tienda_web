let currentSection = 'users';
let allProductTypes = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Initial load
    showSection('users');
    loadProductTypes();
});

async function loadProductTypes() {
    allProductTypes = await api.getProductTypes();
}

function setActiveButton(section) {
    const buttons = {
        users: document.getElementById('btn-users'),
        sales: document.getElementById('btn-sales'),
        inventory: document.getElementById('btn-inventory'),
        'add-product': document.getElementById('btn-add-product')
    };

    Object.values(buttons).forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-primary/10', 'text-primary', 'font-bold');
            btn.classList.add('text-slate-600', 'dark:text-slate-400');
        }
    });

    if (buttons[section]) {
        buttons[section].classList.add('bg-primary/10', 'text-primary', 'font-bold');
        buttons[section].classList.remove('text-slate-600', 'dark:text-slate-400');
    }
}

async function showSection(section) {
    currentSection = section;
    const container = document.getElementById('content-container');
    const title = document.getElementById('section-title');
    setActiveButton(section);

    if (section === 'users') {
        title.innerText = 'Gestión de Clientes';
        container.innerHTML = `<div class="p-8 text-center"><p class="animate-pulse text-slate-500">Cargando clientes...</p></div>`;
        const users = await api.getAllCustomers();
        renderUsers(users);
    } else if (section === 'sales') {
        title.innerText = 'Control de Ventas';
        container.innerHTML = `<div class="p-8 text-center"><p class="animate-pulse text-slate-500">Cargando ventas...</p></div>`;
        const sales = await api.getAllSales();
        renderSales(sales);
    } else if (section === 'inventory') {
        title.innerText = 'Inventario de Productos';
        container.innerHTML = `<div class="p-8 text-center"><p class="animate-pulse text-slate-500">Cargando inventario...</p></div>`;
        const products = await api.getProducts();
        renderInventory(products);
    } else if (section === 'add-product') {
        title.innerText = 'Nuevo Producto';
        renderProductForm(); // Reusable form for adding
    }
}

function renderUsers(users) {
    const container = document.getElementById('content-container');
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th class="px-6 py-4 font-bold">Cliente</th>
                        <th class="px-6 py-4 font-bold">Email</th>
                        <th class="px-6 py-4 font-bold">Teléfono</th>
                        <th class="px-6 py-4 font-bold text-center">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    ${users.map(u => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td class="px-6 py-4">
                                <p class="font-bold">${u.nombres} ${u.apellidos}</p>
                                <p class="text-[10px] text-slate-500">ID: ${u.id_cliente}</p>
                            </td>
                            <td class="px-6 py-4">${u.email}</td>
                            <td class="px-6 py-4">${u.telefono || '-'}</td>
                            <td class="px-6 py-4 text-center">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${u.estado ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
                                    ${u.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderSales(sales) {
    const container = document.getElementById('content-container');
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th class="px-6 py-4 font-bold">Venta ID</th>
                        <th class="px-6 py-4 font-bold">Cliente</th>
                        <th class="px-6 py-4 font-bold">Fecha</th>
                        <th class="px-6 py-4 font-bold text-right">Total</th>
                        <th class="px-6 py-4 font-bold text-center">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    ${sales.map(s => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td class="px-6 py-4 font-bold">#${s.id_venta}</td>
                            <td class="px-6 py-4">
                                <p class="font-bold">${s.cliente ? `${s.cliente.nombres} ${s.cliente.apellidos}` : 'N/A'}</p>
                                <p class="text-[10px] text-slate-500">${s.metodo_pago || 'N/A'}</p>
                            </td>
                            <td class="px-6 py-4">${new Date(s.fecha).toLocaleDateString()}</td>
                            <td class="px-6 py-4 text-right font-bold text-primary">$${parseFloat(s.total).toLocaleString()}</td>
                            <td class="px-6 py-4 text-center">
                                <select onchange="changeSaleStatus(${s.id_venta}, this.value)" 
                                    class="bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-[11px] font-black uppercase tracking-wider px-3 py-1.5 focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer">
                                    <option value="PENDIENTE" ${s.estado?.toUpperCase() === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                                    <option value="COMPLETADO" ${s.estado?.toUpperCase() === 'COMPLETADO' ? 'selected' : ''}>Completado</option>
                                    <option value="CANCELADO" ${s.estado?.toUpperCase() === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                                    <option value="ENVIADO" ${s.estado?.toUpperCase() === 'ENVIADO' ? 'selected' : ''}>Enviado</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

window.changeSaleStatus = async (saleId, newStatus) => {
    try {
        await api.updateSale(saleId, { estado: newStatus });
        showToast(`Estado de venta #${saleId} actualizado a ${newStatus}`, 'success');
    } catch (error) {
        showToast('Error al actualizar estado: ' + error.message, 'error');
        // Reload section to revert UI if failed
        showSection('sales');
    }
};

function renderInventory(products) {
    const container = document.getElementById('content-container');
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th class="px-6 py-4 font-bold">Imagen</th>
                        <th class="px-6 py-4 font-bold">Producto</th>
                        <th class="px-6 py-4 font-bold text-center">Stock</th>
                        <th class="px-6 py-4 font-bold text-right">Precio</th>
                        <th class="px-6 py-4 font-bold text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    ${products.map(p => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="size-12 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <img src="${p.imagen_url || 'https://via.placeholder.com/100'}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/100?text=S/I'">
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <p class="font-bold">${p.nombre}</p>
                                <p class="text-[10px] text-slate-500">${p.codigo || 'Sin código'}</p>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="font-medium ${p.stock <= 5 ? 'text-rose-500 font-bold' : ''}">${p.stock}</span>
                            </td>
                            <td class="px-6 py-4 text-right font-bold text-primary">
                                $${parseFloat(p.precio).toLocaleString()}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <button onclick='showEditForm(${JSON.stringify(p).replace(/'/g, "&#39;")})' class="p-2 text-slate-400 hover:text-primary transition-colors">
                                    <span class="material-symbols-outlined">edit_square</span>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

window.showEditForm = (product) => {
    const title = document.getElementById('section-title');
    title.innerText = `Editando: ${product.nombre}`;
    renderProductForm(product);
};

function renderProductForm(product = null) {
    const container = document.getElementById('content-container');
    const isEdit = !!product;

    container.innerHTML = `
        <div class="flex flex-col gap-6 max-w-2xl mx-auto">
            ${isEdit ? `
                <button onclick="showSection('inventory')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-all w-fit mb-2">
                    <span class="material-symbols-outlined text-sm">arrow_back</span>
                    Volver al Inventario
                </button>
            ` : ''}
            
            <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <form id="product-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2 space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="nombre">Nombre del Producto</label>
                        <input class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" name="nombre" type="text" placeholder="Ej: Camiseta Urban Plus" value="${product?.nombre || ''}" required />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="precio">Precio ($)</label>
                        <input class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-primary" name="precio" type="number" step="0.01" value="${product?.precio || '0.00'}" required />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="stock">Stock Disponible</label>
                        <input class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" name="stock" type="number" value="${product?.stock || '0'}" required />
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="id_tipo_producto">Categoría</label>
                        <select class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" name="id_tipo_producto" required>
                            <option value="">Seleccione...</option>
                            ${allProductTypes.map(t => `<option value="${t.id_tipo_producto}" ${product?.id_tipo_producto === t.id_tipo_producto ? 'selected' : ''}>${t.nombre}</option>`).join('')}
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="codigo">Código / Referencia</label>
                        <input class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium" name="codigo" type="text" placeholder="REF-000" value="${product?.codigo || ''}" />
                    </div>

                    <div class="md:col-span-2 space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="imagen_url">URL de la Imagen</label>
                        <input class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-xs" name="imagen_url" type="url" placeholder="https://ejemplo.com/foto.jpg" value="${product?.imagen_url || ''}" />
                    </div>

                    <div class="md:col-span-2 space-y-1.5">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400" for="descripcion">Descripción</label>
                        <textarea class="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3.5 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] font-medium text-sm" name="descripcion" placeholder="Detalles del producto...">${product?.descripcion || ''}</textarea>
                    </div>

                    <div class="md:col-span-2 pt-6">
                        <button class="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 font-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
                            <span class="material-symbols-outlined text-xl">${isEdit ? 'save' : 'add_circle'}</span>
                            ${isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                        </button>
                        <div id="form-message" class="text-center text-sm mt-4 font-bold"></div>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('form-message');
        msg.innerText = isEdit ? 'Actualizando...' : 'Guardando...';
        msg.className = 'text-center text-sm mt-4 text-slate-500';

        const formData = new FormData(e.target);
        const data = {
            nombre: formData.get('nombre'),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock')),
            id_tipo_producto: parseInt(formData.get('id_tipo_producto')),
            codigo: formData.get('codigo'),
            imagen_url: formData.get('imagen_url'),
            descripcion: formData.get('descripcion'),
            estado: true
        };

        try {
            if (isEdit) {
                await api.updateProduct(product.id_producto, data);
                showToast('¡Producto actualizado correctamente!', 'success');
                setTimeout(() => showSection('inventory'), 1500);
            } else {
                await api.addProduct(data);
                showToast('¡Producto creado con éxito!', 'success');
                e.target.reset();
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}
