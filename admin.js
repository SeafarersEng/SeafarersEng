const ADMIN = { user: "zkp", pass: "zello@1500" };

function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAllUsers();
    } else { alert('❌ Invalid credentials'); }
}

async function loadAllUsers() {
    let allUsers = [];

    // 1. users.json မှ ဖတ်မယ်
    try {
        const response = await fetch('users.json');
        const remoteUsers = await response.json();
        allUsers = allUsers.concat(remoteUsers);
    } catch (e) {
        console.log('users.json not found');
    }

    // 2. localStorage မှ ဖတ်မယ်
    const localUsers = JSON.parse(localStorage.getItem('mept_all_users') || '[]');
    allUsers = allUsers.concat(localUsers);

    displayUsers(allUsers);
}

function displayUsers(users) {
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;
    html += `<table><tr><th>Username</th><th>Password</th><th>Expire</th><th>Status</th></tr>`;
    const today = new Date(); today.setHours(0,0,0,0);
    users.forEach(u => {
        const exp = new Date(u.expireDate);
        const status = today > exp ? '❌ Expired' : '✅ Active';
        html += `<tr><td>${u.username}</td><td>${u.password}</td><td>${u.expireDate}</td><td>${status}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('userTable').innerHTML = html;
}
