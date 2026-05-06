/* ================= API CONFIG ================= */
const BASE = 'https://locallybuiltrestapi.onrender.com';
const API  = `${BASE}/interns`;

/* ================= MODALS ================= */
document.body.insertAdjacentHTML('beforeend', `
<!-- (your modal HTML unchanged) -->
<div class="toast-container" id="toast-container"></div>
`);

/* ================= NAV ================= */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

function closeNav() {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
}

/* ================= TOAST ================= */
const ICONS = { success: '✔', error: '✖', info: 'ℹ' };

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${ICONS[type]}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

/* ================= LOAD INTERNS ================= */
const grid = document.getElementById('interns-grid');

async function loadInterns() {
    grid.innerHTML = '<p>Loading...</p>';

    try {
        const res = await fetch(API);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const interns = await res.json();

        if (!Array.isArray(interns)) {
            throw new Error("Invalid response format");
        }

        if (interns.length === 0) {
            grid.innerHTML = '<p>No interns found.</p>';
            return;
        }

        grid.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Gender</th>
                    <th>Age</th><th>Country</th><th>Phone</th><th>Email</th>
                </tr>
            </thead>
            <tbody>
                ${interns.map(i => `
                    <tr>
                        <td>${i.id}</td>
                        <td>${i.name}</td>
                        <td>${i.gender}</td>
                        <td>${i.age}</td>
                        <td>${i.country}</td>
                        <td>${i.phone}</td>
                        <td>${i.email}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p>Error: ${err.message}</p>`;
    }
}

/* ================= SEARCH ================= */
async function doSearch() {
    const q = document.getElementById('s-query').value.trim();
    if (!q) return showToast("Enter search term", "info");

    try {
        const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
        const results = await res.json();

        console.log("Search results:", results);

    } catch (err) {
        console.error(err);
        showToast("Search failed", "error");
    }
}

/* ================= ADD ================= */
async function doAdd() {
    const name = document.getElementById('a-name').value.trim();
    const gender = document.getElementById('a-gender').value;
    const age = parseInt(document.getElementById('a-age').value);
    const country = document.getElementById('a-country').value.trim();
    const phone = document.getElementById('a-phone').value.trim();
    const email = document.getElementById('a-email').value.trim();

    if (!name || !gender || !age || !country || !phone || !email) {
        return showToast("Fill all fields", "error");
    }

    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, gender, age, country, phone, email })
        });

        if (!res.ok) throw new Error();

        showToast("Added successfully");
        loadInterns();

    } catch (err) {
        console.error(err);
        showToast("Add failed", "error");
    }
}

/* ================= UPDATE ================= */
async function doUpdate() {
    const id = document.getElementById('u-id').value.trim();

    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('u-name').value,
                gender: document.getElementById('u-gender').value,
                age: document.getElementById('u-age').value,
                country: document.getElementById('u-country').value,
                phone: document.getElementById('u-phone').value,
                email: document.getElementById('u-email').value
            })
        });

        if (!res.ok) throw new Error();

        showToast("Updated successfully");
        loadInterns();

    } catch (err) {
        console.error(err);
        showToast("Update failed", "error");
    }
}

/* ================= DELETE ================= */
async function doDelete() {
    const id = document.getElementById('d-id').value.trim();

    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error();

        showToast("Deleted successfully");
        loadInterns();

    } catch (err) {
        console.error(err);
        showToast("Delete failed", "error");
    }
}

/* ================= INIT ================= */
loadInterns();
