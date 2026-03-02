const SUPABASE_URL = 'https://nelkiticrkpbzludamjm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbGtpdGljcmtwYnpsdWRhbWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDM1ODksImV4cCI6MjA4Nzc3OTU4OX0.ZST_kXLisuLxGdMkioKmr6j1jea-VzVN1LEHxcw9A8o';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

async function getProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/producto?select=*`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

async function registerCustomer(customerData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cliente`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(customerData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar cliente');
        }
        return await response.json();
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
}

async function getProductTypes() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tipo_producto?select=*`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Failed to fetch product types');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

async function loginCustomer(email, phone) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cliente?email=eq.${email}&telefono=eq.${phone}&select=*`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Error en el servidor');
        const data = await response.json();
        if (data.length === 0) throw new Error('Credenciales incorrectas (Email o Teléfono)');
        return data[0];
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
}

async function updateCustomer(id, customerData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cliente?id_cliente=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...headers,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(customerData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar perfil');
        }
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Update Error:', error);
        throw error;
    }
}

async function getAllCustomers() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cliente?select=*`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Failed to fetch customers');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

async function getAllSales() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/venta?select=*,cliente(nombres,apellidos,email)`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Failed to fetch sales');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

async function addProduct(productData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/producto`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al agregar producto');
        }
        return await response.json();
    } catch (error) {
        console.error('Add Product Error:', error);
        throw error;
    }
}

async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/producto?id_producto=eq.${id}`, {
            method: 'PATCH',
            headers: {
                ...headers,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar producto');
        }
        return await response.json();
    } catch (error) {
        console.error('Update Product Error:', error);
        throw error;
    }
}

// Wishlist methods
async function getWishlist(clientId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist?id_cliente=eq.${clientId}&select=*,producto(*)`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        return await response.json();
    } catch (error) {
        console.error('Wishlist Error:', error);
        return [];
    }
}

async function addToWishlistApi(clientId, productId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist`, {
            method: 'POST',
            headers: {
                ...headers,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ id_cliente: clientId, id_producto: productId })
        });
        if (!response.ok) {
            const error = await response.json();
            // 23505 is the error code for unique violation in Postgres
            if (error.code === '23505') {
                throw new Error('El producto ya está en tu lista de deseos');
            }
            throw new Error(error.message || 'Error al añadir a favoritos');
        }
        return await response.json();
    } catch (error) {
        console.error('Add Wishlist Error:', error);
        throw error;
    }
}

async function removeFromWishlistApi(wishlistId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist?id_wishlist=eq.${wishlistId}`, {
            method: 'DELETE',
            headers: headers
        });
        if (!response.ok) throw new Error('Error al eliminar de favoritos');
        return true;
    } catch (error) {
        console.error('Delete Wishlist Error:', error);
        throw error;
    }
}

// Global UI Notifications
window.showToast = (message, type = 'success', action = null) => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
        success: 'bg-emerald-500 text-white shadow-emerald-500/20',
        error: 'bg-rose-500 text-white shadow-rose-500/20',
        info: 'bg-slate-900 text-white shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900'
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info'
    };

    toast.className = `${colors[type] || colors.info} px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-slide-up pointer-events-auto transition-all duration-300 opacity-0 translate-y-4`;

    let actionHtml = '';
    if (action) {
        actionHtml = `<button onclick="${action.onClick}" class="ml-2 px-3 py-1 bg-white/20 hover:bg-white/40 rounded-lg text-xs font-black transition-all uppercase tracking-widest">${action.label}</button>`;
    }

    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">${icons[type] || icons.info}</span>
            <p class="text-sm font-bold">${message}</p>
        </div>
        ${actionHtml}
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
    });

    // Remove toast
    const removeTime = action ? 8000 : 4000; // Longer if there is a button
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
    }, removeTime);
};

// CSS for toasts
if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.innerHTML = `
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
    `;
    document.head.appendChild(style);
}

// Export for other scripts
window.api = {
    getProducts,
    getProductTypes,
    registerCustomer,
    loginCustomer,
    updateCustomer,
    getAllCustomers,
    getAllSales,
    addProduct,
    updateProduct,
    getWishlist,
    addToWishlist: addToWishlistApi,
    removeFromWishlist: removeFromWishlistApi
};
