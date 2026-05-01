
// Base URL for all API requests
// In production, change this to your live domain e.g. 'https://yoursite.com/api'
const API_URL = 'https://product-github-io.onrender.com//api' // dont forget to change this later

// ===== PROTECT THE PAGE =====
// Read the token that was saved to localStorage when the user logged in
const token = localStorage.getItem('token')

// If there is no token, the user is not logged in — send them back to the login page
if (!token) {
    window.location.href = 'index.html'
    throw new Error('No token') // stops the rest of the script from running

}

// ===== AUTH HEADER HELPER =====
// Every request to a protected route must include the JWT token in the Authorization header
// This function returns the headers object so we don't repeat it everywhere
function authHeader() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // format required by our authMiddleware.js
    }
}
// ===== LOGOUT =====
// When logout is clicked, remove the token from localStorage and go back to login
// Without the token, the user can no longer make authenticated requests
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.href = 'index.html'
})

// POST - Add a Product
document.getElementById('addBtn').addEventListener('click', () => {
    const product_name = document.getElementById('name').value;
    const price = document.getElementById('price').value || 0;
    const cat_product = document.getElementById('catprd').checked;
    const box_product = document.getElementById('boxprd').checked;
    const availability = document.getElementById('boxprd').checked;

    if (!product_name) {
        document.getElementById('message').textContent = 'Name is required.';
        return;
    }

    fetch(`${API_URL}/Products`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ product_name, price: Number(price), cat_product, box_product, availability })
    })
        .then(res => {
            if (res.status === 401) { window.location.href = '/login'; return null; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById('message').textContent = 'Product added!';
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('catprd').checked = false;
            document.getElementById('boxprd').checked = false;
            document.getElementById('avail').checked = false;
        })
        .catch(() => {
            document.getElementById('message').textContent = 'Error adding Product.';
        });
});

// PUT - Update a Product
document.getElementById('updateBtn').addEventListener('click', () => {
    const id = document.getElementById('updateId').value;
    if (!id) {
        document.getElementById('updateMessage').textContent = 'Product _id is required.';
        return;
    }
    const updates = {};
    const product_name = document.getElementById('updateName').value;
    const price = document.getElementById('updatePrice').value || 0;
    const cat_product = document.getElementById('updateCatprd').checked;
    const box_product = document.getElementById('updateBoxprd').checked;
    const availability = document.getElementById('updateAvail').checked;
    const useProp = document.getElementById('updateProp').checked;

    if (product_name) updates.product_name = product_name;
    if (price) updates.price = Number(price);
    if (useProp) updates = { ...updates, cat_product, box_product, availability };

    if (Object.keys(updates).length === 0) {
        document.getElementById('updateMessage').textContent = 'Provide at least one field to update.';
        return;
    }

    fetch(`${API_URL}/Products/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(updates)
    })
        .then(res => {
            if (res.status === 401) { window.location.href = '/login'; return null; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById('updateMessage').textContent = 'Product updated!';
            document.getElementById('updateId').value = "";
            document.getElementById('updateName').value = "";
            document.getElementById('updatePrice').value = "";
            document.getElementById('updateCatprd').checked = false;
            document.getElementById('updateBoxprd').checked = false;
            document.getElementById('updateAvail').checked = false;
            document.getElementById('updateProp').checked = false;
        })
        .catch(() => {
            document.getElementById('updateMessage').textContent = 'Error updating Product.';
        });
});

// DELETE - Delete a Product
document.getElementById('deleteBtn').addEventListener('click', () => {
    const id = document.getElementById('deleteId').value;
    if (!id) {
        document.getElementById('deleteMessage').textContent = 'Product _id is required.';
        return;
    }

    fetch(`${API_URL}/Products/${id}`, { headers: authHeader(), method: 'DELETE', body:JSON.stringify({_id:id})})
        .then(res => {
            if (res.status === 401) { window.location.href = '/login'; return null; }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById('deleteMessage').textContent = 'Product deleted!';
            document.getElementById('deleteId').value = '';
        })
        .catch(() => {
            document.getElementById('deleteMessage').textContent = 'Error deleting Product.';
        });
});

// GET - Fetch all Products
document.getElementById('fetchBtn').addEventListener('click', () => {
    fetch(API_URL+'/Products')
        .then(res => {
            if (res.status === 401) { window.location.href = '/login'; return null; }
            return res.json();
        })
        .then(products => {
            if (!products) return;
            const container = document.getElementById('products');
            container.replaceChildren()
            if (products.length === 0) {
                container.innerHTML = '<p>No Products found.</p>';
                return;
            }
            products.forEach(product => {
                const prdItem = document.createElement("div")
                const isAvailable = ((product.availability) ? "" : "Not") + " Available"
                const productType = ["Other", "Box Product", "Cat Product", "Cat Box Product"][(2 * product.cat_product) + product.box_product]
                prdItem.innerHTML += `<strong>${product.product_name}</strong><hr><p>$${product.price}</p><p>ID:[${product._id}]</p><p>${productType} ${isAvailable}</p>`
                prdItem.classList.add("item")
                container.appendChild(prdItem)
            });
        })
        .catch((e) => {
            document.getElementById('products').innerHTML = '<p>Error fetching Products.</p>';
        });
});