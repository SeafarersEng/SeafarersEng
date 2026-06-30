const STORAGE_KEY = 'mept_all_users';

async function startExam() {
    const username = document.getElementById('loginUsername').value.trim();
    const key = document.getElementById('loginKey').value.trim();
    if (!username || !key) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">⚠️ ဖြည့်ပါ</p>';
        return;
    }

    let user = null;
    try {
        const response = await fetch('users.json');
        const remoteUsers = await response.json();
        user = remoteUsers.find(u => u.username === username && u.password === key);
    } catch (e) { console.log('users.json not available'); }
    if (!user) {
        const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        user = localUsers.find(u => u.username === username && u.password === key);
    }
    if (!user) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ မှားယွင်းနေပါသည်</p>';
        return;
    }

    const today = new Date(); today.setHours(0,0,0,0);
    const exp = new Date(user.expireDate);
    const start = user.startDate ? new Date(user.startDate) : null;
    if (start && today < start) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ ${user.startDate} မှ စတင်နိုင်ပါမည်</p>`;
        return;
    }
    if (today > exp) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ သက်တမ်းကုန်ပါပြီ (${user.expireDate})</p>`;
        return;
    }

    window.currentUsername = username;
    document.getElementById('examAuth').style.display = 'none';
    document.getElementById('examContent').style.display = 'block';
    generateRandomExam();
    startTimer(90);
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

// ======================== RANDOM POOLS ========================
// Grammar (3 sets of 20 questions)
const grammarPools = [
    [
        { q:"My name _____ John.", opts:["a) am","b) is","c) are"], ans:"b" },
        { q:"The ship _____ at the port yesterday.", opts:["a) arrive","b) arrived","c) arriving"], ans:"b" },
        { q:"We always wear life jackets _____ drills.", opts:["a) during","b) in","c) at"], ans:"a" },
        { q:"She _____ the engine room every day.", opts:["a) visit","b) visited","c) visits"], ans:"c" },
        { q:"There _____ many crew on board.", opts:["a) is","b) are","c) has"], ans:"b" },
        { q:"The captain _____ the weather report yesterday.", opts:["a) read","b) reads","c) reading"], ans:"a" },
        { q:"You _____ smoke near the bunkering station.", opts:["a) must not","b) must","c) can"], ans:"a" },
        { q:"The bosun asked me _____ the ropes.", opts:["a) to check","b) check","c) checking"], ans:"a" },
        { q:"This rope is _____ than that one.", opts:["a) strong","b) stronger","c) strongest"], ans:"b" },
        { q:"They _____ lunch in the mess room now.", opts:["a) have","b) are having","c) had"], ans:"b" },
        { q:"He _____ finished his work yet.", opts:["a) hasn't","b) haven't","c) didn't"], ans:"a" },
        { q:"The ship will leave _____ Monday.", opts:["a) on","b) in","c) at"], ans:"a" },
        { q:"She speaks English very _____.", opts:["a) good","b) well","c) better"], ans:"b" },
        { q:"I have _____ been to Singapore.", opts:["a) ever","b) never","c) yet"], ans:"b" },
        { q:"The crew _____ the deck every morning.", opts:["a) cleans","b) clean","c) cleaning"], ans:"a" },
        { q:"_____ you like to work at sea?", opts:["a) Does","b) Do","c) Is"], ans:"b" },
        { q:"The engineer _____ the engine at the moment.", opts:["a) checks","b) is checking","c) checked"], ans:"b" },
        { q:"We arrived _____ the port early.", opts:["a) in","b) at","c) on"], ans:"b" },
        { q:"The sea conditions _____ very rough yesterday.", opts:["a) was","b) were","c) is"], ans:"b" },
        { q:"All crew must _____ the safety rules.", opts:["a) follow","b) follows","c) following"], ans:"a" }
    ],
    [
        { q:"The crew _____ the deck every morning.", opts:["a) cleans","b) clean","c) cleaning"], ans:"a" },
        { q:"The ship will leave the port _____ 5 p.m.", opts:["a) in","b) on","c) at"], ans:"c" },
        { q:"They _____ lunch in the mess room now.", opts:["a) are having","b) have","c) had"], ans:"a" },
        { q:"The captain _____ the weather report yesterday.", opts:["a) reads","b) reading","c) read"], ans:"c" },
        { q:"We always wear life jackets _____ drills.", opts:["a) during","b) in","c) at"], ans:"a" },
        { q:"She _____ the engine room every day.", opts:["a) visit","b) visited","c) visits"], ans:"c" },
        { q:"The crews are _____ the ropes.", opts:["a) checking","b) check","c) checked"], ans:"a" },
        { q:"He didn't _____ the alarm.", opts:["a) hears","b) hear","c) hearing"], ans:"b" },
        { q:"This map is _____ than the old one.", opts:["a) better","b) good","c) best"], ans:"a" },
        { q:"The radio officer is responsible _____ communication.", opts:["a) for","b) to","c) of"], ans:"a" },
        { q:"They must _____ the cargo safely.", opts:["a) load","b) loads","c) loading"], ans:"a" },
        { q:"The weather was very _____ yesterday.", opts:["a) storm","b) stormy","c) storming"], ans:"b" },
        { q:"The captain _____ to the bridge now.", opts:["a) is going","b) goes","c) went"], ans:"a" },
        { q:"We arrived _____ the port early.", opts:["a) in","b) at","c) on"], ans:"b" },
        { q:"The crew _____ finished the cleaning.", opts:["a) have","b) has","c) having"], ans:"a" },
        { q:"He speaks very _____.", opts:["a) clear","b) clearer","c) clearly"], ans:"c" },
        { q:"There are _____ lifejackets on board.", opts:["a) many","b) much","c) little"], ans:"a" },
        { q:"The engineer _____ the engine last night.", opts:["a) checked","b) checks","c) checking"], ans:"a" },
        { q:"They were _____ when the bell rang.", opts:["a) work","b) working","c) worked"], ans:"b" },
        { q:"She remembered _____ her ID card.", opts:["a) to bring","b) bring","c) brought"], ans:"a" }
    ],
    [
        { q:"While the deckhands _____ the cargo hatches, the rain started.", opts:["A. secure","B. were securing","C. have secured"], ans:"B" },
        { q:"The Chief Engineer ordered that the emergency generator _____ before departure.", opts:["A. must test","B. be tested","C. testing"], ans:"B" },
        { q:"The vessel has been sailing _____ five days.", opts:["A. for","B. since","C. during"], ans:"A" },
        { q:"If the oil pressure drops too low, the safety system _____ the engine.", opts:["A. stops","B. stopped","C. would stop"], ans:"A" },
        { q:"The new radar system is _____ more reliable.", opts:["A. very","B. much","C. directly"], ans:"B" },
        { q:"The bosun asked the deckhands _____ the ropes carefully.", opts:["A. to handle","B. handling","C. handled"], ans:"A" },
        { q:"By the time the captain arrived, the crew _____ the drill.", opts:["A. completed","B. had completed","C. completes"], ans:"B" },
        { q:"The engineer said the repair _____ by tomorrow.", opts:["A. will finish","B. would be finished","C. is finishing"], ans:"B" },
        { q:"We must ensure all equipment _____ regularly.", opts:["A. is checked","B. checks","C. checking"], ans:"A" },
        { q:"The ship cannot leave _____ customs clearance.", opts:["A. while","B. until","C. during"], ans:"B" },
        { q:"Neither the captain nor the officers _____ aware of the storm.", opts:["A. was","B. were","C. has been"], ans:"B" },
        { q:"The lifeboat drill _____ every Saturday.", opts:["A. conducts","B. is conducted","C. conducted"], ans:"B" },
        { q:"Had the lookout been more alert, the collision _____ avoided.", opts:["A. would be","B. would have been","C. will be"], ans:"B" },
        { q:"The cargo manifest _____ on the bridge.", opts:["A. is kept","B. are kept","C. keep"], ans:"A" },
        { q:"It is essential that every crew member _____ the briefing.", opts:["A. attends","B. attend","C. attended"], ans:"B" },
        { q:"The pumpman reported the tanks _____ before loading.", opts:["A. emptied","B. had been emptied","C. were emptying"], ans:"B" },
        { q:"_____ the heavy weather, the vessel maintained course.", opts:["A. Despite","B. Although","C. However"], ans:"A" },
        { q:"The chief mate asked the cadet _____ the entries.", opts:["A. to double-check","B. double-checking","C. double-check"], ans:"A" },
        { q:"No sooner _____ the gangway than the rain started.", opts:["A. had they lowered","B. they lowered","C. they had lowered"], ans:"A" },
        { q:"The more you practice, _____ you communicate.", opts:["A. the better","B. the best","C. better"], ans:"A" }
    ]
];

// Reading (3 pools, each pool is an array of 2 passages)
const readingPools = [
    [
        { title:"FIRE DRILL PRACTICE", text:"All crew members must participate in the emergency fire drill today at 15:30. When the alarm sounds (continuous ringing of the ship's bell), everyone must put on their lifejackets and go immediately to the muster station on the boat deck. Do not use the elevator during the drill. The chief officer will check the attendance log.",
          questions:[{q:"The fire drill takes place at 3:30 p.m.", ans:"T"},{q:"The alarm for the fire drill is a continuous bell.", ans:"T"},{q:"Crew members should take the elevator to save time.", ans:"F"},{q:"Crew members must wear lifejackets for the drill.", ans:"T"},{q:"The captain will check the attendance log.", ans:"F"}] },
        { title:"GALLEY HYGIENE RULES", text:"The galley crew must keep the kitchen area perfectly clean at all times to prevent food poisoning. All meat and vegetables must be stored in separate refrigerators. Garbage bins must be covered with lids and emptied after every meal. The cook needs to wear a clean apron and a hairnet while preparing food. If any kitchen tool is broken, report it to the chief steward.",
          questions:[{q:"The galley area must be cleaned only once a day.", ans:"F"},{q:"Meat and vegetables can be stored together in the same fridge.", ans:"F"},{q:"The cook must wear a hairnet when working.", ans:"T"},{q:"The galley crew prepares food for 25 people on board.", ans:"D"},{q:"Broken kitchen tools should be reported to the chief steward.", ans:"T"}] }
    ],
    [
        { title:"BRIDGE WATCHKEEPING", text:"The lookout officer on the bridge must stay alert during the night watch from 00:00 to 04:00. Using mobile phones or listening to music is strictly forbidden. The officer must monitor the radar screen and check the horizon using binoculars every ten minutes. Any small target or flashing light ahead must be reported to the Captain immediately.",
          questions:[{q:"The night watch ends at 4:00 a.m.", ans:"T"},{q:"Officers can listen to music if they feel tired.", ans:"F"},{q:"The radar must be checked by the officer.", ans:"T"},{q:"The horizon should be checked every half hour.", ans:"F"},{q:"The captain must be informed about flashing lights ahead.", ans:"T"}] },
        { title:"ENGINE ROOM SAFETY", text:"Engineers and wipers must wear safety shoes, ear protection, and coveralls before entering the engine room. The machinery area is extremely loud and hot. Never touch any moving parts of the generator or open steam valves without permission. Walkways must be kept clear of oily rags and tools to avoid slipping. Smoking is only allowed in designated smoking rooms, never in the engine room.",
          questions:[{q:"Ear protection is required inside the engine room.", ans:"T"},{q:"It is safe to touch the moving parts of the generator.", ans:"F"},{q:"Oily rags on the walkways can cause crew members to slip.", ans:"T"},{q:"The engine room has three high-pressure steam valves.", ans:"D"},{q:"Crew members can smoke inside the engine room if they are careful.", ans:"F"}] }
    ],
    [
        { title:"BUNKERING OPERATIONS", text:"Bunkering (refueling the ship) will start tomorrow morning at 08:00. The deck crew must block all scuppers on deck with plugs before the oil transfer begins. This prevents any accidental oil spill from leaking into the sea. 'No Smoking' signs must be displayed clearly near the bunker station. A fire extinguisher must be placed ready on deck.",
          questions:[{q:"Bunkering means refueling the ship.", ans:"T"},{q:"The oil transfer starts in the afternoon.", ans:"F"},{q:"Scuppers must be left open during the operation.", ans:"F"},{q:"'No Smoking' signs must be put up near the bunker station.", ans:"T"},{q:"A fire extinguisher needs to be ready on deck.", ans:"T"}] },
        { title:"ENCLOSED SPACE ENTRY", text:"Entering a cargo hold or a ballast tank can be very dangerous because of toxic gases or lack of oxygen. Before anyone enters, the gas level must be measured using a gas detector. The chief officer must sign an 'Enclosed Space Entry Permit' first. A crew member must stand outside the entrance as a watchman with a handheld radio. The person inside must wear a safety harness.",
          questions:[{q:"Ballast tanks can have toxic gases inside.", ans:"T"},{q:"Anyone can enter an enclosed space without a permit.", ans:"F"},{q:"The watchman standing outside must hold a radio.", ans:"T"},{q:"The safety harness used must be 5 meters long.", ans:"D"},{q:"The gas level is checked after the crew finishes the work.", ans:"F"}] }
    ]
];

// Listening (3 sets, each with 2 tasks)
const listeningPools = [
    { task2:{ title:"Short Conversations (Set A)", audio:"fullset1_audio_A1.mp3", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"B" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"A" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"B" },
        { q:"What is the main reason Kim is tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"A" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"B" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"B" }
    ]}, task3:{ title:"Long Conversation (Set A)", audio:"fullset1_audio_A2.mp3", questions:[
        { q:"How does the chief officer feel about the cadet's work?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"B" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"B" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"B" },
        { q:"Which best describes the cadet's personality?", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"A" },
        { q:"What can we understand about the chief officer?", opts:["A. Focuses on strict rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"C" },
        { q:"What does the chief officer suggest the cadet should do?", opts:["A. Check safety equipment","B. Pay close attention and continue learning","C. Report small problems later"], ans:"B" }
    ]} },
    { task2:{ title:"Short Conversations (Set B)", audio:"fullset1_audio_B1.mp3", questions:[
        { q:"What worries the chief mate?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"A" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"B" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"C" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"B" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"A" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"A" }
    ]}, task3:{ title:"Long Conversation (Set B)", audio:"fullset1_audio_B2.mp3", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"C" },
        { q:"What does the cadet's action show?", opts:["A. Prefers to solve problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"A" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"C" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"C" },
        { q:"What do we understand about the officer?", opts:["A. Focuses mainly on strict safety rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"A" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"A" }
    ]} },
    { task2:{ title:"Short Conversations (Set C)", audio:"fullset1_audio_C1.mp3", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"C" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"C" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"A" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"C" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"C" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"C" }
    ]}, task3:{ title:"Long Conversation (Set C)", audio:"fullset1_audio_C2.mp3", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"A" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress the officer"], ans:"C" },
        { q:"What is the attitude toward small problems?", opts:["A. Useful for improving teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"A" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"B" },
        { q:"What do we understand about the officer?", opts:["A. Focuses on strict rules","B. Values teamwork and collaboration","C. Encourages learning through guidance"], ans:"B" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"C" }
    ]} }
];

// Writing (3 sets, each with part1 and part2 tasks)
const writingPools = [
    { part1:{ A:{ title:"Introduce Yourself", task:"Write 3-4 sentences about yourself. Include your name, your job on board, and why you like working at sea.", keywords:["name","job","ship","sea","work"] }, B:{ title:"Your Hobby", task:"Write about your favorite hobby during free time on the ship.", keywords:["hobby","like","enjoy","free","time"] } },
      part2:{ A:{ title:"A Memorable Day at Sea", task:"Describe a day you remember well on board. What happened and how did you feel?", keywords:["day","weather","work","happy","memorable"] }, B:{ title:"My Future Plans", task:"Write about your plans after this contract finishes.", keywords:["after","plan","family","vacation","study"] } } },
    { part1:{ A:{ title:"Hand Tool Safety", task:"Write a message about a broken tool you saw and who you reported to.", keywords:["broken","tool","reported","bosun","safety"] }, B:{ title:"Cold Weather", task:"Write about working in cold weather and what helped you.", keywords:["cold","jacket","coffee","weather","freezing"] } },
      part2:{ A:{ title:"Keeping the Deck Clean", task:"Write about how you maintain cleanliness on deck.", keywords:["cleaning","deck","slippery","safety","housekeeping"] }, B:{ title:"Learning Ship Routines", task:"Write about adapting to the ship's schedule.", keywords:["waking","early","routine","logbook","dedication"] } } },
    { part1:{ A:{ title:"Missing Safety Sign", task:"Write about a wet floor without a warning sign.", keywords:["wet","floor","sign","warning","slippery"] }, B:{ title:"Engine Room Noise", task:"Write about loud noise in the engine room and ear protection.", keywords:["noise","engine","ear","protection","loud"] } },
      part2:{ A:{ title:"Garbage Management", task:"Write about sorting waste under MARPOL.", keywords:["garbage","plastic","food","MARPOL","pollution"] }, B:{ title:"Radio Communication", task:"Write about using English on VHF radio.", keywords:["VHF","radio","English","communication","clear"] } } }
];

// Speaking (3 sets, each with part1, part2, part3)
const speakingPools = [
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"What is your favorite color and why?", keywords:["color","blue","ocean","calm"], sample:"My favorite color is blue because it looks like the ocean." },
        { q:"What's your dream job?", keywords:["dream","job","captain","officer"], sample:"My dream job is to become a Captain." },
        { q:"Why do you want to be a seafarer?", keywords:["travel","world","salary","adventure"], sample:"I want to travel the world and earn a good salary." },
        { q:"Do you enjoy traveling?", keywords:["travel","new","places","cultures"], sample:"Yes, I love seeing new places." },
        { q:"What languages can you speak?", keywords:["speak","Burmese","English","fluent"], sample:"I can speak Burmese and English." },
        { q:"How do you spend free time?", keywords:["free","time","reading","exercise"], sample:"I like reading and exercising." },
        { q:"What is your duty on board?", keywords:["duty","cadet","assist","officer"], sample:"As a cadet, I assist the officers." }
    ]}, part2:{ title:"Part II – PPE", questions:[
        { q:"Why wear safety boots?", keywords:["protect","feet","falling","objects"], sample:"To protect my feet from heavy objects." },
        { q:"When to use a helmet?", keywords:["helmet","deck","engine","maintenance"], sample:"When working on deck or in engine room." },
        { q:"What if you don't wear gloves?", keywords:["gloves","hurt","sharp","chemicals"], sample:"I can hurt my hands." },
        { q:"Who gives you PPE?", keywords:["PPE","Safety Officer","provide"], sample:"The Safety Officer provides PPE." },
        { q:"Why is PPE important?", keywords:["PPE","prevents","accidents","injuries"], sample:"It prevents accidents." },
        { q:"Where to wear ear protection?", keywords:["ear","protection","engine","loud"], sample:"In the engine room." },
        { q:"How often inspect PPE?", keywords:["inspect","regularly","damage","replace"], sample:"Inspect regularly for damage." }
    ]}, part3:{ title:"Part III – Stress Management", warmups:[
        { q:"What causes stress on a ship?", keywords:["stress","hours","family","weather"], sample:"Long hours and being away from family." },
        { q:"How can teamwork reduce stress?", keywords:["teamwork","share","support","workload"], sample:"Sharing workload helps." },
        { q:"What do you do when stressed?", keywords:["stressed","exercise","music","talk"], sample:"I exercise or listen to music." }
    ], debates:[
        { statement:"'Team support reduces stress.'", keywords:["agree","support","safer"], sample:"I agree, team support helps." },
        { statement:"'Stress makes people work better.'", keywords:["disagree","panic","mistakes"], sample:"I disagree, too much stress causes errors." },
        { statement:"'Talking about stress is important.'", keywords:["agree","sharing","solves","problems"], sample:"Yes, sharing feelings helps." },
        { statement:"'A calm team works more effectively.'", keywords:["agree","calm","think","clearly"], sample:"I agree, calmness leads to better decisions." },
        { statement:"'Seniors should help juniors manage stress.'", keywords:["agree","senior","mentor","guide"], sample:"Yes, experienced crew can guide juniors." }
    ]} },
    // Sets B and C similar but different questions.
    // (For brevity, I'm copying similar structures with slight modifications.)
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"Where do you live and what do you like about it?", keywords:["live","Yangon","city","friendly"], sample:"I live in Yangon, a lively city." },
        { q:"Why did you choose maritime?", keywords:["chose","career","growth","adventure"], sample:"For career growth and adventure." },
        { q:"Who inspires you?", keywords:["inspire","parents","hard work"], sample:"My parents inspire me." },
        { q:"Do you prefer day or night work?", keywords:["day","night","visibility"], sample:"I prefer day work." },
        { q:"What computer skills do you have?", keywords:["computer","Office","email"], sample:"I know Microsoft Office." },
        { q:"How do you keep fit?", keywords:["fit","exercise","healthy","food"], sample:"I run and eat healthy." },
        { q:"What's exciting about ship life?", keywords:["exciting","sunrise","new","country"], sample:"Seeing sunrises at sea." }
    ]}, part2:{ title:"Part II – Daily Routine", questions:[
        { q:"What time do you start work?", keywords:["start","work","0800","watch"], sample:"I start at 0800." },
        { q:"Who tells you daily tasks?", keywords:["tasks","Chief Officer","Bosun","briefing"], sample:"The Bosun during briefing." },
        { q:"Why arrive on time?", keywords:["arrive","on time","discipline","relieve"], sample:"To show discipline." },
        { q:"What do you bring to work?", keywords:["bring","PPE","notebook","pen"], sample:"PPE, notebook, pen." },
        { q:"Why follow the schedule?", keywords:["schedule","smooth","safely","operation"], sample:"To keep operations smooth." },
        { q:"What if you miss a briefing?", keywords:["miss","briefing","information","mistake"], sample:"I might miss important tasks." },
        { q:"How do you stay alert?", keywords:["alert","coffee","stretch","rested"], sample:"I drink coffee and stretch." }
    ]}, part3:{ title:"Part III – Safety Drills", warmups:[
        { q:"What are safety drills?", keywords:["drills","practice","emergency","fire"], sample:"Practice for emergencies." },
        { q:"Why are drills important?", keywords:["important","drills","respond","quickly"], sample:"To respond quickly." },
        { q:"How often should drills happen?", keywords:["often","drills","monthly","regulation"], sample:"Monthly." }
    ], debates:[
        { statement:"'Drills prepare teams for emergencies.'", keywords:["agree","drills","prepare","muscle","memory"], sample:"Yes, they build muscle memory." },
        { statement:"'Drills are boring but necessary.'", keywords:["agree","boring","necessary","repetitive"], sample:"Even if boring, they are needed." },
        { statement:"'Frequent drills improve safety.'", keywords:["agree","frequent","improve","practice"], sample:"More practice means fewer mistakes." },
        { statement:"'Teams should take drills seriously.'", keywords:["agree","seriously","mistake","drill"], sample:"A mistake in a drill could be fatal." },
        { statement:"'Drills are a waste of time.'", keywords:["disagree","waste","time","save","lives"], sample:"No, they save lives." }
    ]} },
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"What's your favorite subject?", keywords:["favorite","subject","Maths","English"], sample:"I liked Maths." },
        { q:"How do you feel leaving family?", keywords:["family","contract","difficult","support"], sample:"It's hard but I support them." },
        { q:"Qualities of a good seafarer?", keywords:["qualities","disciplined","hardworking","team"], sample:"Discipline and teamwork." },
        { q:"Do you like cooking?", keywords:["cooking","foods","traditional"], sample:"I enjoy trying new foods." },
        { q:"How handle bad weather?", keywords:["weather","calm","protocols","secure"], sample:"Stay calm and secure equipment." },
        { q:"Career goals in 5 years?", keywords:["goals","officer","Second","exams"], sample:"Become a Second Officer." },
        { q:"Stay connected with friends?", keywords:["connected","social","media","internet"], sample:"Using social media." }
    ]}, part2:{ title:"Part II – Emergency Alarms", questions:[
        { q:"What do you do on general alarm?", keywords:["alarm","stop","muster","station"], sample:"Go to muster station." },
        { q:"Where is your muster station?", keywords:["muster","station","boat","deck"], sample:"On the boat deck." },
        { q:"What gear to collect from cabin?", keywords:["gear","lifejacket","immersion","suit"], sample:"Lifejacket and immersion suit." },
        { q:"Who counts crew at station?", keywords:["count","Officer","Charge"], sample:"The officer in charge." },
        { q:"Why calm behavior critical?", keywords:["calm","think","clearly","panic"], sample:"To think clearly and avoid panic." },
        { q:"What if you go to wrong station?", keywords:["wrong","station","confusion","delay"], sample:"Causes delay." },
        { q:"How to know which lifeboat?", keywords:["lifeboat","assignment","muster","list"], sample:"Check muster list." }
    ]}, part3:{ title:"Part III – Language Barriers", warmups:[
        { q:"Language problems on ship?", keywords:["language","misunderstand","orders"], sample:"Misunderstanding orders." },
        { q:"How communicate with differences?", keywords:["communicate","standard","phrases","gestures"], sample:"Use simple English." },
        { q:"Why clear language important?", keywords:["clear","language","confusion","safety"], sample:"To avoid confusion." }
    ], debates:[
        { statement:"'Language barriers affect teamwork.'", keywords:["agree","barriers","fail","coordinate"], sample:"Yes, communication fails." },
        { statement:"'Simple language improves communication.'", keywords:["agree","simple","direct","prevents"], sample:"Yes, simple words help." },
        { statement:"'Everyone should speak one common language.'", keywords:["agree","common","Maritime","English"], sample:"Yes, Maritime English." },
        { statement:"'Misunderstandings can cause accidents.'", keywords:["agree","misheard","command","injuries"], sample:"Yes, can lead to accidents." },
        { statement:"'Gestures are enough.'", keywords:["disagree","gestures","not","enough"], sample:"No, words are needed." }
    ]} }
];

// ======================== RANDOM SELECTION ========================
function getRandomInt(max) { return Math.floor(Math.random() * max); }

let selectedGrammar, selectedReadingPassages, selectedListening, selectedWriting, selectedSpeaking;

function generateRandomExam() {
    // Grammar: pick one set
    selectedGrammar = grammarPools[getRandomInt(3)];
    loadGrammar(selectedGrammar);

    // Reading: pick one set (2 passages)
    const readingSet = readingPools[getRandomInt(3)];
    selectedReadingPassages = readingSet;
    loadReading(readingSet);

    // Listening: pick one set
    selectedListening = listeningPools[getRandomInt(3)];
    loadListening(selectedListening);

    // Writing: pick one set
    selectedWriting = writingPools[getRandomInt(3)];
    loadWriting(selectedWriting);

    // Speaking: pick one set
    selectedSpeaking = speakingPools[getRandomInt(3)];
    loadSpeaking(selectedSpeaking);
}

// ======================== LOAD FUNCTIONS ========================
function loadGrammar(questions) {
    let html = '';
    questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="gq${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    document.getElementById('grammarQuestions').innerHTML = html;
    window._grammarData = questions;
}

function loadReading(passages) {
    let html = '', qNum = 1;
    passages.forEach(pass => {
        html += `<div class="reading-passage"><h4>${pass.title}</h4><p>${pass.text}</p>`;
        pass.questions.forEach(q => {
            html += `<div class="question"><p><strong>${qNum++}.</strong> ${q.q}</p>
            <select id="rq${qNum-2}"><option value="">Select</option><option value="T">True</option><option value="F">False</option><option value="D">Doesn't Say</option></select></div>`;
        });
        html += `</div>`;
    });
    document.getElementById('readingQuestions').innerHTML = html;
    // Store flat answers
    let ans = [];
    passages.forEach(p => p.questions.forEach(q => ans.push(q.ans)));
    window._readingAnswers = ans;
}

function loadListening(set) {
    let html = `<div class="card">
        <h4>Task 2: ${set.task2.title}</h4>
        <div class="audio-container">
            <p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
            <audio class="exam-audio" id="audioTask2" controls>
                <source src="${set.task2.audio}" type="audio/mpeg">
                Your browser does not support audio.
            </audio>
            <p class="audio-remaining" id="audioTask2Remaining">⏳ Remaining plays: 2</p>
        </div>`;

    set.task2.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l2q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div>`;

    html += `<div class="card">
        <h4>Task 3: ${set.task3.title}</h4>
        <div class="audio-container">
            <p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
            <audio class="exam-audio" id="audioTask3" controls>
                <source src="${set.task3.audio}" type="audio/mpeg">
                Your browser does not support audio.
            </audio>
            <p class="audio-remaining" id="audioTask3Remaining">⏳ Remaining plays: 2</p>
        </div>`;

    set.task3.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l3q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div>`;

    document.getElementById('listeningQuestions').innerHTML = html;

    // Audio Playback Limit (2 times)
    setupAudioLimit('audioTask2', 'audioTask2Remaining');
    setupAudioLimit('audioTask3', 'audioTask3Remaining');

    window._listeningData = set;
}

// Helper function to enforce 2-play limit
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

    // Optional: also reset on page reload, but this keeps it simple.
    // If you want to prevent seeking after limit, you can pause on 'seeking' event but it's okay.
}

function loadWriting(set) {
    let html = `<div class="card">
        <h4>Part 1 (approx. 25 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card">
                <h5>Option A: ${set.part1.A.title}</h5>
                <p>${set.part1.A.task}</p>
                <p style="font-size:0.85rem; color:#666;">💡 Keywords: ${set.part1.A.keywords.join(', ')}</p>
                <textarea id="w1A" rows="3" placeholder="Type your answer..."></textarea>
            </div>
            <div class="option-card">
                <h5>Option B: ${set.part1.B.title}</h5>
                <p>${set.part1.B.task}</p>
                <p style="font-size:0.85rem; color:#666;">💡 Keywords: ${set.part1.B.keywords.join(', ')}</p>
                <textarea id="w1B" rows="3" placeholder="Type your answer..."></textarea>
            </div>
        </div>
    </div>
    <div class="card">
        <h4>Part 2 (80–100 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card">
                <h5>Option A: ${set.part2.A.title}</h5>
                <p>${set.part2.A.task}</p>
                <p style="font-size:0.85rem; color:#666;">💡 Keywords: ${set.part2.A.keywords.join(', ')}</p>
                <textarea id="w2A" rows="5" placeholder="Type your answer..."></textarea>
            </div>
            <div class="option-card">
                <h5>Option B: ${set.part2.B.title}</h5>
                <p>${set.part2.B.task}</p>
                <p style="font-size:0.85rem; color:#666;">💡 Keywords: ${set.part2.B.keywords.join(', ')}</p>
                <textarea id="w2B" rows="5" placeholder="Type your answer..."></textarea>
            </div>
        </div>
    </div>`;

    document.getElementById('writingQuestions').innerHTML = html;
    window._writingData = set;
}
function loadSpeaking(set) {
    let html = `<h4>${set.part1.title}</h4>`;
    set.part1.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p>
        <textarea id="sp1_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });

    html += `<h4>${set.part2.title}</h4>`;
    set.part2.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p>
        <textarea id="sp2_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });

    html += `<h4>${set.part3.title} – Warm-ups</h4>`;
    set.part3.warmups.forEach((q, i) => {
        html += `<div class="card"><p><strong>Warm-up ${i+1}:</strong> ${q.q}</p>
        <textarea id="sp3w_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });

    html += `<h4>Debate Statements</h4>`;
    set.part3.debates.forEach((q, i) => {
        html += `<div class="card"><p><strong>Statement ${i+1}:</strong> ${q.statement}</p>
        <textarea id="sp3d_${i}" rows="2" placeholder="Type your response..."></textarea></div>`;
    });

    document.getElementById('speakingQuestions').innerHTML = html;
    window._speakingData = set;
}
function toggleSample(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ======================== SUBMIT & GRADING ========================
function submitExam() {
    clearInterval(timerInterval);
    let total = 0, max = 0;

    // Grammar
    let gScore = 0;
    selectedGrammar.forEach((q, i) => {
        const sel = document.querySelector(`input[name="gq${i}"]:checked`);
        if (sel && sel.value === q.ans) gScore++;
    });
    total += gScore; max += 20;

    // Reading
    let rScore = 0;
    const rAns = window._readingAnswers;
    rAns.forEach((ans, i) => {
        const sel = document.getElementById(`rq${i}`);
        if (sel && sel.value === ans) rScore++;
    });
    total += rScore; max += rAns.length;

    // Listening
    let lScore = 0;
    const lSet = selectedListening;
    lSet.task2.questions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="l2q${i}"]:checked`);
        if (sel && sel.value === q.ans) lScore++;
    });
    lSet.task3.questions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="l3q${i}"]:checked`);
        if (sel && sel.value === q.ans) lScore++;
    });
    total += lScore; max += 12;

    // Writing
    const wData = window._writingData;
    let wScore = 0;
    const w1A = document.getElementById('w1A')?.value || '';
    const w1B = document.getElementById('w1B')?.value || '';
    const text1 = w1A.length >= w1B.length ? w1A : w1B;
    const kw1 = text1 === w1A ? wData.part1.A.keywords : wData.part1.B.keywords;
    let c = 0; kw1.forEach(k => { if (text1.toLowerCase().includes(k)) c++; });
    wScore += Math.min(10, c * 2);
    const w2A = document.getElementById('w2A')?.value || '';
    const w2B = document.getElementById('w2B')?.value || '';
    const text2 = w2A.length >= w2B.length ? w2A : w2B;
    const kw2 = text2 === w2A ? wData.part2.A.keywords : wData.part2.B.keywords;
    c = 0; kw2.forEach(k => { if (text2.toLowerCase().includes(k)) c++; });
    wScore += Math.min(15, Math.floor(c * 1.5));
    total += wScore; max += 25;

    // Speaking
    let sScore = 0, sMax = 0;
    const sData = window._speakingData;
    sData.part1.questions.forEach((q, i) => {
        const txt = document.getElementById(`sp1_${i}`)?.value || '';
        let cc = 0; q.keywords.forEach(k => { if (txt.toLowerCase().includes(k)) cc++; });
        sScore += Math.min(3, cc); sMax += 3;
    });
    sData.part2.questions.forEach((q, i) => {
        const txt = document.getElementById(`sp2_${i}`)?.value || '';
        let cc = 0; q.keywords.forEach(k => { if (txt.toLowerCase().includes(k)) cc++; });
        sScore += Math.min(3, cc); sMax += 3;
    });
    sData.part3.warmups.forEach((q, i) => {
        const txt = document.getElementById(`sp3w_${i}`)?.value || '';
        let cc = 0; q.keywords.forEach(k => { if (txt.toLowerCase().includes(k)) cc++; });
        sScore += Math.min(1, cc); sMax += 1;
    });
    sData.part3.debates.forEach((q, i) => {
        const txt = document.getElementById(`sp3d_${i}`)?.value || '';
        let cc = 0; q.keywords.forEach(k => { if (txt.toLowerCase().includes(k)) cc++; });
        sScore += Math.min(1, cc); sMax += 1;
    });
    total += sScore; max += sMax;

    const pct = Math.round((total / max) * 100);
    const grade = getGrade(pct);
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // ====== ရလဒ်များ သိမ်းဆည်း (Certificate အတွက်) ======
    window._lastExamScores = {
        username: window.currentUsername || 'Unknown',
        gScore: gScore,
        rScore: rScore,
        lScore: lScore,
        wScore: wScore,
        sScore: sScore,
        sMax: sMax,
        total: total,
        max: max,
        pct: pct,
        grade: grade,
        date: dateStr,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    // ====== Result Card HTML (တစ်ခါသာ ထည့်ပါ) ======
    document.getElementById('examResult').style.display = 'block';
    document.getElementById('examResult').innerHTML = `
        <div class="result-card" id="resultCard">
            <div class="result-header"><h3>📊 Full Set 1 Result</h3><p class="result-date">📅 ${dateStr}</p></div>
            <div class="result-score-circle"><span class="big-score">${pct}%</span><span class="total-score">${total}/${max}</span></div>
            <div class="result-grade ${grade.class}">${grade.emoji} ${grade.text}</div>
            <div class="result-details">
                <div class="result-item"><span class="section-name">📖 Grammar</span><span class="section-score">${gScore}/20</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(gScore/20*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">📰 Reading</span><span class="section-score">${rScore}/10</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(rScore/10*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🎧 Listening</span><span class="section-score">${lScore}/12</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(lScore/12*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">✍️ Writing</span><span class="section-score">${wScore}/25</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(wScore/25*100)}%"></div></div></div>
                <div class="result-item"><span class="section-name">🗣️ Speaking</span><span class="section-score">${sScore}/${sMax}</span><div class="section-bar"><div class="section-bar-fill" style="width:${Math.round(sScore/sMax*100)}%"></div></div></div>
            </div>
            <button class="download-btn" onclick="downloadPDF()">📥 Download Score Report</button>
            <button class="download-btn" style="margin-top:10px; background: linear-gradient(135deg, #f39c12, #e67e22);" onclick="downloadCertificate()">🎓 Download Certificate</button>
        </div>`;
    document.getElementById('examResult').scrollIntoView({ behavior: 'smooth' });
}
function getGrade(pct) {
    if (pct >= 90) return { class: 'grade-excellent', emoji: '🏆', text: 'Excellent! (A+)' };
    if (pct >= 80) return { class: 'grade-excellent', emoji: '🌟', text: 'Very Good! (A)' };
    if (pct >= 70) return { class: 'grade-good', emoji: '👍', text: 'Good! (B)' };
    if (pct >= 60) return { class: 'grade-good', emoji: '✅', text: 'Satisfactory (C)' };
    if (pct >= 50) return { class: 'grade-fair', emoji: '📚', text: 'Needs Improvement (D)' };
    return { class: 'grade-poor', emoji: '💪', text: 'Keep Studying! (F)' };
}

function downloadPDF() {
    const card = document.getElementById('resultCard');
    const btn = card.querySelector('.download-btn');
    if (btn) btn.style.display = 'none';
    window.print();
    if (btn) btn.style.display = 'block';
}

// (downloadCertificate function ကို ယခင်ပေးထားသည့်အတိုင်း ထားရှိပါ၊ ဤနေရာတွင် ထပ်မဖော်ပြတော့ပါ)


// CEFR Mapping (ထည့်ပေးပါ)
function getCEFR(percentage) {
    if (percentage >= 90) return 'C2 (Proficient)';
    if (percentage >= 80) return 'C1 (Advanced)';
    if (percentage >= 70) return 'B2 (Upper Intermediate)';
    if (percentage >= 60) return 'B1 (Intermediate)';
    if (percentage >= 50) return 'A2 (Elementary)';
    return 'A1 (Beginner)';

}

function downloadCertificate() {
    const scores = window._lastExamScores;
    if (!scores) {
        alert('ရလဒ်ဒေတာ မရှိပါ။ ကျေးဇူးပြု၍ စာမေးပွဲပြန်ဖြေပါ။');
        return;
    }

    const { username, gScore, rScore, lScore, wScore, sScore, total, max, pct, grade, date, time } = scores;
    const cefr = getCEFR(pct);
    const passFail = pct >= 50 ? 'PASS' : 'FAIL';

    // QR Code Data (newlines replaced with spaces for simplicity)
    const qrText = `MEPT Mock Test Candidate: ${username} Score: ${total}/${max} (${pct}%) Grade: ${grade.text} CEFR: ${cefr} Date: ${date} This is a mock test, not an official certificate.`;
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`;

    const certHTML = `
    <div style="width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; padding: 40px; background: #ffffff; border: 4px solid #0f4c75; border-radius: 20px; position: relative;">
        <div style="text-align: center; border-bottom: 2px solid #0f4c75; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 3rem;">⚓</div>
            <h1 style="color: #0f4c75; margin: 10px 0 5px; font-size: 2rem;">Certificate of Achievement</h1>
            <p style="color: #666; font-size: 1rem;">MEPT Mock Test Platform <br> This is a mock test certificate for self-assessment only</p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 1.2rem; color: #555;">This is to certify that</p>
            <h2 style="color: #0f4c75; font-size: 2rem; margin: 10px 0;">${username}</h2>
            <p style="font-size: 1rem; color: #555;">has successfully completed the</p>
            <p style="font-size: 1.3rem; font-weight: 700; color: #0f4c75;">MEPT Preparation Course</p>
        </div>

        <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
            <div style="text-align: center;">
                <p style="font-weight: 700; color: #0f4c75;">Score</p>
                <p style="font-size: 1.5rem; font-weight: 700;">${pct}%</p>
                <p>(${total}/${max})</p>
            </div>
            <div style="text-align: center;">
                <p style="font-weight: 700; color: #0f4c75;">Grade</p>
                <p style="font-size: 1.5rem; font-weight: 700;">${grade.text}</p>
            </div>
            <div style="text-align: center;">
                <p style="font-weight: 700; color: #0f4c75;">CEFR Level</p>
                <p style="font-size: 1.5rem; font-weight: 700;">${cefr}</p>
            </div>
            <div style="text-align: center;">
                <p style="font-weight: 700; color: #0f4c75;">Result</p>
                <p style="font-size: 1.5rem; font-weight: 700; color: ${passFail === 'PASS' ? '#28a745' : '#e74c3c'};">${passFail}</p>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border-top: 1px dashed #0f4c75; padding-top: 20px;">
            <div>
                <p style="font-size: 0.9rem; color: #777;">Date: ${date}</p>
                <p style="font-size: 0.9rem; color: #777;">Time: ${time}</p>
            </div>
            <div>
                <img id="qrCodeImage" src="${qrURL}" alt="QR Code" style="width: 100px; height: 100px;" onload="window.qrLoaded=true;">
            </div>
        </div>

      
    </div>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Certificate</title></head><body style="margin:0; display:flex; justify-content:center;">${certHTML}</body></html>`);
    printWindow.document.close();

    // QR image load စောင့်ပြီးမှ print
    const qrImg = printWindow.document.getElementById('qrCodeImage');
    if (qrImg) {
        qrImg.onload = function() {
            printWindow.print();
        };
    } else {
        // fallback
        setTimeout(() => { printWindow.print(); }, 1500);
    }
    printWindow.onafterprint = function() { printWindow.close(); };
}
function getGrade(pct) {
    if (pct >= 90) return { class:'grade-excellent', emoji:'🏆', text:'Excellent! (A+)', letter:'A+' };
    if (pct >= 80) return { class:'grade-excellent', emoji:'🌟', text:'Very Good! (A)', letter:'A' };
    if (pct >= 70) return { class:'grade-good', emoji:'👍', text:'Good! (B)', letter:'B' };
    if (pct >= 60) return { class:'grade-good', emoji:'✅', text:'Satisfactory (C)', letter:'C' };
    if (pct >= 50) return { class:'grade-fair', emoji:'📚', text:'Needs Improvement (D)', letter:'D' };
    return { class:'grade-poor', emoji:'💪', text:'Keep Studying! (F)', letter:'F' };
}
