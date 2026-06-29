const STORAGE_KEY = 'mept_all_users';

async function startExam() {
    const username = document.getElementById('loginUsername').value.trim();
    const key = document.getElementById('loginKey').value.trim();
    
    if (!username || !key) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">⚠️ Username နှင့် Key ထည့်ပါ</p>';
        return;
    }

    let user = null;

    try {
        const response = await fetch('users.json');
        const remoteUsers = await response.json();
        user = remoteUsers.find(u => u.username === username && u.password === key);
    } catch (e) {
        console.log('users.json not available, trying localStorage...');
    }

    if (!user) {
        const localUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        user = localUsers.find(u => u.username === username && u.password === key);
    }

    if (!user) {
        document.getElementById('loginStatus').innerHTML = '<p style="color:red;">❌ Username (သို့) Key မှားယွင်းနေပါသည်</p>';
        return;
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const exp = new Date(user.expireDate);
    const start = user.startDate ? new Date(user.startDate) : null;

    if (start && today < start) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ အကောင့်ကို ${user.startDate} မှ စတင်သုံးနိုင်ပါမည်</p>`;
        return;
    }

    if (today > exp) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ သက်တမ်းကုန်သွားပါပြီ (${user.expireDate})</p>`;
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
        const m = Math.floor(time / 60);
        const s = time % 60;
        display.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
        if (time <= 0) { clearInterval(timerInterval); alert('⏰ အချိန်ပြည့်ပါပြီ'); submitExam(); }
    }, 1000);
}

// ======================== GRAMMAR POOLS (3 sets x 20 questions) ========================
const grammarPools = [
    // Set A
    [
        { q:"The crew _____ the deck every morning.", opts:["a) cleans","b) clean","c) cleaning"], ans:"a" },
        { q:"My name _____ John. I am a seafarer.", opts:["a) is","b) are","c) am"], ans:"a" },
        { q:"The ship _____ at the port yesterday.", opts:["a) arrive","b) arrived","c) arriving"], ans:"b" },
        { q:"We always _____ life jackets on deck.", opts:["a) wear","b) wears","c) wearing"], ans:"a" },
        { q:"There _____ many lifeboats on the ship.", opts:["a) is","b) are","c) has"], ans:"b" },
        { q:"She _____ to the bridge now.", opts:["a) go","b) goes","c) is going"], ans:"c" },
        { q:"The captain _____ the weather report yesterday.", opts:["a) read","b) reads","c) reading"], ans:"a" },
        { q:"I can _____ English and Burmese.", opts:["a) speak","b) speaks","c) speaking"], ans:"a" },
        { q:"This rope is _____ than that one.", opts:["a) long","b) longer","c) longest"], ans:"b" },
        { q:"The engineer _____ the engine right now.", opts:["a) check","b) checks","c) is checking"], ans:"c" },
        { q:"We must _____ the safety rules.", opts:["a) follow","b) follows","c) following"], ans:"a" },
        { q:"The weather _____ very bad yesterday.", opts:["a) is","b) was","c) were"], ans:"b" },
        { q:"_____ you like to work on a ship?", opts:["a) Do","b) Does","c) Is"], ans:"a" },
        { q:"He _____ been a seafarer for five years.", opts:["a) has","b) have","c) is"], ans:"a" },
        { q:"Please _____ your lifejacket before the drill.", opts:["a) put on","b) puts on","c) putting on"], ans:"a" },
        { q:"The ship is _____ than the boat.", opts:["a) big","b) bigger","c) biggest"], ans:"b" },
        { q:"They _____ lunch in the mess room now.", opts:["a) have","b) are having","c) had"], ans:"b" },
        { q:"The bosun told me _____ the ropes.", opts:["a) check","b) to check","c) checking"], ans:"b" },
        { q:"There is _____ water in the tank.", opts:["a) many","b) much","c) few"], ans:"b" },
        { q:"The crew _____ finished the work.", opts:["a) have","b) has","c) is"], ans:"a" }
    ],
    // Set B
    [
        { q:"The chief officer _____ the cargo log every evening.", opts:["a) review","b) reviewing","c) reviews"], ans:"c" },
        { q:"The vessel is scheduled to dock _____ Friday morning.", opts:["a) at","b) on","c) in"], ans:"b" },
        { q:"Look! The rescue boat _____ towards us.", opts:["a) is coming","b) come","c) came"], ans:"a" },
        { q:"They _____ a severe storm warning two hours ago.", opts:["a) received","b) receive","c) receiving"], ans:"a" },
        { q:"No one is allowed on deck _____ a heavy storm.", opts:["a) during","b) between","c) while"], ans:"a" },
        { q:"The mechanic _____ the generator once a week.", opts:["a) inspects","b) inspect","c) inspecting"], ans:"a" },
        { q:"The deckhands are _____ the anchor now.", opts:["a) lowering","b) lower","c) lowered"], ans:"a" },
        { q:"The pilot did not _____ the signal.", opts:["a) see","b) saw","c) seeing"], ans:"a" },
        { q:"The North route is _____ than the South route.", opts:["a) safe","b) safest","c) safer"], ans:"c" },
        { q:"The crew is well prepared _____ emergencies.", opts:["a) for","b) with","c) about"], ans:"a" },
        { q:"All passengers should _____ the safety instructions.", opts:["a) follow","b) follows","c) following"], ans:"a" },
        { q:"The sea conditions became extremely _____.", opts:["a) rough","b) roughing","c) roughly"], ans:"a" },
        { q:"Listen! The foghorn _____ loudly.", opts:["a) blow","b) is blowing","c) blown"], ans:"b" },
        { q:"The sailboat safely anchored _____ the bay.", opts:["a) on","b) in","c) through"], ans:"b" },
        { q:"The engineers _____ repaired the broken valve.", opts:["a) have","b) has","c) having"], ans:"a" },
        { q:"The navigation team planned the route very _____.", opts:["a) careful","b) care","c) carefully"], ans:"c" },
        { q:"There is too _____ water leaking into the bilge.", opts:["a) much","b) many","c) few"], ans:"a" },
        { q:"We _____ the lifeboats before setting sail yesterday.", opts:["a) tested","b) test","c) testing"], ans:"a" },
        { q:"The officers were _____ the radar when the collision occurred.", opts:["a) watch","b) watching","c) watched"], ans:"b" },
        { q:"Don't forget _____ your safety harness before climbing.", opts:["a) to wear","b) wear","c) wearing"], ans:"a" }
    ],
    // Set C
    [
        { q:"The pumpman _____ the ballast tanks before loading cargo.", opts:["a) empties","b) empty","c) emptying"], ans:"a" },
        { q:"The morning shift begins exactly _____ 0800 hours.", opts:["a) at","b) in","c) on"], ans:"a" },
        { q:"The welder _____ the cracked railing on the starboard side now.", opts:["a) fix","b) fixed","c) is fixing"], ans:"c" },
        { q:"The ship owner _____ the new safety policy last Monday.", opts:["a) signed","b) sign","c) signing"], ans:"a" },
        { q:"Please do not stand _____ the heavy overhead crane.", opts:["a) inside","b) under","c) between"], ans:"b" },
        { q:"The boatswain _____ the work tasks to the deckhands every morning.", opts:["a) assigns","b) assign","c) assigning"], ans:"a" },
        { q:"They are _____ the lifeboats for the weekly safety inspection.", opts:["a) testing","b) test","c) tested"], ans:"a" },
        { q:"The steward did not _____ enough provisions for the long trip.", opts:["a) order","b) orders","c) ordering"], ans:"a" },
        { q:"High-pressure water is _____ for cleaning than a regular hose.", opts:["a) better","b) effective","c) good"], ans:"a" },
        { q:"This training manual is useful _____ all new crew members.", opts:["a) with","b) to","c) for"], ans:"c" },
        { q:"All crew members must _____ their life jackets during a drill.", opts:["a) wear","b) wears","c) wearing"], ans:"a" },
        { q:"The weather became quite _____ as we entered the channel.", opts:["a) foggy","b) fog","c) fogging"], ans:"a" },
        { q:"The cadet _____ the logbook entries right now.", opts:["a) is writing","b) write","c) wrote"], ans:"a" },
        { q:"The lifebuoy was thrown _____ the water to save the dummy.", opts:["a) into","b) on","c) at"], ans:"a" },
        { q:"The technical team _____ upgraded the vessel's radar software.", opts:["a) have","b) has","c) having"], ans:"b" },
        { q:"The helmsman responded _____ to the captain's rudder commands.", opts:["a) quickly","b) quick","c) quickest"], ans:"a" },
        { q:"There is _____ fuel remaining in the emergency generator.", opts:["a) little","b) many","c) few"], ans:"a" },
        { q:"The port authorities _____ our documentation yesterday morning.", opts:["a) approved","b) approve","c) approving"], ans:"a" },
        { q:"The deck crew were _____ the mooring lines when the rope snapped.", opts:["a) securing","b) secure","c) secured"], ans:"a" },
        { q:"The shipping line expects all employees _____ safety protocols.", opts:["a) to follow","b) follow","c) following"], ans:"a" }
    ]
];

// ======================== READING POOLS (3 sets x 2 passages) ========================
const readingPools = [
    // Set A
    [
        { title:"FIRE DRILL PRACTICE", text:"All crew members must participate in the emergency fire drill today at 15:30. When the alarm sounds (continuous ringing of the ship's bell), everyone must put on their lifejackets and go immediately to the muster station on the boat deck. Do not use the elevator during the drill. The chief officer will check the attendance log.",
          questions:[{q:"The fire drill takes place at 3:30 p.m.", ans:"T"},{q:"The alarm for the fire drill is a continuous bell.", ans:"T"},{q:"Crew members should take the elevator to save time.", ans:"F"},{q:"Crew members must wear lifejackets for the drill.", ans:"T"},{q:"The captain will check the attendance log.", ans:"F"}] },
        { title:"GALLEY HYGIENE RULES", text:"The galley crew must keep the kitchen area perfectly clean at all times to prevent food poisoning. All meat and vegetables must be stored in separate refrigerators. Garbage bins must be covered with lids and emptied after every meal. The cook needs to wear a clean apron and a hairnet while preparing food. If any kitchen tool is broken, report it to the chief steward.",
          questions:[{q:"The galley area must be cleaned only once a day.", ans:"F"},{q:"Meat and vegetables can be stored together in the same fridge.", ans:"F"},{q:"The cook must wear a hairnet when working.", ans:"T"},{q:"The galley crew prepares food for 25 people on board.", ans:"D"},{q:"Broken kitchen tools should be reported to the chief steward.", ans:"T"}] }
    ],
    // Set B
    [
        { title:"BRIDGE WATCHKEEPING", text:"The lookout officer on the bridge must stay alert during the night watch from 00:00 to 04:00. Using mobile phones or listening to music is strictly forbidden. The officer must monitor the radar screen and check the horizon using binoculars every ten minutes. Any small target or flashing light ahead must be reported to the Captain immediately.",
          questions:[{q:"The night watch ends at 4:00 a.m.", ans:"T"},{q:"Officers can listen to music if they feel tired.", ans:"F"},{q:"The radar must be checked by the officer.", ans:"T"},{q:"The horizon should be checked every half hour.", ans:"F"},{q:"The captain must be informed about flashing lights ahead.", ans:"T"}] },
        { title:"ENGINE ROOM SAFETY", text:"Engineers and wipers must wear safety shoes, ear protection, and coveralls before entering the engine room. The machinery area is extremely loud and hot. Never touch any moving parts of the generator or open steam valves without permission. Walkways must be kept clear of oily rags and tools to avoid slipping. Smoking is only allowed in designated smoking rooms, never in the engine room.",
          questions:[{q:"Ear protection is required inside the engine room.", ans:"T"},{q:"It is safe to touch the moving parts of the generator.", ans:"F"},{q:"Oily rags on the walkways can cause crew members to slip.", ans:"T"},{q:"The engine room has three high-pressure steam valves.", ans:"D"},{q:"Crew members can smoke inside the engine room if they are careful.", ans:"F"}] }
    ],
    // Set C
    [
        { title:"BUNKERING OPERATIONS", text:"Bunkering (refueling the ship) will start tomorrow morning at 08:00. The deck crew must block all scuppers on deck with plugs before the oil transfer begins. This prevents any accidental oil spill from leaking into the sea. 'No Smoking' signs must be displayed clearly near the bunker station. A fire extinguisher must be placed ready on deck.",
          questions:[{q:"Bunkering means refueling the ship.", ans:"T"},{q:"The oil transfer starts in the afternoon.", ans:"F"},{q:"Scuppers must be left open during the operation.", ans:"F"},{q:"'No Smoking' signs must be put up near the bunker station.", ans:"T"},{q:"A fire extinguisher needs to be ready on deck.", ans:"T"}] },
        { title:"ENCLOSED SPACE ENTRY", text:"Entering a cargo hold or a ballast tank can be very dangerous because of toxic gases or lack of oxygen. Before anyone enters, the gas level must be measured using a gas detector. The chief officer must sign an 'Enclosed Space Entry Permit' first. A crew member must stand outside the entrance as a watchman with a handheld radio. The person inside must wear a safety harness.",
          questions:[{q:"Ballast tanks can have toxic gases inside.", ans:"T"},{q:"Anyone can enter an enclosed space without a permit.", ans:"F"},{q:"The watchman standing outside must hold a radio.", ans:"T"},{q:"The safety harness used must be 5 meters long.", ans:"D"},{q:"The gas level is checked after the crew finishes the work.", ans:"F"}] }
    ]
];

// ======================== LISTENING POOLS (3 sets) ========================
const listeningPools = [
    { task2:{ title:"Short Conversations (Set A)", audio:"mt2_audio_A1.mp3", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"B" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"A" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"C" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"A" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"B" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"B" }
    ]}, task3:{ title:"Long Conversation (Set A)", audio:"mt2_audio_A2.mp3", questions:[
        { q:"How does the chief officer feel about the cadet?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"B" },
        { q:"What does the cadet always do?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"B" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"B" },
        { q:"Which best describes the cadet?", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"A" },
        { q:"What does the chief officer encourage?", opts:["A. Focus on strict rules","B. Values teamwork","C. Learning through guidance"], ans:"C" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention and continue learning","C. Report small problems later"], ans:"B" }
    ]} },
    { task2:{ title:"Short Conversations (Set B)", audio:"mt2_audio_B1.mp3", questions:[
        { q:"What worries the chief mate?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"A" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"B" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"C" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"B" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"A" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"A" }
    ]}, task3:{ title:"Long Conversation (Set B)", audio:"mt2_audio_B2.mp3", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"C" },
        { q:"What does the cadet's action show?", opts:["A. Prefers to solve problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"A" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"C" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"C" },
        { q:"What do we understand about the officer?", opts:["A. Focuses on strict safety rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"A" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"A" }
    ]} },
    { task2:{ title:"Short Conversations (Set C)", audio:"mt2_audio_C1.mp3", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"C" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"C" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"A" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"C" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"C" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"C" }
    ]}, task3:{ title:"Long Conversation (Set C)", audio:"mt2_audio_C2.mp3", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"A" },
        { q:"What does the cadet sometimes do?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress the officer"], ans:"C" },
        { q:"What is the attitude toward small problems?", opts:["A. Useful for improving teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"A" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"B" },
        { q:"What does the officer value?", opts:["A. Focuses on strict rules","B. Values teamwork and collaboration","C. Encourages learning through guidance"], ans:"B" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"C" }
    ]} }
];

// ======================== WRITING POOLS (3 sets) ========================
const writingPools = [
    { part1:{ A:{ title:"Introduce Yourself", task:"Write 3-4 sentences about yourself. Include your name, job on board, and why you like working at sea.", keywords:["name","job","ship","sea","work"] }, B:{ title:"Your Hobby", task:"Write about your favorite hobby during free time on the ship.", keywords:["hobby","like","enjoy","free","time"] } }, part2:{ A:{ title:"A Memorable Day at Sea", task:"Describe a day you remember well on board. What happened and how did you feel?", keywords:["day","weather","work","happy","memorable"] }, B:{ title:"My Future Plans", task:"Write about your plans after this contract finishes.", keywords:["after","plan","family","vacation","study"] } } },
    { part1:{ A:{ title:"Hand Tool Safety", task:"Write a message about a broken tool you saw and who you reported to.", keywords:["broken","tool","reported","bosun","safety"] }, B:{ title:"Cold Weather", task:"Write about working in cold weather and what helped you.", keywords:["cold","jacket","coffee","weather","freezing"] } }, part2:{ A:{ title:"Keeping the Deck Clean", task:"Write about how you maintain cleanliness on deck.", keywords:["cleaning","deck","slippery","safety","housekeeping"] }, B:{ title:"Learning Ship Routines", task:"Write about adapting to the ship's schedule.", keywords:["waking","early","routine","logbook","dedication"] } } },
    { part1:{ A:{ title:"Missing Safety Sign", task:"Write about a wet floor without a warning sign.", keywords:["wet","floor","sign","warning","slippery"] }, B:{ title:"Engine Room Noise", task:"Write about loud noise in the engine room and ear protection.", keywords:["noise","engine","ear","protection","loud"] } }, part2:{ A:{ title:"Garbage Management", task:"Write about sorting waste under MARPOL.", keywords:["garbage","plastic","food","MARPOL","pollution"] }, B:{ title:"Radio Communication", task:"Write about using English on VHF radio.", keywords:["VHF","radio","English","communication","clear"] } } }
];

// ======================== SPEAKING POOLS (3 sets) ========================
const speakingPools = [
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"What is your favorite color and why?", keywords:["color","blue","ocean","calm"] },
        { q:"What's your dream job?", keywords:["dream","job","captain","officer"] },
        { q:"Why do you want to be a seafarer?", keywords:["travel","world","salary","adventure"] },
        { q:"Do you enjoy traveling?", keywords:["travel","new","places","cultures"] },
        { q:"What languages can you speak?", keywords:["speak","Burmese","English","fluent"] },
        { q:"How do you spend free time?", keywords:["free","time","reading","exercise"] },
        { q:"What is your duty on board?", keywords:["duty","cadet","assist","officer"] }
    ]}, part2:{ title:"Part II – PPE", questions:[
        { q:"Why wear safety boots?", keywords:["protect","feet","falling","objects"] },
        { q:"When to use a helmet?", keywords:["helmet","deck","engine","maintenance"] },
        { q:"What if you don't wear gloves?", keywords:["gloves","hurt","sharp","chemicals"] },
        { q:"Who gives you PPE?", keywords:["PPE","Safety Officer","provide"] },
        { q:"Why is PPE important?", keywords:["PPE","prevents","accidents","injuries"] },
        { q:"Where to wear ear protection?", keywords:["ear","protection","engine","loud"] },
        { q:"How often inspect PPE?", keywords:["inspect","regularly","damage","replace"] }
    ]}, part3:{ title:"Part III – Stress Management", warmups:[
        { q:"What causes stress on a ship?", keywords:["stress","hours","family","weather"] },
        { q:"How can teamwork reduce stress?", keywords:["teamwork","share","support","workload"] },
        { q:"What do you do when stressed?", keywords:["stressed","exercise","music","talk"] }
    ], debates:[
        { statement:"'Team support reduces stress.'", keywords:["agree","support","safer"] },
        { statement:"'Stress makes people work better.'", keywords:["disagree","panic","mistakes"] },
        { statement:"'Talking about stress is important.'", keywords:["agree","sharing","solves","problems"] },
        { statement:"'A calm team works more effectively.'", keywords:["agree","calm","think","clearly"] },
        { statement:"'Seniors should help juniors manage stress.'", keywords:["agree","senior","mentor","guide"] }
    ]} },
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"Where do you live and what do you like about it?", keywords:["live","Yangon","city","friendly"] },
        { q:"Why did you choose maritime?", keywords:["chose","career","growth","adventure"] },
        { q:"Who inspires you?", keywords:["inspire","parents","hard work"] },
        { q:"Do you prefer day or night work?", keywords:["day","night","visibility"] },
        { q:"What computer skills do you have?", keywords:["computer","Office","email"] },
        { q:"How do you keep fit?", keywords:["fit","exercise","healthy","food"] },
        { q:"What's exciting about ship life?", keywords:["exciting","sunrise","new","country"] }
    ]}, part2:{ title:"Part II – Daily Routine", questions:[
        { q:"What time do you start work?", keywords:["start","work","0800","watch"] },
        { q:"Who tells you daily tasks?", keywords:["tasks","Chief Officer","Bosun","briefing"] },
        { q:"Why arrive on time?", keywords:["arrive","on time","discipline","relieve"] },
        { q:"What do you bring to work?", keywords:["bring","PPE","notebook","pen"] },
        { q:"Why follow the schedule?", keywords:["schedule","smooth","safely","operation"] },
        { q:"What if you miss a briefing?", keywords:["miss","briefing","information","mistake"] },
        { q:"How do you stay alert?", keywords:["alert","coffee","stretch","rested"] }
    ]}, part3:{ title:"Part III – Safety Drills", warmups:[
        { q:"What are safety drills?", keywords:["drills","practice","emergency","fire"] },
        { q:"Why are drills important?", keywords:["important","drills","respond","quickly"] },
        { q:"How often should drills happen?", keywords:["often","drills","monthly","regulation"] }
    ], debates:[
        { statement:"'Drills prepare teams for emergencies.'", keywords:["agree","drills","prepare","muscle","memory"] },
        { statement:"'Drills are boring but necessary.'", keywords:["agree","boring","necessary","repetitive"] },
        { statement:"'Frequent drills improve safety.'", keywords:["agree","frequent","improve","practice"] },
        { statement:"'Teams should take drills seriously.'", keywords:["agree","seriously","mistake","drill"] },
        { statement:"'Drills are a waste of time.'", keywords:["disagree","waste","time","save","lives"] }
    ]} },
    { part1:{ title:"Part I – Introduction", questions:[
        { q:"What's your favorite subject?", keywords:["favorite","subject","Maths","English"] },
        { q:"How do you feel leaving family?", keywords:["family","contract","difficult","support"] },
        { q:"Qualities of a good seafarer?", keywords:["qualities","disciplined","hardworking","team"] },
        { q:"Do you like cooking?", keywords:["cooking","foods","traditional"] },
        { q:"How handle bad weather?", keywords:["weather","calm","protocols","secure"] },
        { q:"Career goals in 5 years?", keywords:["goals","officer","Second","exams"] },
        { q:"Stay connected with friends?", keywords:["connected","social","media","internet"] }
    ]}, part2:{ title:"Part II – Emergency Alarms", questions:[
        { q:"What do you do on general alarm?", keywords:["alarm","stop","muster","station"] },
        { q:"Where is your muster station?", keywords:["muster","station","boat","deck"] },
        { q:"What gear to collect from cabin?", keywords:["gear","lifejacket","immersion","suit"] },
        { q:"Who counts crew at station?", keywords:["count","Officer","Charge"] },
        { q:"Why calm behavior critical?", keywords:["calm","think","clearly","panic"] },
        { q:"What if you go to wrong station?", keywords:["wrong","station","confusion","delay"] },
        { q:"How to know which lifeboat?", keywords:["lifeboat","assignment","muster","list"] }
    ]}, part3:{ title:"Part III – Language Barriers", warmups:[
        { q:"Language problems on ship?", keywords:["language","misunderstand","orders"] },
        { q:"How communicate with differences?", keywords:["communicate","standard","phrases","gestures"] },
        { q:"Why clear language important?", keywords:["clear","language","confusion","safety"] }
    ], debates:[
        { statement:"'Language barriers affect teamwork.'", keywords:["agree","barriers","fail","coordinate"] },
        { statement:"'Simple language improves communication.'", keywords:["agree","simple","direct","prevents"] },
        { statement:"'Everyone should speak one common language.'", keywords:["agree","common","Maritime","English"] },
        { statement:"'Misunderstandings can cause accidents.'", keywords:["agree","misheard","command","injuries"] },
        { statement:"'Gestures are enough.'", keywords:["disagree","gestures","not","enough"] }
    ]} }
];

// ======================== RANDOM SELECTION ========================
function getRandomInt(max) { return Math.floor(Math.random() * max); }
let selectedGrammar, selectedReading, selectedListening, selectedWriting, selectedSpeaking;

function generateRandomExam() {
    selectedGrammar = grammarPools[getRandomInt(3)];
    selectedReading = readingPools[getRandomInt(3)];
    selectedListening = listeningPools[getRandomInt(3)];
    selectedWriting = writingPools[getRandomInt(3)];
    selectedSpeaking = speakingPools[getRandomInt(3)];
    loadGrammar(selectedGrammar);
    loadReading(selectedReading);
    loadListening(selectedListening);
    loadWriting(selectedWriting);
    loadSpeaking(selectedSpeaking);
}

// ======================== CONTENT LOADERS ========================
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
    let ans = [];
    passages.forEach(p => p.questions.forEach(q => ans.push(q.ans)));
    window._readingAnswers = ans;
}

function loadListening(set) {
    let html = `<div class="card"><h4>Task 2: ${set.task2.title}</h4>
        <div class="audio-container"><p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
        <audio class="exam-audio" id="audioTask2" controls><source src="${set.task2.audio}" type="audio/mpeg"></audio>
        <p class="audio-remaining" id="audioTask2Remaining">⏳ Remaining plays: 2</p></div>`;
    set.task2.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l2q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div><div class="card"><h4>Task 3: ${set.task3.title}</h4>
        <div class="audio-container"><p><em>🎧 Listen carefully. You may play <strong>twice</strong> only.</em></p>
        <audio class="exam-audio" id="audioTask3" controls><source src="${set.task3.audio}" type="audio/mpeg"></audio>
        <p class="audio-remaining" id="audioTask3Remaining">⏳ Remaining plays: 2</p></div>`;
    set.task3.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l3q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div>`;
    document.getElementById('listeningQuestions').innerHTML = html;
    setupAudioLimit('audioTask2', 'audioTask2Remaining');
    setupAudioLimit('audioTask3', 'audioTask3Remaining');
    window._listeningData = set;
}

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

function loadWriting(set) {
    let html = `<div class="card">
        <h4>Part 1 (approx. 25 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card"><h5>Option A: ${set.part1.A.title}</h5><p>${set.part1.A.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${set.part1.A.keywords.join(', ')}</p><textarea id="w1A" rows="3" placeholder="Type your answer..."></textarea></div>
            <div class="option-card"><h5>Option B: ${set.part1.B.title}</h5><p>${set.part1.B.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${set.part1.B.keywords.join(', ')}</p><textarea id="w1B" rows="3" placeholder="Type your answer..."></textarea></div>
        </div>
    </div>
    <div class="card">
        <h4>Part 2 (80–100 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card"><h5>Option A: ${set.part2.A.title}</h5><p>${set.part2.A.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${set.part2.A.keywords.join(', ')}</p><textarea id="w2A" rows="5" placeholder="Type your answer..."></textarea></div>
            <div class="option-card"><h5>Option B: ${set.part2.B.title}</h5><p>${set.part2.B.task}</p><p style="font-size:0.85rem;color:#666;">💡 Keywords: ${set.part2.B.keywords.join(', ')}</p><textarea id="w2B" rows="5" placeholder="Type your answer..."></textarea></div>
        </div>
    </div>`;
    document.getElementById('writingQuestions').innerHTML = html;
    window._writingData = set;
}

function loadSpeaking(set) {
    let html = '';
    html += `<h4>${set.part1.title}</h4>`;
    set.part1.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="sp1_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    html += `<h4>${set.part2.title}</h4>`;
    set.part2.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="sp2_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    html += `<h4>${set.part3.title} – Warm-ups</h4>`;
    set.part3.warmups.forEach((q, i) => {
        html += `<div class="card"><p><strong>Warm-up ${i+1}:</strong> ${q.q}</p><textarea id="sp3w_${i}" rows="2" placeholder="Type your answer..."></textarea></div>`;
    });
    html += `<h4>Debate Statements</h4>`;
    set.part3.debates.forEach((q, i) => {
        html += `<div class="card"><p><strong>Statement ${i+1}:</strong> ${q.statement}</p><textarea id="sp3d_${i}" rows="2" placeholder="Type your response..."></textarea></div>`;
    });
    document.getElementById('speakingQuestions').innerHTML = html;
    window._speakingData = set;
}

// ======================== SUBMIT & GRADING ========================
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
            <p style="color: #666; font-size: 1rem;">MEPT Mock Test Platform</p>
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
