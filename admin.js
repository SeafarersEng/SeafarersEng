// ======================== ADMIN PANEL (users.json + localStorage) ========================
const ADMIN = { user: "zkp", pass: "zello@1500" };
const STORAGE_KEY = 'mept_all_users';

// ======================== ADMIN LOGIN ========================
function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAllUsers();
    } else {
        alert('❌ Invalid credentials');
    }
}

function adminLogout() {
    document.getElementById('adminAuth').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// ======================== ADD USER (Local Storage) ========================
function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const expireDate = document.getElementById('expireDate').value;

    if (!username || !password || !expireDate) {
        alert('⚠️ အားလုံးဖြည့်ပါ');
        return;
    }

    let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Check if user already exists in localStorage
    if (users.find(u => u.username === username)) {
        alert('⚠️ ဤ Username သည် Local Storage တွင် ရှိပြီးသားဖြစ်သည်');
        return;
    }

    users.push({
        username: username,
        password: password,
        expireDate: expireDate,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    alert('✅ ကျောင်းသားထည့်ပြီးပါပြီ (Local Storage)');

    // Clear form
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('expireDate').value = '';

    loadAllUsers();
}

// ======================== DELETE USER (Local Storage only) ========================
function deleteUser(username) {
    if (!confirm(`"${username}" ကို Local Storage မှ ဖျက်မှာသေချာလား?\n(users.json မှ ဖျက်ရန် GitHub တွင် Edit လုပ်ပါ)`)) return;

    let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    users = users.filter(u => u.username !== username);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    alert(`🗑 "${username}" ကို Local Storage မှ ဖျက်ပြီးပါပြီ`);
    loadAllUsers();
}

// ======================== LOAD ALL USERS (users.json + localStorage) ========================
async function loadAllUsers() {
    let allUsers = [];

    // 1. Fetch from users.json
    try {
        const response = await fetch('users.json');
        const remoteUsers = await response.json();
        allUsers = allUsers.concat(remoteUsers);
    } catch (error) {
        console.log('users.json not found or cannot be loaded');
    }

    // 2. Load from localStorage
    const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    allUsers = allUsers.concat(localUsers);

    // Remove duplicates (by username) – keep the first occurrence (users.json priority)
    const uniqueUsers = [];
    const seen = new Set();
    for (const u of allUsers) {
        if (!seen.has(u.username)) {
            seen.add(u.username);
            uniqueUsers.push(u);
        }
    }

    displayUsers(uniqueUsers);
}

// ======================== DISPLAY USERS ========================
function displayUsers(users) {
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;

    if (users.length === 0) {
        html += '<p>ကျောင်းသားမရှိသေးပါ</p>';
    } else {
        html += `<table>
            <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Expire</th>
                <th>Status</th>
                <th>Action</th>
            </tr>`;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        users.forEach(u => {
            const exp = new Date(u.expireDate);
            const status = today > exp ? '❌ Expired' : '✅ Active';
            html += `<tr>
                <td>${u.username}</td>
                <td>${u.password}</td>
                <td>${u.expireDate}</td>
                <td>${status}</td>
                <td><button class="delete-btn" onclick="deleteUser('${u.username}')">🗑 Delete</button></td>
            </tr>`;
        });
        html += '</table>';
    }

    document.getElementById('userTable').innerHTML = html;
    document.getElementById('statsContainer').innerHTML = `
        <div class="stat-card">
            <h4>Total Students</h4>
            <p>${users.length}</p>
        </div>`;
}

// ======================== EXPORT LOCAL STORAGE TO JSON FILE ========================
function exportToJSON() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (users.length === 0) {
        alert('Local Storage တွင် ကျောင်းသားမရှိပါ');
        return;
    }
    const exportData = users.map(({ username, password, expireDate }) => ({ username, password, expireDate }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_local_backup.json';
    a.click();
    alert('✅ Local Storage ဒေတာကို JSON ဖိုင်အဖြစ် Download ပြုလုပ်ပြီးပါပြီ။');
}
