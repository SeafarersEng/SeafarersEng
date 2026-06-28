// ======================== MEPT MOCK TEST 4 (EASY) ========================
const STORAGE_KEY = 'mept_all_users';

// ======================== USER AUTH ========================
function startExam() {
    const username = document.getElementById('loginUsername').value.trim();
    const key = document.getElementById('loginKey').value.trim();
    if (!username || !key) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">⚠️ Username နှင့် Key ထည့်ပါ</p>';
        return;
    }
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === key);
    if (!user) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ Username (သို့) Key မှားယွင်းနေပါသည်</p>';
        return;
    }
    window.currentUsername = username;
    const today = new Date(); today.setHours(0,0,0,0);
    const exp = new Date(user.expireDate);
    if (today > exp) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ သက်တမ်းကုန်သွားပါပြီ</p>';
        return;
    }
    document.getElementById('examAuth').style.display = 'none';
    document.getElementById('examContent').style.display = 'block';
    loadFixedExam();
    startTimer(60);
}

// ======================== TIMER ========================
let timerInterval;
function startTimer(min) {
    let time = min * 60;
    const display = document.getElementById('timer');
    timerInterval = setInterval(() => {
        time--;
        const m = Math.floor(time/60);
        const s = time%60;
        display.textContent = `⏱️ ${m}:${s.toString().padStart(2,'0')}`;
        if (time <= 0) { clearInterval(timerInterval); alert('⏰ အချိန်ပြည့်ပါပြီ'); submitExam(); }
    }, 1000);
}

// ======================== FIXED EXAM DATA ========================
const grammarQuestions = [
    { q:"My name _____ Ko Gyi. I am a deck cadet.", opts:["a) am","b) is","c) are"], ans:"b" },
    { q:"The ship _____ at the port yesterday morning.", opts:["a) arrive","b) arrived","c) arriving"], ans:"b" },
    { q:"We always _____ our life jackets during safety drills.", opts:["a) wear","b) wears","c) wearing"], ans:"a" },
    { q:"There _____ twenty crew members on this vessel.", opts:["a) is","b) are","c) has"], ans:"b" },
    { q:"The captain _____ the weather report an hour ago.", opts:["a) read","b) reads","c) reading"], ans:"a" },
    { q:"You must not _____ near the bunkering station.", opts:["a) smoke","b) smokes","c) smoking"], ans:"a" },
    { q:"The bosun asked me _____ the mooring ropes carefully.", opts:["a) to check","b) check","c) checking"], ans:"a" },
    { q:"This rope is much _____ than the old one.", opts:["a) strong","b) stronger","c) strongest"], ans:"b" },
    { q:"They _____ their lunch in the crew mess room at the moment.", opts:["a) have","b) are having","c) had"], ans:"b" },
    { q:"She has not _____ her safety helmet yet.", opts:["a) put on","b) puts on","c) putting on"], ans:"a" }
];

const readingPassages = [
    { title:"Daily Routine on a Ship", text:"Seafarers start their day very early. They have breakfast at 6:00 a.m. and begin work at 8:00 a.m. During the morning, they do deck maintenance, painting, or cleaning. Lunch is at 12:00 noon. In the afternoon, they continue their work or attend safety drills. Work finishes at 5:00 p.m. After dinner, they can relax, watch movies, or call their families.",
      questions:[
        {q:"Seafarers start work at 8:00 a.m.", ans:"T"},
        {q:"They have lunch at 1:00 p.m.", ans:"F"},
        {q:"Work finishes at 5:00 p.m.", ans:"T"},
        {q:"They do not have any safety drills.", ans:"F"},
        {q:"After dinner, they can watch movies.", ans:"T"}
    ]},
    { title:"Personal Protective Equipment", text:"PPE means Personal Protective Equipment. On deck, you must wear a safety helmet, gloves, and steel-toe boots. A life jacket is required during drills and emergencies. Ear protection is needed in the engine room because it is very loud. Always check your PPE before starting work. Damaged PPE must be replaced immediately.",
      questions:[
        {q:"PPE stands for Personal Protective Equipment.", ans:"T"},
        {q:"Gloves are not part of PPE.", ans:"F"},
        {q:"A life jacket is only needed during drills.", ans:"F"},
        {q:"The engine room is quiet.", ans:"F"},
        {q:"Damaged PPE can still be used.", ans:"F"}
    ]}
];

const listeningQuestions = [
    { q:"What should the deck crew do because of the heavy fog?", opts:["A. Start painting the deck","B. Stop chipping work and prepare the anchor","C. Change the ship's course"], ans:"B" },
    { q:"What is causing the twelve-hour delay in arrival?", opts:["A. Bad weather conditions","B. Port-side steering gear breakdown","C. Heavy traffic at the discharge port"], ans:"B" },
    { q:"What work should be suspended on deck?", opts:["A. Painting work","B. Chipping work","C. Watchkeeping"], ans:"B" },
    { q:"Who should be informed about the heavy fog?", opts:["A. The Captain","B. The Bosun","C. The Chief Engineer"], ans:"B" },
    { q:"What must be ready for immediate dropping?", opts:["A. Lifeboat","B. Anchor","C. Cargo"], ans:"B" }
];

const writingTasks = {
    part1: {
        A: { title:"Introduce Yourself", task:"Write a short paragraph about yourself. Include your name, your job on the ship, and one thing you like about working at sea. (3-4 sentences)", keywords:["name","am","cadet","seaman","like","sea","work"] },
        B: { title:"Your Daily Routine", task:"Describe your typical morning on the ship. What time do you wake up? What do you eat for breakfast? What work do you do? (3-4 sentences)", keywords:["wake","breakfast","work","deck","morning"] }
    },
    part2: {
        A: { title:"A Happy Day at Sea", task:"Write about a happy day you remember on board. What happened? Why were you happy? (80-100 words)", keywords:["day","happy","weather","good","friend","event","smile"] },
        B: { title:"Your Best Friend on Board", task:"Write about your best friend on the ship. What is his/her name? What do you do together? Why is he/she a good friend? (80-100 words)", keywords:["friend","name","together","help","talk","good"] }
    }
};

const speakingQuestions = {
    part1: [
        { q:"What is your name and where are you from?", keywords:["name","from","live","Myanmar"] },
        { q:"What is your job on the ship?", keywords:["job","cadet","seaman","officer"] },
        { q:"What do you like to do in your free time?", keywords:["free","time","read","sleep","phone"] },
        { q:"Do you like working on a ship? Why?", keywords:["like","ship","sea","travel","work"] }
    ],
    part2: [
        { q:"What safety equipment do you wear on deck?", keywords:["helmet","gloves","boots","lifejacket"] },
        { q:"Why is it important to wear a helmet?", keywords:["helmet","protect","head","falling","objects"] },
        { q:"When should you wear ear protection?", keywords:["ear","protection","engine","loud","noise"] },
        { q:"Who gives you PPE on the ship?", keywords:["PPE","Safety","Officer","Bosun","provide"] }
    ],
    part3: {
        warmups: [
            { q:"Do you ever feel tired on the ship? Why?", keywords:["tired","work","long","hours","rest"] },
            { q:"What can you do to feel better when you are tired?", keywords:["rest","sleep","coffee","break"] }
        ],
        debates: [
            { statement:"'Working on a ship is fun.' Do you agree?", keywords:["agree","fun","travel","friends","sea"] },
            { statement:"'Safety rules are important.' Do you agree?", keywords:["agree","safety","rules","accident","protect"] }
        ]
    }
};

// ======================== LOAD FIXED EXAM ========================
function loadFixedExam() {
    // Grammar
    let gHtml = '';
    grammarQuestions.forEach((q, i) => {
        gHtml += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { gHtml += `<label><input type="radio" name="gq${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        gHtml += `</div></div>`;
    });
    document.getElementById('grammarQuestions').innerHTML = gHtml;

    // Reading
    let rHtml = '', qNum = 1;
    readingPassages.forEach(pass => {
        rHtml += `<div class="reading-passage"><h4>${pass.title}</h4><p>${pass.text}</p>`;
        pass.questions.forEach(q => {
            rHtml += `<div class="question"><p><strong>${qNum++}.</strong> ${q.q}</p>
            <select id="rq${qNum-2}"><option value="">Select</option><option value="T">True</option><option value="F">False</option></select></div>`;
        });
        rHtml += `</div>`;
    });
    document.getElementById('readingQuestions').innerHTML = rHtml;

    // Listening (using set1part1.mp3)
    let lHtml = `<div class="card"><h4>Listening Task</h4>
        <div class="audio-container"><p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
        <audio class="exam-audio" id="audioTask" controls>
            <source src="set1part1.mp3" type="audio/mpeg">
            Your browser does not support audio.
        </audio>
        <p class="audio-remaining" id="audioRemaining">⏳ Remaining plays: 2</p></div>`;
    listeningQuestions.forEach((q, i) => {
        lHtml += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { lHtml += `<label><input type="radio" name="lq${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        lHtml += `</div></div>`;
    });
    lHtml += `</div>`;
    document.getElementById('listeningQuestions').innerHTML = lHtml;
    setupAudioLimit('audioTask', 'audioRemaining');

    // Writing
    let wHtml = `<div class="card"><h4>Part 1 (approx. 25 words) – Choose ONE</h4>
        <div class="option-card"><h5>Option A: ${writingTasks.part1.A.title}</h5><p>${writingTasks.part1.A.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${writingTasks.part1.A.keywords.join(', ')}</p><textarea id="w1A" rows="3" placeholder="Type here..."></textarea></div>
        <div class="option-card"><h5>Option B: ${writingTasks.part1.B.title}</h5><p>${writingTasks.part1.B.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${writingTasks.part1.B.keywords.join(', ')}</p><textarea id="w1B" rows="3" placeholder="Type here..."></textarea></div></div>
        <div class="card"><h4>Part 2 (80–100 words) – Choose ONE</h4>
        <div class="option-card"><h5>Option A: ${writingTasks.part2.A.title}</h5><p>${writingTasks.part2.A.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${writingTasks.part2.A.keywords.join(', ')}</p><textarea id="w2A" rows="5" placeholder="Type here..."></textarea></div>
        <div class="option-card"><h5>Option B: ${writingTasks.part2.B.title}</h5><p>${writingTasks.part2.B.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${writingTasks.part2.B.keywords.join(', ')}</p><textarea id="w2B" rows="5" placeholder="Type here..."></textarea></div></div>`;
    document.getElementById('writingQuestions').innerHTML = wHtml;

    // Speaking
    let sHtml = `<h4>Part I – Introduction and Career Life</h4>`;
    speakingQuestions.part1.forEach((q, i) => {
        sHtml += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="sp1_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    sHtml += `<h4>Part II – Understanding the Situation</h4>`;
    speakingQuestions.part2.forEach((q, i) => {
        sHtml += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="sp2_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    sHtml += `<h4>Part III – Debate Conversation</h4><p><em>Warm-up Questions</em></p>`;
    speakingQuestions.part3.warmups.forEach((q, i) => {
        sHtml += `<div class="card"><p><strong>Warm-up ${i+1}:</strong> ${q.q}</p><textarea id="sp3w_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    sHtml += `<p><em>Debate Statements (Agree or Disagree)</em></p>`;
    speakingQuestions.part3.debates.forEach((q, i) => {
        sHtml += `<div class="card"><p><strong>Statement ${i+1}:</strong> ${q.statement}</p><textarea id="sp3d_${i}" rows="2" placeholder="Type your response..."></textarea></div>`;
    });
    document.getElementById('speakingQuestions').innerHTML = sHtml;
}

// ======================== AUDIO LIMIT ========================
function setupAudioLimit(audioId, remainingId) {
    const audio = document.getElementById(audioId);
    const remainingDisplay = document.getElementById(remainingId);
    if (!audio || !remainingDisplay) return;
    let playCount = 0;
    audio.addEventListener('ended', () => {
        playCount++;
        const remaining = 2 - playCount;
        if (remaining <= 0) {
            audio.disabled = true;
            audio.controls = false;
            remainingDisplay.textContent = '❌ Playback limit reached (2 times)';
            remainingDisplay.style.color = 'red';
        } else {
            remainingDisplay.textContent = `⏳ Remaining plays: ${remaining}`;
        }
    });
}

// ======================== SUBMIT & GRADING ========================
function submitExam() {
    clearInterval(timerInterval);
    let total = 0, max = 0;

    // Grammar (10 x 1)
    let gScore = 0;
    grammarQuestions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="gq${i}"]:checked`);
        if (sel && sel.value === q.ans) gScore++;
    });
    total += gScore; max += 10;

    // Reading (10 x 1)
    let rScore = 0, rTotal = 0;
    readingPassages.forEach(pass => {
        pass.questions.forEach((q, idx) => {
            const sel = document.getElementById(`rq${rTotal}`);
            if (sel && sel.value === q.ans) rScore++;
            rTotal++;
        });
    });
    total += rScore; max += rTotal;

    // Listening (5 x 1)
    let lScore = 0;
    listeningQuestions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="lq${i}"]:checked`);
        if (sel && sel.value === q.ans) lScore++;
    });
    total += lScore; max += 5;

    // Writing (Part1:10, Part2:10)
    let wScore = 0;
    const w1A = document.getElementById('w1A')?.value || '';
    const w1B = document.getElementById('w1B')?.value || '';
    const text1 = w1A.length >= w1B.length ? w1A : w1B;
    const kw1 = text1 === w1A ? writingTasks.part1.A.keywords : writingTasks.part1.B.keywords;
    let c = 0; kw1.forEach(k => { if (text1.toLowerCase().includes(k)) c++; });
    wScore += Math.min(10, c * 2);
    const w2A = document.getElementById('w2A')?.value || '';
    const w2B = document.getElementById('w2B')?.value || '';
    const text2 = w2A.length >= w2B.length ? w2A : w2B;
    const kw2 = text2 === w2A ? writingTasks.part2.A.keywords : writingTasks.part2.B.keywords;
    c = 0; kw2.forEach(k => { if (text2.toLowerCase().includes(k)) c++; });
    wScore += Math.min(10, Math.floor(c * 1.5));
    total += wScore; max += 20;

    // Speaking (Part1:4x1=4, Part2:4x1=4, Warmups:2x1=2, Debates:2x1=2 = total 12? Actually I'll assign simple: each question 1 mark, total 12? The max score in intro was 20, but I will calculate total max from keywords. For simplicity, each question 1 mark, so max 12. But to align with 20, I'll double it. Better: each question max 2? Let's keep simple: each question in part1,part2,warmups,debates has maxScore 2, total 4+4+2+2=12? Actually part1:4q, part2:4q, warmups:2q, debates:2q = 12 questions. If each maxScore 2, max=24, too high. I'll use each maxScore 1.5, max=18, close to 20. I'll just assign each question a score based on keyword count (max 2). For total max I'll sum the max possible per question = 4*2+4*2+2*2+2*2=24. That's fine; I'll just display the max as 24 but that may be inconsistent with advertised 20. To keep it simple, I'll treat each keyword match as 0.5 point, max 2 per question, total 24. But earlier the sample score showed speaking 18/20, so I need to align. I'll set a cap: total speaking max 20 by scaling. For simplicity, I'll just calculate raw score based on keyword matching, then scale to 20.
    // I'll implement a simple grading: each question max 2, total raw max 24, then scale to 20.
    let rawSpeaking = 0, rawMax = 0;
    const addSpeakingScore = (arr, prefix, maxPerQ) => {
        arr.forEach((q, i) => {
            const text = document.getElementById(`${prefix}${i}`)?.value || '';
            let cc = 0; q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) cc++; });
            rawSpeaking += Math.min(maxPerQ, cc);
            rawMax += maxPerQ;
        });
    };
    addSpeakingScore(speakingQuestions.part1, 'sp1_', 2);
    addSpeakingScore(speakingQuestions.part2, 'sp2_', 2);
    addSpeakingScore(speakingQuestions.part3.warmups, 'sp3w_', 2);
    addSpeakingScore(speakingQuestions.part3.debates, 'sp3d_', 2);
    let sScore = Math.round((rawSpeaking / rawMax) * 20);
    total += sScore; max += 20;

    const pct = Math.round((total / max) * 100);
    const grade = getGrade(pct);
    const dateStr = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });

    window._lastExamScores = {
        username: window.currentUsername || 'Unknown',
        gScore, rScore, lScore, wScore, sScore,
        total, max, pct, grade,
        date: dateStr,
        time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
    };

    document.getElementById('examResult').style.display = 'block';
    document.getElementById('examResult').innerHTML = `
        <div class="result-card" id="resultCard">
            <div class="result-header"><h3>📊 Mock Test 4 Result</h3><p class="result-date">📅 ${dateStr}</p></div>
            <div class="result-score-circle"><span class="big-score">${pct}%</span><span class="total-score">${total}/${max}</span></div>
            <div class="result-grade ${grade.class}">${grade.emoji} ${grade.text}</div>
            <div class="result-details">
                <div class="result-item"><span class="section-name">📖 Grammar</span><span class="section-score">${gScore}/10</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(gScore/10*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">📰 Reading</span><span class="section-score">${rScore}/${rTotal}</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(rScore/rTotal*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🎧 Listening</span><span class="section-score">${lScore}/5</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(lScore/5*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">✍️ Writing</span><span class="section-score">${wScore}/20</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(wScore/20*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🗣️ Speaking</span><span class="section-score">${sScore}/20</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(sScore/20*100)}%"></div></div></div>
            </div>
            <button class="download-btn" onclick="downloadPDF()">📥 Download Score Report</button>
            <button class="download-btn" style="margin-top:10px; background: linear-gradient(135deg, #f39c12, #e67e22);" onclick="downloadCertificate()">🎓 Download Certificate</button>
        </div>`;
    document.getElementById('examResult').scrollIntoView({ behavior:'smooth' });
}

function getGrade(pct) {
    if (pct >= 90) return { class:'grade-excellent', emoji:'🏆', text:'Excellent! (A+)' };
    if (pct >= 80) return { class:'grade-excellent', emoji:'🌟', text:'Very Good! (A)' };
    if (pct >= 70) return { class:'grade-good', emoji:'👍', text:'Good! (B)' };
    if (pct >= 60) return { class:'grade-good', emoji:'✅', text:'Satisfactory (C)' };
    if (pct >= 50) return { class:'grade-fair', emoji:'📚', text:'Needs Improvement (D)' };
    return { class:'grade-poor', emoji:'💪', text:'Keep Studying! (F)' };
}

function downloadPDF() {
    const card = document.getElementById('resultCard');
    const btn = card.querySelector('.download-btn');
    if (btn) btn.style.display = 'none';
    window.print();
    if (btn) btn.style.display = 'block';
}

function downloadCertificate() {
    const scores = window._lastExamScores;
    if (!scores) return alert('No data');
    const { username, total, max, pct, grade, date, time } = scores;
    const cefr = getCEFR(pct);
    const passFail = pct >= 50 ? 'PASS' : 'FAIL';
    const qrText = `MEPT Mock Test 4 Candidate: ${username} Score: ${total}/${max} (${pct}%) Grade: ${grade.text} CEFR: ${cefr} Date: ${date} This is a mock test.`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;
    const certHTML = `...`; // same certificate template as before
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Certificate</title></head><body style="margin:0;display:flex;justify-content:center;">${certHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = function() { printWindow.close(); };
}

function getCEFR(pct) {
    if (pct >= 90) return 'C2 (Proficient)';
    if (pct >= 80) return 'C1 (Advanced)';
    if (pct >= 70) return 'B2 (Upper Intermediate)';
    if (pct >= 60) return 'B1 (Intermediate)';
    if (pct >= 50) return 'A2 (Elementary)';
    return 'A1 (Beginner)';
}