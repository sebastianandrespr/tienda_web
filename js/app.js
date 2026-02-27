document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-input');
    const categoriesContainer = document.getElementById('categories-container');
    const cartDot = document.getElementById('cart-dot');
    const accountLink = document.getElementById('account-link');
    const accountText = document.getElementById('account-text');

    // Check if user is logged in for the sidebar
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && accountLink && accountText) {
        accountLink.href = 'perfil.html';
        accountText.innerText = 'Mi Perfil';
    }

    let allProducts = [];
    let allCategories = [];

    // Check cart status
    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
            cartDot.style.display = 'block';
        } else {
            cartDot.style.display = 'none';
        }
    }

    async function loadData() {
        try {
            // Load both in parallel
            const [products, categories] = await Promise.all([
                api.getProducts(),
                api.getProductTypes()
            ]);

            allProducts = products;
            allCategories = categories;

            renderCategories(allCategories);
            renderProducts(allProducts);
        } catch (error) {
            console.error('Error loading data:', error);
            if (productGrid) {
                productGrid.innerHTML = '<p class="text-rose-500 p-4">Error al conectar con la base de datos.</p>';
            }
        }
    }

    function renderCategories(categories) {
        if (!categoriesContainer) return;

        categoriesContainer.innerHTML = categories.map(cat => `
            <a href="#" onclick="filterByCategory(${cat.id_tipo_producto}, '${cat.nombre}')" class="flex items-center justify-between px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                <span class="text-sm font-medium group-hover:text-primary">${cat.nombre}</span>
                <span class="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </a>
        `).join('');
    }

    window.filterByCategory = (typeId, typeName) => {
        const filtered = allProducts.filter(p => p.id_tipo_producto === typeId);
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.innerText = typeName;
        renderProducts(filtered);
    };

    function renderProducts(products) {
        if (!productGrid) return;

        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-full py-20 text-center">
                    <span class="material-symbols-outlined text-6xl text-slate-200">inventory_2</span>
                    <p class="text-slate-500 mt-4">No se encontraron productos.</p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = products.map(product => `
            <div class="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div class="aspect-square bg-slate-100 overflow-hidden relative">
                    <img src="${product.imagen_url || 'https://via.placeholder.com/400'}" alt="${product.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" onerror="this.src='https://via.placeholder.com/400?text=Sin+Imagen'">
                </div>
                <div class="p-4 space-y-2">
                    <h3 class="font-bold text-sm line-clamp-1">${product.nombre}</h3>
                    <p class="text-xs text-slate-500 line-clamp-2">${product.descripcion || ''}</p>
                    <div class="flex items-center justify-between pt-2">
                        <span class="font-bold text-primary">$${parseFloat(product.precio).toLocaleString()}</span>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="size-8 flex items-center justify-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-primary dark:hover:bg-primary transition-colors">
                            <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const index = cart.findIndex(item => item.id_producto === product.id_producto);

        if (index > -1) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        alert(`${product.nombre} añadido al carrito`);
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(query))
            );
            renderProducts(filtered);
        });
    }

    updateCartUI();
    loadData();
});
