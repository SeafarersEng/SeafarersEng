// ======================== SUBSCRIPTIONS (Hardcoded) ========================
const subscriptions = {
    "mts": { key: "mts@2026", startDate: "2026-06-01", expireDate: "2026-07-01", name: "mts" },
    "student02": { key: "std02@2026", startDate: "2026-01-15", expireDate: "2026-02-15", name: "Student 02" },
    "student03": { key: "std03@2026", startDate: "2026-02-01", expireDate: "2026-03-01", name: "Student 03" },
    "student04": { key: "std04@2026", startDate: "2026-02-10", expireDate: "2026-03-10", name: "Student 04" },
    "student05": { key: "std05@2026", startDate: "2026-03-01", expireDate: "2026-04-01", name: "Student 05" },
    "student06": { key: "std06@2026", startDate: "2026-03-15", expireDate: "2026-04-15", name: "Student 06" },
    "student07": { key: "std07@2026", startDate: "2026-04-01", expireDate: "2026-05-01", name: "Student 07" },
    "student08": { key: "std08@2026", startDate: "2026-04-15", expireDate: "2026-05-15", name: "Student 08" },
    "student09": { key: "std09@2026", startDate: "2026-05-01", expireDate: "2026-06-01", name: "Student 09" },
    "student10": { key: "std10@2026", startDate: "2026-05-15", expireDate: "2026-06-15", name: "Student 10" },
    // Admin account
    "zkp": { key: "set1@2026", startDate: "2026-01-01", expireDate: "2030-12-31", name: "Admin" }
};

const ADMIN = { user: "zkp", pass: "zello@1500" }; // Admin login credentials

// ======================== ADMIN LOGIN ========================
function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsersFromSubscriptions();
    } else {
        alert('❌ Invalid credentials');
    }
}

function adminLogout() {
    document.getElementById('adminAuth').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// ======================== LOAD USERS FROM SUBSCRIPTIONS ========================
function loadUsersFromSubscriptions() {
    const users = [];
    for (const [username, data] of Object.entries(subscriptions)) {
        users.push({ username, ...data });
    }
    displayUsers(users);
}

function displayUsers(users) {
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;
    if (users.length === 0) {
        html += '<p>ကျောင်းသားမရှိသေးပါ</p>';
    } else {
        html += `<table><tr><th>Username</th><th>Password</th><th>Start</th><th>Expire</th><th>Status</th></tr>`;
        const today = new Date(); today.setHours(0,0,0,0);
        users.forEach(u => {
            const start = new Date(u.startDate);
            const exp = new Date(u.expireDate);
            let status = '✅ Active';
            if (today < start) status = '⏳ Not Started';
            else if (today > exp) status = '❌ Expired';
            html += `<tr>
                <td>${u.username}</td>
                <td>${u.key}</td>
                <td>${u.startDate}</td>
                <td>${u.expireDate}</td>
                <td>${status}</td>
            </tr>`;
        });
        html += '</table>';
    }
    document.getElementById('userTable').innerHTML = html;
    document.getElementById('statsContainer').innerHTML = `<div class="stat-card"><h4>Total</h4><p>${users.length}</p></div>`;
}
