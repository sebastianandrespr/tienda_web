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

// Export for other scripts
window.api = { getProducts, getProductTypes, registerCustomer, loginCustomer, updateCustomer };
