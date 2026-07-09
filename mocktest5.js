const STORAGE_KEY = 'mept_all_users';

async function startExam() {
    const username = document.getElementById('loginUsername').value.trim();
    const key = document.getElementById('loginKey').value.trim();
    
    if (!username || !key) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">⚠️ အချက်အလက်များ အပြည့်အစုံ ဖြည့်ပါ</p>';
        return;
    }

    let user = null;
    let isRemote = false;

    // ၁။ users.json (Remote) မှ အရင်စစ်ဆေးမည်
    try {
        const response = await fetch('users.json');
        const remoteUsers = await response.json();
        user = remoteUsers.find(u => u.username === username && u.password === key);
        if (user) isRemote = true;
    } catch (e) { 
        console.log('users.json not available or failed to fetch'); 
    }
    
    // ၂။ Remote မှာ မတွေ့ပါက LocalStorage မှ ထပ်စစ်မည်
    if (!user) {
        const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        user = localUsers.find(u => u.username === username && u.password === key);
    }
    
    // ၃။ အကောင့် လုံးဝမရှိပါက/မှားနေပါက ရပ်တန့်မည်
    if (!user) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ Username သို့မဟုတ် Key မှားယွင်းနေပါသည်</p>';
        return;
    }

    // ၄။ One-Time Key (တစ်ခါသုံးကုဒ်) ဟုတ်မဟုတ် နှင့် သုံးပြီးသားဖြစ်နေလား စစ်ဆေးမည်
    if (user.isOneTime && user.used) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ ဤ One-Time Key သည် အသုံးပြုပြီးသား ဖြစ်နေပါသည်</p>';
        return;
    }

    // ၅။ ရက်စွဲနှင့် သက်တမ်းများကို စစ်ဆေးမည်
    const today = new Date(); 
    today.setHours(0,0,0,0);
    const exp = new Date(user.expireDate);
    const start = user.startDate ? new Date(user.startDate) : null;
    
    if (start && today < start) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ စာမေးပွဲကို ${user.startDate} မှသာ စတင်ဖြေဆိုနိုင်ပါမည်</p>`;
        return;
    }
    if (today > exp) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ သက်တမ်းကုန်ဆုံးသွားပါပြီ (${user.expireDate})</p>`;
        return;
    }

    // ၆။ အကယ်၍ One-Time Key ဖြစ်ပြီး သုံးခွင့်ရသွားပြီဆိုလျှင် 'used: true' ဟု မှတ်သားမည်
    if (user.isOneTime) {
        updateLocalUserStatus(username, key);
    }

    // ၇။ Exam Screen သို့ ပို့ဆောင်မည်
    window.currentUsername = username;
    document.getElementById('examAuth').style.display = 'none';
    document.getElementById('examContent').style.display = 'block';
    
    generateRandomExam();
    startTimer(90);
}

// One-Time Key ကို အသုံးပြုပြီးကြောင်း Local Storage ထဲတွင် Update လုပ်ပေးမည့် Function
function updateLocalUserStatus(username, key) {
    const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const userIndex = localUsers.findIndex(u => u.username === username && u.password === key);
    
    if (userIndex !== -1) {
        localUsers[userIndex].used = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUsers));
    } else {
        // Remote (users.json) ထဲက Key ဖြစ်နေရင်လည်း နောက်တစ်ကြိမ် ထပ်သုံးလို့မရအောင် Local ထဲမှာ 'used: true' နဲ့ သိမ်းထားလိုက်ခြင်း
        localUsers.push({
            username: username,
            password: key,
            isOneTime: true,
            used: true,
            expireDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] // မနက်ဖြန် သက်တမ်းကုန်ထည့်ထားခြင်း
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localUsers));
    }
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

// ======================== FIXED QUESTIONS DATA ========================
const grammarQuestions = [
    { q:"The crew ________ the deck every morning.", opts:["a) cleans","b) clean","c) cleaning"], ans:"a" },
    { q:"My name ________ Aung. I am a seafarer.", opts:["a) is","b) are","c) am"], ans:"a" },
    { q:"The ship ________ at the port yesterday.", opts:["a) arrive","b) arrived","c) arriving"], ans:"b" },
    { q:"We always ________ life jackets on deck.", opts:["a) wear","b) wears","c) wearing"], ans:"a" },
    { q:"There ________ many lifeboats on the ship.", opts:["a) is","b) are","c) has"], ans:"b" },
    { q:"She ________ to the bridge now.", opts:["a) go","b) goes","c) is going"], ans:"c" },
    { q:"The captain ________ the weather report an hour ago.", opts:["a) read","b) reads","c) reading"], ans:"a" },
    { q:"I can ________ English and Burmese.", opts:["a) speak","b) speaks","c) speaking"], ans:"a" },
    { q:"This rope is ________ than that one.", opts:["a) long","b) longer","c) longest"], ans:"b" },
    { q:"The engineer ________ the engine right now.", opts:["a) check","b) checks","c) is checking"], ans:"c" },
    { q:"You must not ________ near the bunkering station.", opts:["a) smoke","b) smokes","c) smoking"], ans:"a" },
    { q:"The bosun asked me ________ the mooring ropes.", opts:["a) to check","b) check","c) checking"], ans:"a" },
    { q:"The sea conditions ________ very rough last night.", opts:["a) was","b) were","c) is"], ans:"b" },
    { q:"She ________ finished her safety training yet.", opts:["a) hasn't","b) haven't","c) didn't"], ans:"a" },
    { q:"The ship will depart ________ Tuesday morning.", opts:["a) on","b) in","c) at"], ans:"a" },
    { q:"He speaks maritime English very ________.", opts:["a) good","b) well","c) better"], ans:"b" },
    { q:"There is too ________ water in the bilge.", opts:["a) many","b) much","c) few"], ans:"b" },
    { q:"The engineers ________ repaired the broken valve.", opts:["a) have","b) has","c) having"], ans:"a" },
    { q:"Don't forget ________ your safety harness before climbing.", opts:["a) to wear","b) wear","c) wearing"], ans:"a" },
    { q:"The crew ________ finished the cleaning yet.", opts:["a) haven't","b) hasn't","c) didn't"], ans:"a" }
];

const readingPassages = [
    {
        title: "Working on a Cruise Ship",
        text: "Working on a cruise ship is very different from other ships. The crew must be friendly and helpful because they deal with thousands of passengers every week. Many workers come from different countries, so English is the main language used on board. The working day can be long, often 10 to 12 hours. However, crew members get free food and a place to sleep. In their free time, they can use the gym, watch movies, or call their families using the internet. Safety is also very important. Every week, there are safety drills for fire and emergency situations. All crew must attend these drills.",
        questions: [
            {q:"Cruise ship crew must be friendly.", ans:"T"},
            {q:"English is rarely used on a cruise ship.", ans:"F"},
            {q:"Workers usually work less than 8 hours a day.", ans:"F"},
            {q:"Crew can use the gym in their free time.", ans:"T"},
            {q:"Safety drills happen every month.", ans:"F"}
        ]
    },
    {
        title: "Importance of English for Seafarers",
        text: "English is the international language of the sea. All seafarers must know basic English to communicate with other crew members, port authorities, and during emergencies. The IMO (International Maritime Organization) has standard phrases called SMCP (Standard Marine Communication Phrases) that all seafarers should use. Understanding English also helps seafarers read safety instructions, charts, and manuals. If a seafarer cannot speak English well, it can be dangerous because they might not understand important orders. That is why many maritime schools teach English as a very important subject.",
        questions: [
            {q:"English is the international language of the sea.", ans:"T"},
            {q:"Seafarers do not need to communicate with port authorities.", ans:"F"},
            {q:"SMCP stands for Standard Marine Communication Phrases.", ans:"T"},
            {q:"Understanding English helps seafarers read safety instructions.", ans:"T"},
            {q:"Not speaking English well has no risks.", ans:"F"}
        ]
    }
];

const listeningQuestions = [
    { q:"What did the Third Engineer complete?", opts:["A. Engine repair","B. Daily inspection of the purifier room","C. Safety drill"], ans:"B" },
    { q:"What did he notice in the number two fuel oil purifier?", opts:["A. Oil leak","B. A slight vibration","C. Blocked filter"], ans:"B" },
    { q:"According to the Second Engineer, what can a small vibration indicate?", opts:["A. Normal operation","B. Bearing failure","C. Oil change"], ans:"B" },
    { q:"Did the Third Engineer log the problem and report it?", opts:["A. Yes, immediately","B. Not yet","C. He did not find any problem"], ans:"B" },
    { q:"How long did the Third Engineer want to wait?", opts:["A. One day","B. One hour","C. One week"], ans:"B" },
    { q:"What did the Second Engineer say about delayed reporting?", opts:["A. It can lead to a major breakdown","B. It is acceptable","C. It saves time"], ans:"A" },
    { q:"What did the Second Engineer ask the Third Engineer to do?", opts:["A. Monitor another hour","B. Log it immediately and check bearings","C. Call the Chief Engineer"], ans:"B" },
    { q:"Where did the Second Engineer want to go together?", opts:["A. To the bridge","B. To check the bearings","C. To the mess room"], ans:"B" },
    { q:"Who is the Second Engineer speaking to?", opts:["A. Chief Engineer","B. Third Engineer","C. Bosun"], ans:"B" },
    { q:"What is the main message of the conversation?", opts:["A. Always follow orders","B. Delayed reporting can cause major problems","C. The purifier is working perfectly"], ans:"B" }
];

const writingTasks = {
    part1: {
        A: { title:"Report a Slippery Deck", task:"Write a short message to the Bosun about a slippery area near the gangway. Explain why it is dangerous. (approx. 25 words)", keywords:["slippery","gangway","bosun","dangerous","wet","report"] },
        B: { title:"Request for PPE", task:"Write a short message to the Safety Officer asking for new gloves because yours are damaged. (approx. 25 words)", keywords:["gloves","damaged","safety","officer","need","replace"] }
    },
    part2: {
        A: { title:"Teamwork on Board", task:"Describe a time when you had to work as a team on the ship. What was the task? How did you help each other? Why was teamwork important? (80-100 words)", keywords:["teamwork","together","help","communication","task","success"] },
        B: { title:"Learning a New Skill", task:"Write about a new skill you learned on the ship. Who taught you? How did you practice? How will this skill help you in your career? (80-100 words)", keywords:["learn","skill","teach","practice","career","helpful"] }
    }
};

const speakingQuestions = {
    part1: [
        { q:"What is your full name and where do you come from?", keywords:["name","from","live","Myanmar"] },
        { q:"What is your job on the ship?", keywords:["job","cadet","seaman","officer"] },
        { q:"How long have you been working at sea?", keywords:["year","month","started","experience"] },
        { q:"What do you like most about your job?", keywords:["like","enjoy","travel","sea","friend"] },
        { q:"What is your favorite meal on the ship?", keywords:["meal","favorite","cook","rice","chicken"] }
    ],
    part2: [
        { q:"What time do you wake up and start work?", keywords:["wake","morning","start","work","watch"] },
        { q:"What do you do during your daily duties?", keywords:["duty","deck","painting","maintenance","cleaning"] },
        { q:"How often do you have safety drills?", keywords:["drill","safety","weekly","monthly","fire"] },
        { q:"What PPE do you wear every day?", keywords:["PPE","helmet","gloves","boots","lifejacket"] },
        { q:"Who do you report to if you find a problem?", keywords:["report","bosun","officer","problem","safety"] }
    ],
    part3: {
        warmups: [
            { q:"Do you think English is important for seafarers? Why?", keywords:["English","important","communication","international","safety"] },
            { q:"What can happen if a seafarer does not speak English well?", keywords:["mistake","dangerous","misunderstand","order"] },
            { q:"How can seafarers improve their English?", keywords:["practice","study","speak","listen","class"] }
        ],
        debates: [
            { statement:"'All seafarers should speak good English.' Do you agree?", keywords:["agree","English","important","safety","communication"] },
            { statement:"'English is more important than other subjects for a seafarer.' Do you agree?", keywords:["agree","disagree","English","subject","important","navigation"] },
            { statement:"'Maritime schools should teach only in English.' Do you agree?", keywords:["agree","disagree","English","school","teach","understand"] },
            { statement:"'Speaking English well can help you get a better job.' Do you agree?", keywords:["agree","English","job","promotion","career"] },
            { statement:"'Learning English is easy for everyone.' Do you agree?", keywords:["agree","disagree","easy","hard","practice"] }
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

    // Listening
    let lHtml = `<div class="card"><h4>Listening Task</h4>
        <div class="audio-container"><p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
        <audio class="exam-audio" id="audioTask" controls>
            <source src="set2part2.mp3" type="audio/mpeg">
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

    // Grammar (20 x 1)
    let gScore = 0;
    grammarQuestions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="gq${i}"]:checked`);
        if (sel && sel.value === q.ans) gScore++;
    });
    total += gScore; max += 20;

    // Reading (10 x 1.5 = 15)
    let rScore = 0, rTotal = 0;
    readingPassages.forEach(pass => {
        pass.questions.forEach((q, idx) => {
            const sel = document.getElementById(`rq${rTotal}`);
            if (sel && sel.value === q.ans) rScore += 1.5;
            rTotal++;
        });
    });
    total += rScore; max += 15;

    // Listening (10 x 2.5 = 25)
    let lScore = 0;
    listeningQuestions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="lq${i}"]:checked`);
        if (sel && sel.value === q.ans) lScore += 2.5;
    });
    total += lScore; max += 25;

    // Writing (Part1:10, Part2:15)
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
    wScore += Math.min(15, Math.floor(c * 1.5));
    total += wScore; max += 25;

    // Speaking (raw max 18, scale to 15)
    let rawSpeaking = 0, rawMax = 0;
    const addSpeakingScore = (arr, prefix, maxPerQ) => {
        arr.forEach((q, i) => {
            const text = document.getElementById(`${prefix}${i}`)?.value || '';
            let cc = 0; q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) cc++; });
            rawSpeaking += Math.min(maxPerQ, cc);
            rawMax += maxPerQ;
        });
    };
    addSpeakingScore(speakingQuestions.part1, 'sp1_', 1);
    addSpeakingScore(speakingQuestions.part2, 'sp2_', 1);
    addSpeakingScore(speakingQuestions.part3.warmups, 'sp3w_', 1);
    addSpeakingScore(speakingQuestions.part3.debates, 'sp3d_', 1);
    let sScore = Math.round((rawSpeaking / rawMax) * 15);
    total += sScore; max += 15;

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
            <div class="result-header"><h3>📊 Mock Test 5 Result</h3><p class="result-date">📅 ${dateStr}</p></div>
            <div class="result-score-circle"><span class="big-score">${pct}%</span><span class="total-score">${total}/${max}</span></div>
            <div class="result-grade ${grade.class}">${grade.emoji} ${grade.text}</div>
            <div class="result-details">
                <div class="result-item"><span class="section-name">📖 Grammar</span><span class="section-score">${gScore}/20</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(gScore/20*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">📰 Reading</span><span class="section-score">${rScore}/15</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(rScore/15*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🎧 Listening</span><span class="section-score">${lScore}/25</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(lScore/25*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">✍️ Writing</span><span class="section-score">${wScore}/25</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(wScore/25*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🗣️ Speaking</span><span class="section-score">${sScore}/15</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(sScore/15*100)}%"></div></div></div>
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
    const qrText = `MEPT Mock Test 5 Candidate: ${username} Score: ${total}/${max} (${pct}%) Grade: ${grade.text} CEFR: ${cefr} Date: ${date} This is a mock test.`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;
    const certHTML = `
    <div style="width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; padding: 40px; background: #ffffff; border: 4px solid #0f4c75; border-radius: 20px; position: relative;">
        <div style="text-align: center; border-bottom: 2px solid #0f4c75; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 3rem;">⚓</div>
           <h1 style="color: #0f4c75; margin: 10px 0 5px; font-size: 2rem;">Certificate of Participation</h1>
            <p style="color: #666; font-size: 1rem;">MEPT Mock Test Platform <br> This is a mock test certificate for self-assessment only</p>
        </div>
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 1.2rem; color: #555;">This is to certify that</p>
            <h2 style="color: #0f4c75; font-size: 2rem; margin: 10px 0;">${username}</h2>
            <p style="font-size: 1rem; color: #555;">has successfully completed the</p>
            <p style="font-size: 1.3rem; font-weight: 700; color: #0f4c75;">Mock Test 5 (A2/B1)</p>
        </div>
        <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
            <div style="text-align: center;"><p style="font-weight: 700; color: #0f4c75;">Score</p><p style="font-size: 1.5rem; font-weight: 700;">${pct}%</p><p>(${total}/${max})</p></div>
            <div style="text-align: center;"><p style="font-weight: 700; color: #0f4c75;">Grade</p><p style="font-size: 1.5rem; font-weight: 700;">${grade.text}</p></div>
            <div style="text-align: center;"><p style="font-weight: 700; color: #0f4c75;">CEFR Level</p><p style="font-size: 1.5rem; font-weight: 700;">${cefr}</p></div>
            <div style="text-align: center;"><p style="font-weight: 700; color: #0f4c75;">Result</p><p style="font-size: 1.5rem; font-weight: 700; color: ${passFail === 'PASS' ? '#28a745' : '#e74c3c'};">${passFail}</p></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border-top: 1px dashed #0f4c75; padding-top: 20px;">
            <div><p style="font-size: 0.9rem; color: #777;">Date: ${date}</p><p style="font-size: 0.9rem; color: #777;">Time: ${time}</p></div>
            <div><img src="${qrURL}" alt="QR Code" style="width: 100px; height: 100px;"></div>
        </div>
        <p style="text-align: center; font-size: 0.8rem; color: #999; margin-top: 30px;">* This is a mock test result for self-assessment only. Not an official certificate.</p>
    </div>`;
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
