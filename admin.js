const ADMIN = { user: "zkp", pass: "zello@1500" };
const STORAGE_KEY = 'mept_all_users';

function seedSampleStudent() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (users.length === 0) {
        users.push({
            username: "student1",
            password: "stu1",
            expireDate: "2026-12-31",
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        return true;
    }
    return false;
}

function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        seedSampleStudent();
        loadUsers();
    } else { alert('❌ Invalid credentials'); }
}

function adminLogout() {
    document.getElementById('adminAuth').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const expireDate = document.getElementById('expireDate').value;
    if (!username || !password || !expireDate) { alert('⚠️ အားလုံးဖြည့်ပါ'); return; }
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (users.find(u => u.username === username)) { alert('⚠️ ဤ Username ရှိပြီးသားဖြစ်သည်'); return; }
    users.push({ username, password, expireDate, createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    alert('✅ ကျောင်းသားထည့်ပြီးပါပြီ');
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('expireDate').value = '';
    loadUsers();
}

function deleteUser(username) {
    if (!confirm(`"${username}" ကိုဖျက်မှာသေချာလား?`)) return;
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    users = users.filter(u => u.username !== username);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    loadUsers();
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;
    if (users.length === 0) { html += '<p>ကျောင်းသားမရှိသေးပါ</p>'; }
    else {
        html += `<table><tr><th>Username</th><th>Password</th><th>Expire</th><th>Status</th><th></th></tr>`;
        users.forEach(u => {
            const today = new Date(); today.setHours(0,0,0,0);
            const exp = new Date(u.expireDate);
            const status = today > exp ? '❌' : '✅';
            html += `<tr><td>${u.username}</td><td>${u.password}</td><td>${u.expireDate}</td><td>${status}</td><td><button class="delete-btn" onclick="deleteUser('${u.username}')">Del</button></td></tr>`;
        });
        html += '</table>';
    }
    document.getElementById('userTable').innerHTML = html;
    document.getElementById('statsContainer').innerHTML = `<div class="stat-card"><h4>Total</h4><p>${users.length}</p></div>`;
}