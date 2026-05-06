
const API = 'https://locallybuiltrestapi.onrender.com';

/* ── Inject modal HTML ──────────────────── */
document.body.insertAdjacentHTML('beforeend', `
  <!-- SEARCH modal -->
  <div class="modal-overlay" id="modal-search">
    <div class="modal-box">
      <div class="modal-header">
        <h3>&#128269; Search Interns</h3>
        <button class="modal-close" onclick="closeModal('search')">&times;</button>
      </div>
      <div class="modal-body">
        <label>Search by name, country or email</label>
        <input type="text" id="s-query" placeholder="e.g. Fatou, Senegal, gmail…" autocomplete="off"/>
        <div class="search-results" id="s-results" style="display:none"></div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal('search')">Close</button>
        <button class="btn-submit" onclick="doSearch()">Search</button>
      </div>
    </div>
  </div>

  <!-- ADD modal -->
  <div class="modal-overlay" id="modal-add">
    <div class="modal-box">
      <div class="modal-header">
        <h3>&#43; Add Intern</h3>
        <button class="modal-close" onclick="closeModal('add')">&times;</button>
      </div>
      <div class="modal-body">
        <label>Full Name</label>
        <input type="text" id="a-name" placeholder="e.g. Amara Diop"/>
        <label>Gender</label>
        <select id="a-gender">
          <option value="">— select —</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <label>Age</label>
        <input type="number" id="a-age" placeholder="e.g. 22" min="16" max="60"/>
        <label>Country</label>
        <input type="text" id="a-country" placeholder="e.g. Tanzania"/>
        <label>Phone</label>
        <input type="text" id="a-phone" placeholder="e.g. +255 712 345 678"/>
        <label>Email</label>
        <input type="email" id="a-email" placeholder="e.g. amara@email.com"/>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal('add')">Cancel</button>
        <button class="btn-submit" id="a-submit" onclick="doAdd()">Add Intern</button>
      </div>
    </div>
  </div>

  <!-- UPDATE modal -->
  <div class="modal-overlay" id="modal-update">
    <div class="modal-box">
      <div class="modal-header">
        <h3>&#9998; Update Intern</h3>
        <button class="modal-close" onclick="closeModal('update')">&times;</button>
      </div>
      <div class="modal-body">
        <label>Intern ID</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="u-id" placeholder="Enter ID…" style="flex:1"/>
          <button class="btn-submit" style="padding:9px 14px" onclick="loadForUpdate()">Load</button>
        </div>
        <div id="u-fields" style="display:none">
          <label>Full Name</label>
          <input type="text" id="u-name" placeholder="Full Name"/>
          <label>Gender</label>
          <select id="u-gender">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <label>Age</label>
          <input type="number" id="u-age" min="16" max="60"/>
          <label>Country</label>
          <input type="text" id="u-country"/>
          <label>Phone</label>
          <input type="text" id="u-phone"/>
          <label>Email</label>
          <input type="email" id="u-email"/>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal('update')">Cancel</button>
        <button class="btn-submit" id="u-submit" onclick="doUpdate()" disabled>Save Changes</button>
      </div>
    </div>
  </div>

  <!-- DELETE modal -->
  <div class="modal-overlay" id="modal-delete">
    <div class="modal-box">
      <div class="modal-header">
        <h3>&#128465; Delete Intern</h3>
        <button class="modal-close" onclick="closeModal('delete')">&times;</button>
      </div>
      <div class="modal-body">
        <label>Intern ID</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="d-id" placeholder="Enter ID…" style="flex:1"/>
          <button class="btn-submit" style="padding:9px 14px" onclick="loadForDelete()">Find</button>
        </div>
        <div class="delete-confirm" id="d-confirm">
          You are about to permanently delete:<br/>
          <strong id="d-name-display"></strong>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal('delete')">Cancel</button>
        <button class="btn-submit danger" id="d-submit" onclick="doDelete()" disabled>Delete</button>
      </div>
    </div>
  </div>

  <!-- Toast container -->
  <div class="toast-container" id="toast-container"></div>
`);

/* ══════════════════════════════════════════
   HAMBURGER & NAV
══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

function closeNav() {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
}

/* ── Wire nav links to modals ───────────── */
document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', e => {
        closeNav();
        const action = link.textContent.trim().toLowerCase();
        if (action === 'search') openModal('search');
        if (action === 'add')    openModal('add');
        if (action === 'update') openModal('update');
        if (action === 'delete') openModal('delete');
    });
});

/* close on overlay click */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            const id = overlay.id.replace('modal-', '');
            closeModal(id);
        }
    });
});

/* ══════════════════════════════════════════
   MODAL OPEN / CLOSE
══════════════════════════════════════════ */
function openModal(name) {
    resetModal(name);
    document.getElementById(`modal-${name}`).classList.add('open');
}

function closeModal(name) {
    document.getElementById(`modal-${name}`).classList.remove('open');
}

function resetModal(name) {
    if (name === 'search') {
        document.getElementById('s-query').value = '';
        const r = document.getElementById('s-results');
        r.style.display = 'none';
        r.innerHTML = '';
    }
    if (name === 'add') {
        ['a-name','a-age','a-country','a-phone','a-email'].forEach(id =>
            document.getElementById(id).value = '');
        document.getElementById('a-gender').value = '';
    }
    if (name === 'update') {
        document.getElementById('u-id').value = '';
        document.getElementById('u-fields').style.display = 'none';
        document.getElementById('u-submit').disabled = true;
    }
    if (name === 'delete') {
        document.getElementById('d-id').value = '';
        document.getElementById('d-confirm').classList.remove('visible');
        document.getElementById('d-submit').disabled = true;
    }
}

/* ══════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════ */
const ICONS = { success: '&#10003;', error: '&#10007;', info: '&#8505;' };

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${ICONS[type]}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/* ══════════════════════════════════════════
   LOAD ALL INTERNS (main table)
══════════════════════════════════════════ */
const grid = document.getElementById('interns-grid');

async function loadInterns() {
    grid.innerHTML = '<p class="status-msg">Loading...</p>';
    try {
        const res     = await fetch(API);
        if (!res.ok) throw new Error();
        const interns = await res.json();

        if (interns.length === 0) {
            grid.innerHTML = '<p class="status-msg">No interns found.</p>';
            return;
        }

        grid.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('interns-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>GENDER</th>
                    <th>AGE</th>
                    <th>COUNTRY</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                </tr>
            </thead>
            <tbody id="interns-body"></tbody>
        `;
        grid.appendChild(table);

        const tbody = document.getElementById('interns-body');
        interns.forEach((intern, index) => {
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 0.05}s`;
            row.innerHTML = `
                <td>${intern.id}</td>
                <td class="td-name">${intern.name}</td>
                <td>${intern.gender}</td>
                <td>${intern.age}</td>
                <td>${intern.country}</td>
                <td>${intern.phone}</td>
                <td>${intern.email}</td>
            `;
            tbody.appendChild(row);
        });

    } catch {
        grid.innerHTML = '<p class="status-msg">Could not connect to API. Make sure your server is running.</p>';
    }
}

loadInterns();

/* ══════════════════════════════════════════
   SEARCH
══════════════════════════════════════════ */
/* also trigger on Enter key */
document.getElementById('s-query').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
});

async function doSearch() {
    const q = document.getElementById('s-query').value.trim();
    if (!q) { showToast('Please enter a search term.', 'info'); return; }

    try {
        const res     = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
        const results = await res.json();
        const box     = document.getElementById('s-results');
        box.style.display = 'block';

        if (!results.length) {
            box.innerHTML = '<div class="no-result">No interns matched your search.</div>';
            showToast('No results found.', 'info');
            return;
        }

        box.innerHTML = `
            <table>
                <thead><tr>
                    <th>ID</th><th>Name</th><th>Gender</th><th>Age</th><th>Country</th><th>Phone</th><th>Email</th>
                </tr></thead>
                <tbody>
                    ${results.map(r => `
                        <tr>
                            <td>${r.id}</td>
                            <td>${r.name}</td>
                            <td>${r.gender}</td>
                            <td>${r.age}</td>
                            <td>${r.country}</td>
                            <td>${r.phone}</td>
                            <td>${r.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        showToast(`${results.length} result${results.length !== 1 ? 's' : ''} found.`, 'info');

    } catch {
        showToast('Search failed. Is your server running?', 'error');
    }
}

/* ══════════════════════════════════════════
   ADD
══════════════════════════════════════════ */
async function doAdd() {
    const name    = document.getElementById('a-name').value.trim();
    const gender  = document.getElementById('a-gender').value;
    const age     = parseInt(document.getElementById('a-age').value);
    const country = document.getElementById('a-country').value.trim();
    const phone   = document.getElementById('a-phone').value.trim();
    const email   = document.getElementById('a-email').value.trim();

    if (!name || !gender || !age || !country || !phone || !email) {
        showToast('Please fill in all fields.', 'error');
        return;
    }

    const btn = document.getElementById('a-submit');
    btn.disabled = true;
    btn.textContent = 'Adding…';

    try {
        const res = await fetch(API, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, gender, age, country, phone, email })
        });

        if (!res.ok) throw new Error();

        const added = await res.json();
        showToast(`${added.name} added successfully!`, 'success');
        closeModal('add');
        loadInterns();

    } catch {
        showToast('Failed to add intern. Check your server.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Add Intern';
    }
}

/* ══════════════════════════════════════════
   UPDATE — step 1: load intern by ID
══════════════════════════════════════════ */
async function loadForUpdate() {
    const id = document.getElementById('u-id').value.trim();
    if (!id) { showToast('Please enter an ID.', 'info'); return; }

    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error('not found');
        const intern = await res.json();

        document.getElementById('u-name').value    = intern.name;
        document.getElementById('u-gender').value  = intern.gender;
        document.getElementById('u-age').value     = intern.age;
        document.getElementById('u-country').value = intern.country;
        document.getElementById('u-phone').value   = intern.phone;
        document.getElementById('u-email').value   = intern.email;

        document.getElementById('u-fields').style.display = 'block';
        document.getElementById('u-submit').disabled = false;
        showToast(`Loaded: ${intern.name}`, 'info');

    } catch {
        showToast(`No intern found with ID ${id}.`, 'error');
        document.getElementById('u-fields').style.display = 'none';
        document.getElementById('u-submit').disabled = true;
    }
}

/* UPDATE — step 2: save changes */
async function doUpdate() {
    const id      = document.getElementById('u-id').value.trim();
    const name    = document.getElementById('u-name').value.trim();
    const gender  = document.getElementById('u-gender').value;
    const age     = parseInt(document.getElementById('u-age').value);
    const country = document.getElementById('u-country').value.trim();
    const phone   = document.getElementById('u-phone').value.trim();
    const email   = document.getElementById('u-email').value.trim();

    if (!name || !gender || !age || !country || !phone || !email) {
        showToast('Please fill in all fields.', 'error');
        return;
    }

    const btn = document.getElementById('u-submit');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    try {
        const res = await fetch(`${API}/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, gender, age, country, phone, email })
        });

        if (!res.ok) throw new Error();

        showToast(`${name} updated successfully!`, 'success');
        closeModal('update');
        loadInterns();

    } catch {
        showToast('Update failed. Check your server.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
    }
}

/* ══════════════════════════════════════════
   DELETE — step 1: find intern by ID
══════════════════════════════════════════ */
async function loadForDelete() {
    const id = document.getElementById('d-id').value.trim();
    if (!id) { showToast('Please enter an ID.', 'info'); return; }

    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error();
        const intern = await res.json();

        document.getElementById('d-name-display').textContent =
            `#${intern.id} — ${intern.name} (${intern.country})`;
        document.getElementById('d-confirm').classList.add('visible');
        document.getElementById('d-submit').disabled = false;
        showToast(`Found: ${intern.name}`, 'info');

    } catch {
        showToast(`No intern found with ID ${id}.`, 'error');
        document.getElementById('d-confirm').classList.remove('visible');
        document.getElementById('d-submit').disabled = true;
    }
}

/* DELETE — step 2: confirm and delete */
async function doDelete() {
    const id  = document.getElementById('d-id').value.trim();
    const btn = document.getElementById('d-submit');
    btn.disabled = true;
    btn.textContent = 'Deleting…';

    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();

        showToast('Intern deleted successfully.', 'success');
        closeModal('delete');
        loadInterns();

    } catch {
        showToast('Delete failed. Check your server.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Delete';
    }
}

loadInterns(); // refresh every 10 seconds
