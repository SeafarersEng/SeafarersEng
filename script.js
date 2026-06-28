// ======================== MEPT FULL SYSTEM ========================
const STORAGE_KEY = 'mept_all_users';

// ======================== USER AUTH ========================
function userLogin() {
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
    const today = new Date(); today.setHours(0,0,0,0);
    const expireDate = new Date(user.expireDate);
    if (today > expireDate) {
        document.getElementById('loginStatus').innerHTML = `<p style="color:red;">❌ သက်တမ်းကုန်သွားပါပြီ (${user.expireDate})</p>`;
        return;
    }
    const remainingDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('practiceSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('premiumUnlockedMsg').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `
        <span>👤 <strong>${user.username}</strong></span>
        <span>📅 Expires: ${user.expireDate}</span>
        <span>⏳ ${remainingDays} days left</span>
        <button class="logout-btn" onclick="userLogout()">Logout</button>
    `;
    initAllSections();
}
function userLogout() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('practiceSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('premiumUnlockedMsg').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginKey').value = '';
    document.getElementById('loginStatus').innerHTML = '';
}
function initAllSections() {
    ['grammar','reading','writing','listening','speaking'].forEach(s => {
        generateSetButtons(s);
        backToSets(s);
    });
}

// ======================== DATA (Set 1 sample - extend for other sets) ========================
const grammarData = {
    1: { questions: [
        { q:"The crew ________ the deck every morning.", opts:["a) cleans","b) clean","c) cleaning"], ans:"a" },
        { q:"The ship will leave the port ________ 5 p.m.", opts:["a) in","b) on","c) at"], ans:"c" },
        { q:"They ________ lunch in the mess room now.", opts:["a) are having","b) have","c) had"], ans:"a" },
        { q:"The captain ________ the weather report yesterday.", opts:["a) reads","b) reading","c) read"], ans:"c" },
        { q:"We always wear life jackets ________ drills.", opts:["a) during","b) in","c) at"], ans:"a" },
        { q:"She ________ the engine room every day.", opts:["a) visit","b) visited","c) visits"], ans:"c" },
        { q:"The crews are ________ the ropes.", opts:["a) checking","b) check","c) checked"], ans:"a" },
        { q:"He didn't ________ the alarm.", opts:["a) hears","b) hear","c) hearing"], ans:"b" },
        { q:"This map is ________ than the old one.", opts:["a) better","b) good","c) best"], ans:"a" },
        { q:"The radio officer is responsible ________ communication.", opts:["a) for","b) to","c) of"], ans:"a" },
        { q:"They must ________ the cargo safely.", opts:["a) load","b) loads","c) loading"], ans:"a" },
        { q:"The weather was very ________ yesterday.", opts:["a) storm","b) stormy","c) storming"], ans:"b" },
        { q:"The captain ________ to the bridge now.", opts:["a) is going","b) goes","c) went"], ans:"a" },
        { q:"We arrived ________ the port early.", opts:["a) in","b) at","c) on"], ans:"b" },
        { q:"The crew ________ finished the cleaning.", opts:["a) have","b) has","c) having"], ans:"a" },
        { q:"He speaks very ________.", opts:["a) clear","b) clearer","c) clearly"], ans:"c" },
        { q:"There are ________ lifejackets on board.", opts:["a) many","b) much","c) little"], ans:"a" },
        { q:"The engineer ________ the engine last night.", opts:["a) checked","b) checks","c) checking"], ans:"a" },
        { q:"They were ________ when the bell rang.", opts:["a) work","b) working","c) worked"], ans:"b" },
        { q:"She remembered ________ her ID card.", opts:["a) to bring","b) bring","c) brought"], ans:"a" }
    ]},
    2: { questions: [
        { q:"The chief officer ________ the cargo log every evening.", opts:["a) review","b) reviewing","c) reviews"], ans:"c" },
        { q:"The vessel is scheduled to dock ________ Friday morning.", opts:["a) at","b) on","c) in"], ans:"b" },
        { q:"Look! The rescue boat ________ towards us.", opts:["a) is coming","b) come","c) came"], ans:"a" },
        { q:"They ________ a severe storm warning two hours ago.", opts:["a) received","b) receive","c) receiving"], ans:"a" },
        { q:"No one is allowed on deck ________ a heavy storm.", opts:["a) during","b) between","c) while"], ans:"a" },
        { q:"The mechanic ________ the generator once a week.", opts:["a) inspects","b) inspect","c) inspecting"], ans:"a" },
        { q:"The deckhands are ________ the anchor now.", opts:["a) lowering","b) lower","c) lowered"], ans:"a" },
        { q:"The pilot did not ________ the signal from the lighthouse.", opts:["a) see","b) saw","c) seeing"], ans:"a" },
        { q:"The North route is ________ than the South route.", opts:["a) safe","b) safest","c) safer"], ans:"c" },
        { q:"The crew is well prepared ________ emergency situations.", opts:["a) for","b) with","c) about"], ans:"a" },
        { q:"All passengers should ________ the safety instructions carefully.", opts:["a) follow","b) follows","c) following"], ans:"a" },
        { q:"The sea conditions became extremely ________ during the night.", opts:["a) rough","b) roughing","c) roughly"], ans:"a" },
        { q:"Listen! The foghorn ________ loudly in the distance.", opts:["a) blow","b) is blowing","c) blown"], ans:"b" },
        { q:"The sailboat safely anchored ________ the bay.", opts:["a) on","b) in","c) through"], ans:"b" },
        { q:"The engineers ________ repaired the broken valve.", opts:["a) have","b) has","c) having"], ans:"a" },
        { q:"The navigation team planned the route very ________.", opts:["a) careful","b) care","c) carefully"], ans:"c" },
        { q:"There is too ________ water leaking into the bilge.", opts:["a) much","b) many","c) few"], ans:"a" },
        { q:"We ________ the lifeboats before setting sail yesterday.", opts:["a) tested","b) test","c) testing"], ans:"a" },
        { q:"The officers were ________ the radar when the collision occurred.", opts:["a) watch","b) watching","c) watched"], ans:"b" },
        { q:"Don't forget ________ your safety harness before climbing.", opts:["a) to wear","b) wear","c) wearing"], ans:"a" }
    ]},
    3: { questions: [
        { q:"The pumpman ________ the ballast tanks before loading cargo.", opts:["a) empties","b) empty","c) emptying"], ans:"a" },
        { q:"The morning shift begins exactly ________ 0800 hours.", opts:["a) at","b) in","c) on"], ans:"a" },
        { q:"The welder ________ the cracked railing on the starboard side now.", opts:["a) fix","b) fixed","c) is fixing"], ans:"c" },
        { q:"The ship owner ________ the new safety policy last Monday.", opts:["a) signed","b) sign","c) signing"], ans:"a" },
        { q:"Please do not stand ________ the heavy overhead crane.", opts:["a) inside","b) under","c) between"], ans:"b" },
        { q:"The boatswain ________ the work tasks to the deckhands every morning.", opts:["a) assigns","b) assign","c) assigning"], ans:"a" },
        { q:"They are ________ the lifeboats for the weekly safety inspection.", opts:["a) testing","b) test","c) tested"], ans:"a" },
        { q:"The steward did not ________ enough provisions for the long trip.", opts:["a) order","b) orders","c) ordering"], ans:"a" },
        { q:"High-pressure water is ________ for cleaning than a regular hose.", opts:["a) better","b) effective","c) good"], ans:"a" },
        { q:"This training manual is useful ________ all new crew members.", opts:["a) with","b) to","c) for"], ans:"c" },
        { q:"All crew members must ________ their life jackets during a drill.", opts:["a) wear","b) wears","c) wearing"], ans:"a" },
        { q:"The weather became quite ________ as we entered the channel.", opts:["a) foggy","b) fog","c) fogging"], ans:"a" },
        { q:"The cadet ________ the logbook entries right now.", opts:["a) is writing","b) write","c) wrote"], ans:"a" },
        { q:"The lifebuoy was thrown ________ the water to save the dummy.", opts:["a) into","b) on","c) at"], ans:"a" },
        { q:"The technical team ________ upgraded the vessel's radar software.", opts:["a) have","b) has","c) having"], ans:"b" },
        { q:"The helmsman responded ________ to the captain's rudder commands.", opts:["a) quickly","b) quick","c) quickest"], ans:"a" },
        { q:"There is ________ fuel remaining in the emergency generator.", opts:["a) little","b) many","c) few"], ans:"a" },
        { q:"The port authorities ________ our documentation yesterday morning.", opts:["a) approved","b) approve","c) approving"], ans:"a" },
        { q:"The deck crew were ________ the mooring lines when the rope snapped.", opts:["a) securing","b) secure","c) secured"], ans:"a" },
        { q:"The shipping line expects all employees ________ safety protocols.", opts:["a) to follow","b) follow","c) following"], ans:"a" }
    ]},
    4: { questions: [
        { q:"The oil tanker ________ across the Atlantic every month.", opts:["a) sails","b) sail","c) sailing"], ans:"a" },
        { q:"The next safety drill is scheduled ________ June 15th.", opts:["a) on","b) at","c) in"], ans:"a" },
        { q:"The electricians ________ the main switchboard at this moment.", opts:["a) are repairing","b) repair","c) repaired"], ans:"a" },
        { q:"The maritime inspector ________ the vessel logs yesterday afternoon.", opts:["a) checked","b) check","c) checking"], ans:"a" },
        { q:"You should stay inside the cabin ________ a lightning storm.", opts:["a) during","b) at","c) between"], ans:"a" },
        { q:"The automatic pilot system ________ the ship's heading stable.", opts:["a) keep","b) keeps","c) keeping"], ans:"b" },
        { q:"Look, the tugboats are ________ our ship into the dry dock.", opts:["a) pulling","b) pull","c) pulled"], ans:"a" },
        { q:"The radio operator didn't ________ the distress signal in time.", opts:["a) copy","b) copies","c) copying"], ans:"a" },
        { q:"The new engine design is ________ than the previous model.", opts:["a) more efficient","b) efficient","c) most efficient"], ans:"a" },
        { q:"The chief engineer is highly experienced ________ engine maintenance.", opts:["a) in","b) for","c) at"], ans:"a" },
        { q:"Every seafarer must ________ a valid medical certificate.", opts:["a) possess","b) possesses","c) possessing"], ans:"a" },
        { q:"The engine room can get extremely ________ when running at full speed.", opts:["a) hot","b) heat","c) hotly"], ans:"a" },
        { q:"The deck department ________ the hull at the moment.", opts:["a) is painting","b) paint","c) painted"], ans:"a" },
        { q:"The custom officers came ________ the ship to check the cargo.", opts:["a) aboard","b) above","c) among"], ans:"a" },
        { q:"Both vessels ________ altered their courses to avoid a collision.", opts:["a) have","b) has","c) having"], ans:"a" },
        { q:"The engine room crew handled the emergency very ________.", opts:["a) professionally","b) professional","c) profession"], ans:"a" },
        { q:"There are too ________ personal items left in the common mess room.", opts:["a) many","b) much","c) little"], ans:"a" },
        { q:"We ________ the fuel tanks completely before the long voyage.", opts:["a) filled","b) fill","c) filling"], ans:"a" },
        { q:"The lookout was ________ the horizon when he spotted the debris.", opts:["a) scanning","b) scan","c) scanned"], ans:"a" },
        { q:"The captain decided ________ the port due to the typhoon.", opts:["a) to bypass","b) bypass","c) bypassing"], ans:"a" }
    ]},
    5: { questions: [
        { q:"The vessel's ETA has been revised ________ the port authority.", opts:["a) by","b) from","c) with"], ans:"a" },
        { q:"________ the storm warning, the ship remained in port.", opts:["a) Due to","b) Because","c) Since"], ans:"a" },
        { q:"The crew were advised ________ life jackets at all times on deck.", opts:["a) wearing","b) to wear","c) wear"], ans:"b" },
        { q:"It is high time the company ________ new safety equipment.", opts:["a) purchases","b) purchased","c) purchasing"], ans:"b" },
        { q:"The cargo was secured ________ it wouldn't shift during the voyage.", opts:["a) so that","b) because","c) although"], ans:"a" },
        { q:"The more you practice maritime English, ________ you communicate.", opts:["a) the better","b) the best","c) better"], ans:"a" },
        { q:"The OOW must call the Captain if visibility ________ below two miles.", opts:["a) drops","b) will drop","c) would drop"], ans:"a" },
        { q:"All scuppers must be plugged ________ any oil spill escapes into the sea.", opts:["a) lest","b) so that","c) in order to"], ans:"a" },
        { q:"The chief engineer, along with his team, ________ in the engine room now.", opts:["a) is working","b) are working","c) work"], ans:"a" },
        { q:"I wish I ________ more about maritime regulations before joining.", opts:["a) knew","b) had known","c) know"], ans:"b" },
        { q:"The vessel was prevented ________ entering the port due to the storm.", opts:["a) from","b) to","c) for"], ans:"a" },
        { q:"No sooner had the anchor dropped ________ the rain stopped.", opts:["a) than","b) when","c) then"], ans:"a" },
        { q:"The chief cook, together with his assistants, ________ the galley inspection.", opts:["a) is preparing for","b) are preparing for","c) prepare"], ans:"a" },
        { q:"If the captain ________ aware, he would have altered course immediately.", opts:["a) was","b) had been","c) were"], ans:"b" },
        { q:"The officer recommended that the cadet ________ more time studying charts.", opts:["a) spends","b) spend","c) spent"], ans:"b" },
        { q:"Not until the fog cleared ________ able to resume their course.", opts:["a) were they","b) they were","c) they had been"], ans:"a" },
        { q:"The chief engineer insisted that the purifier ________ before noon.", opts:["a) be repaired","b) was repaired","c) repairing"], ans:"a" },
        { q:"__________ the storm warning, the captain decided to alter course.", opts:["a) Having received","b) Received","c) Receiving"], ans:"a" },
        { q:"The more sophisticated the equipment, __________ the maintenance required.", opts:["a) the greater","b) the great","c) greater"], ans:"a" },
        { q:"Barely __________ the gangway when the mooring line snapped.", opts:["a) had they secured","b) they secured","c) they had secured"], ans:"a" }
    ]}
};

// ======================== READING DATA ========================
const readingData = {
    1: { passages: [
        { title:"FIRE DRILL PRACTICE", text:"All crew members must participate in the emergency fire drill today at 15:30. When the alarm sounds (continuous ringing of the ship's bell), everyone must put on their lifejackets and go immediately to the muster station on the boat deck. Do not use the elevator during the drill. The chief officer will check the attendance log.",
          questions:[ { q:"The fire drill takes place at 3:30 p.m.", ans:"T" },{ q:"The alarm for the fire drill is a continuous bell.", ans:"T" },{ q:"Crew members should take the elevator to save time.", ans:"F" },{ q:"Crew members must wear lifejackets for the drill.", ans:"T" },{ q:"The captain will check the attendance log.", ans:"F" } ] },
        { title:"GALLEY HYGIENE RULES", text:"The galley crew must keep the kitchen area perfectly clean at all times to prevent food poisoning. All meat and vegetables must be stored in separate refrigerators. Garbage bins must be covered with lids and emptied after every meal. The cook needs to wear a clean apron and a hairnet while preparing food. If any kitchen tool is broken, report it to the chief steward.",
          questions:[ { q:"The galley area must be cleaned only once a day.", ans:"F" },{ q:"Meat and vegetables can be stored together in the same fridge.", ans:"F" },{ q:"The cook must wear a hairnet when working.", ans:"T" },{ q:"The galley crew prepares food for 25 people on board.", ans:"D" },{ q:"Broken kitchen tools should be reported to the chief steward.", ans:"T" } ] }
    ]},
    2: { passages: [
        { title:"BRIDGE WATCHKEEPING", text:"The lookout officer on the bridge must stay alert during the night watch from 00:00 to 04:00. Using mobile phones or listening to music is strictly forbidden. The officer must monitor the radar screen and check the horizon using binoculars every ten minutes. Any small target or flashing light ahead must be reported to the Captain immediately.",
          questions:[ { q:"The night watch ends at 4:00 a.m.", ans:"T" },{ q:"Officers can listen to music if they feel tired.", ans:"F" },{ q:"The radar must be checked by the officer.", ans:"T" },{ q:"The horizon should be checked every half hour.", ans:"F" },{ q:"The captain must be informed about flashing lights ahead.", ans:"T" } ] },
        { title:"ENGINE ROOM SAFETY", text:"Engineers and wipers must wear safety shoes, ear protection, and coveralls before entering the engine room. The machinery area is extremely loud and hot. Never touch any moving parts of the generator or open steam valves without permission. Walkways must be kept clear of oily rags and tools to avoid slipping. Smoking is only allowed in designated smoking rooms, never in the engine room.",
          questions:[ { q:"Ear protection is required inside the engine room.", ans:"T" },{ q:"It is safe to touch the moving parts of the generator.", ans:"F" },{ q:"Oily rags on the walkways can cause crew members to slip.", ans:"T" },{ q:"The engine room has three high-pressure steam valves.", ans:"D" },{ q:"Crew members can smoke inside the engine room if they are careful.", ans:"F" } ] }
    ]},
    3: { passages: [
        { title:"BUNKERING OPERATIONS", text:"Bunkering (refueling the ship) will start tomorrow morning at 08:00. The deck crew must block all scuppers on deck with plugs before the oil transfer begins. This prevents any accidental oil spill from leaking into the sea. 'No Smoking' signs must be displayed clearly near the bunker station. A fire extinguisher must be placed ready on deck.",
          questions:[ { q:"Bunkering means refueling the ship.", ans:"T" },{ q:"The oil transfer starts in the afternoon.", ans:"F" },{ q:"Scuppers must be left open during the operation.", ans:"F" },{ q:"'No Smoking' signs must be put up near the bunker station.", ans:"T" },{ q:"A fire extinguisher needs to be ready on deck.", ans:"T" } ] },
        { title:"ENCLOSED SPACE ENTRY", text:"Entering a cargo hold or a ballast tank can be very dangerous because of toxic gases or lack of oxygen. Before anyone enters, the gas level must be measured using a gas detector. The chief officer must sign an 'Enclosed Space Entry Permit' first. A crew member must stand outside the entrance as a watchman with a handheld radio. The person inside must wear a safety harness.",
          questions:[ { q:"Ballast tanks can have toxic gases inside.", ans:"T" },{ q:"Anyone can enter an enclosed space without a permit.", ans:"F" },{ q:"The watchman standing outside must hold a radio.", ans:"T" },{ q:"The safety harness used must be 5 meters long.", ans:"D" },{ q:"The gas level is checked after the crew finishes the work.", ans:"F" } ] }
    ]},
    4: { passages: [
        { title:"MOORING DECK SAFETY", text:"Working on the mooring deck during arrival and departure is one of the most dangerous jobs. All deckhands must wear safety helmets, gloves, and steel-toe boots. Stand away from the 'snap-back zones' because a snapping rope can cause fatal injuries. Always listen to the orders given by the Second Officer via the walkie-talkie.",
          questions:[ { q:"Working on the mooring deck is very safe.", ans:"F" },{ q:"Deckhands must wear steel-toe boots.", ans:"T" },{ q:"Standing in snap-back zones is dangerous.", ans:"T" },{ q:"Ropes can break and cause serious injuries.", ans:"T" },{ q:"Orders are given by the Chief Engineer.", ans:"F" } ] },
        { title:"GARAGE AND CARGO SECURING", text:"On Ro-Ro ships, all cars and trucks must be lashed tightly to the deck using heavy chains or straps before the ship leaves the port. The lashing crew must check the tension of the chains every 6 hours during bad weather. If a vehicle moves during the voyage, it can damage other cargo or affect the ship's stability. No passengers are allowed to stay inside their cars during the voyage.",
          questions:[ { q:"Vehicles must be lashed using chains or straps.", ans:"T" },{ q:"Chains should be checked every 6 hours in bad weather.", ans:"T" },{ q:"Loose vehicles do not affect the stability of the ship.", ans:"F" },{ q:"The lashing crew consists of exactly four deckhands.", ans:"D" },{ q:"Passengers are permitted to sleep in their cars while at sea.", ans:"F" } ] }
    ]},
    5: { passages: [
        { title:"MEDICAL EMERGENCIES", text:"If a crew member gets injured or feels seriously ill on board, inform the medical officer or the bridge immediately. The ship's hospital is located on the B-deck next to the ship's office. Do not give any medicine to the patient without the doctor's instruction. For minor cuts, a first-aid kit is available in the crew mess room.",
          questions:[ { q:"The bridge should be informed if a crew member is injured.", ans:"T" },{ q:"The ship's hospital is located on the A-deck.", ans:"F" },{ q:"The hospital is next to the ship's office.", ans:"T" },{ q:"You can give any medicine to the patient immediately.", ans:"F" },{ q:"A first-aid kit is kept in the crew mess room.", ans:"T" } ] },
        { title:"PYROTECHNICS AND DISTRESS SIGNALS", text:"The bridge holds various pyrotechnics, including rocket parachute flares, hand flares, and orange smoke signals. These items are used only to signal for help during a real distress situation. They are kept in a water-resistant box on the bridge navigation wings. The third officer checks their expiry dates every month. Expired flares are unstable and must never be fired.",
          questions:[ { q:"Rocket parachute flares are used to signal for help.", ans:"T" },{ q:"Flares are stored in a box that resists water.", ans:"T" },{ q:"The second officer is responsible for checking the expiry dates.", ans:"F" },{ q:"The ship carries a total of 12 hand flares on board.", ans:"D" },{ q:"Expired flares are completely safe to use for practice.", ans:"F" } ] }
    ]}
};

// ======================== LISTENING DATA ========================
const listeningData = {
    1: { task2:{ title:"Short Conversations (6 dialogues)", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"B" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"A" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"B" },
        { q:"What is the main reason Kim is tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"A" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"B" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"B" }
    ]}, task3:{ title:"Long Conversation (Chief Officer & Cadet)", questions:[
        { q:"How does the chief officer feel about the cadet's work?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"B" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"B" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"B" },
        { q:"Which best describes the cadet's personality?", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"A" },
        { q:"What can we understand about the chief officer?", opts:["A. Focuses on strict rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"C" },
        { q:"What does the chief officer suggest the cadet should do?", opts:["A. Check safety equipment","B. Pay close attention and continue learning","C. Report small problems later"], ans:"B" }
    ]}, audioFiles:{ task2:"set1part1.mp3", task3:"set1part2.mp3" } },
    2: { task2:{ title:"Short Conversations", questions:[
        { q:"What worries the chief mate?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"A" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"B" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"C" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"B" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"A" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"A" }
    ]}, task3:{ title:"Long Conversation", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"C" },
        { q:"What does the cadet's action show?", opts:["A. Prefers to solve problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"A" },
        { q:"What is the officer's attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"C" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"C" },
        { q:"What do we understand about the officer?", opts:["A. Focuses mainly on strict safety rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"A" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"A" }
    ]}, audioFiles:{ task2:"set2part1.mp3", task3:"set2part2.mp3" } },
    3: { task2:{ title:"Short Conversations", questions:[
        { q:"What worries the engineer?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"C" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"C" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"A" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"C" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"C" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"C" }
    ]}, task3:{ title:"Long Conversation", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"A" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress the officer"], ans:"C" },
        { q:"What is the attitude toward small problems?", opts:["A. Useful for improving teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"A" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"B" },
        { q:"What do we understand about the officer?", opts:["A. Focuses on strict rules","B. Values teamwork and collaboration","C. Encourages learning through guidance"], ans:"B" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention","C. Report small problems later"], ans:"C" }
    ]}, audioFiles:{ task2:"set3part1.mp3", task3:"set3part2.mp3" } },
    4: { task2:{ title:"Short Conversations", questions:[
        { q:"What worries the speaker?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"B" },
        { q:"Why was the menu changed?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"A" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"B" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"A" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"B" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"B" }
    ]}, task3:{ title:"Long Conversation", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"B" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"B" },
        { q:"What is the attitude toward small problems?", opts:["A. Good for teamwork","B. Should be taken seriously","C. Good practice for learning"], ans:"B" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"A" },
        { q:"What do we understand about the officer?", opts:["A. Focuses on strict rules","B. Values teamwork","C. Learning through guidance"], ans:"C" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention and continue learning","C. Report small problems later"], ans:"B" }
    ]}, audioFiles:{ task2:"set4part1.mp3", task3:"set4part2.mp3" } },
    5: { task2:{ title:"Short Conversations", questions:[
        { q:"What worries the speaker?", opts:["A. Navigation system","B. Rising temperature","C. Food supply"], ans:"B" },
        { q:"Why did the cook change the menu?", opts:["A. Supplies were limited","B. To save money","C. Not enough time"], ans:"C" },
        { q:"Why is the meeting delayed?", opts:["A. Someone is absent","B. Work is not finished","C. Captain changed plans"], ans:"A" },
        { q:"Why is Kim tired?", opts:["A. Worked overnight","B. Feels unwell","C. Exercised too much"], ans:"B" },
        { q:"Why is Liam happy?", opts:["A. Completed training","B. Received praise","C. Shorter shift"], ans:"A" },
        { q:"What are they planning?", opts:["A. Training session","B. Repair","C. Celebration"], ans:"A" }
    ]}, task3:{ title:"Long Conversation", questions:[
        { q:"How does the officer feel?", opts:["A. Cadet is improving","B. Ready for more responsibility","C. Pleased with problem-solving"], ans:"A" },
        { q:"What does the cadet's action show?", opts:["A. Solves problems quickly","B. Follows safety procedures carefully","C. Tries to impress officer"], ans:"B" },
        { q:"What is the attitude toward small problems?", opts:["A. Useful for teamwork","B. Should be taken seriously","C. Good practice for learning new skills"], ans:"C" },
        { q:"Describe the cadet's personality.", opts:["A. Attentive and responsible","B. Friendly and helpful","C. Confident and active"], ans:"B" },
        { q:"What do we understand about the officer?", opts:["A. Focuses on strict rules","B. Values teamwork","C. Encourages learning through guidance"], ans:"C" },
        { q:"What does the officer suggest?", opts:["A. Check safety equipment","B. Pay close attention and continue learning","C. Report small problems later"], ans:"B" }
    ]}, audioFiles:{ task2:"set5part1.mp3", task3:"set5part2.mp3" } }
};

// ======================== WRITING DATA ========================
const writingData = {
    1: { part1:{ A:{ title:"Hand Tool Safety Incident", task:"Write a message about a broken tool you saw, who you reported to, why fixing is important, and safety rule remembered.", keywords:["broken","tool","reported","bosun","fixing","accidents","check","safety"] }, B:{ title:"Cold Weather Challenge", task:"Write about working in cold weather: how you felt, what helped you, why cold is normal on North routes, gear you hope to wear.", keywords:["freezing","wind","jacket","coffee","cold","normal","North","thermal","gloves"] } }, part2:{ A:{ title:"Keeping the Deck Clean", task:"Write about maintaining cleanliness: your feeling about oily surfaces, tasks to focus first, avoiding slipping, and how cleanliness supports safety.", keywords:["oily","cleaning","focus","slipping","safety","housekeeping","workspace","fire","drills"] }, B:{ title:"Learning Ship Routines", task:"Write about adapting to ship schedule: waking early, routines to master first, showing dedication, why quick learning helps new crew.", keywords:["waking","early","watches","routine","logbook","dedication","supervisor","orders","quickly","safe"] } } },
    2: { part1:{ A:{ title:"Missing Safety Sign", task:"Write about a wet floor without warning sign. Include: area, who you informed, why signs important on ship, what you learned.", keywords:["slippery","galley","wet","warning","sign","steward","falls","moving","safe"] }, B:{ title:"Engine Room Noise Challenge", task:"Write about dealing with loud engine noise. Include: your feeling, ear protection, why noise is normal near generators, how to protect hearing next time.", keywords:["noise","engine","ear","defenders","loud","generator","hearing","protection"] } }, part2:{ A:{ title:"Garbage Management at Sea", task:"Write about sorting waste. Say: how you feel separating plastics, what bins to check first, how MARPOL helps avoid pollution, why proper waste management supports clean oceans.", keywords:["plastics","food","bins","MARPOL","pollution","sea","ocean","clean","regulations"] }, B:{ title:"Communicating with Port Authorities", task:"Write about using English on VHF radio. Say: how you feel, standard phrases to practice, showing professionalism, why clear radio helps smooth arrival.", keywords:["VHF","English","phrases","SMCP","clear","radio","port","control","arrival"] } } },
    3: { part1:{ A:{ title:"Loose Mooring Rope", task:"Write about an unsecure line. Include: what rope, who you told, why tight ropes important for docking, what you learned about mooring hazards.", keywords:["loose","mooring","rope","officer","tight","docking","hazard","snap","zone"] }, B:{ title:"Extreme Heat Challenge", task:"Write about working in hot environments. Include: how you felt under tropical sun, what water/breaks helped, why heat is normal in boiler rooms, how to stay hydrated.", keywords:["hot","sun","water","breaks","boiler","room","hydrated","tropical"] } }, part2:{ A:{ title:"Emergency Drill Readiness", task:"Write about preparing for weekly drills. Say: how you feel when alarm sounds, what gear to locate first, how knowing muster station avoids confusion, why regular drills support survival.", keywords:["alarm","muster","station","lifejacket","drill","practice","emergency","survival","confusion"] }, B:{ title:"Cultural Diversity on Board", task:"Write about working with international crew. Say: how you feel, what traditions to learn, how to show respect and share customs, why mutual respect supports a peaceful ship.", keywords:["culture","international","crew","respect","traditions","customs","peaceful","teamwork"] } } },
    4: { part1:{ A:{ title:"Blocked Emergency Exit", task:"Write about boxes blocking an exit. Include: what you found, who you asked to clear, why clear exits save lives during fires, what you learned about keeping paths free.", keywords:["exit","blocked","boxes","clear","fire","escape","path","safety"] }, B:{ title:"Homesickness Challenge", task:"Write about feeling lonely during first month. Include: how you felt, what calls/hobbies helped, why homesickness is normal for new seafarers, how to stay positive next voyage.", keywords:["homesick","family","call","lonely","seafarer","positive","voyage","hobby"] } }, part2:{ A:{ title:"Safe Chemical Handling", task:"Write about using chemicals for cleaning. Say: how you feel about gloves/goggles, what SDS to read first, how checking labels avoids burns, why PPE supports hazard-free engine room.", keywords:["chemical","gloves","goggles","SDS","labels","burns","PPE","engine","room","safety"] }, B:{ title:"Sharing Cabin Space", task:"Write about living with a roommate. Say: how you feel in confined space, what rules to agree first, how cleaning bathroom shows respect, why good manners support rest time.", keywords:["cabin","roommate","share","rules","bathroom","respect","rest","sleep"] } } },
    5: { part1:{ A:{ title:"Unlocked Chemical Locker", task:"Write about a dangerous locker left open. Include: what you saw, who you informed, why securing dangerous goods is important, what you learned about shipboard security.", keywords:["chemical","locker","open","informed","chief","officer","secure","security","dangerous"] }, B:{ title:"Night Watch Fatigue Challenge", task:"Write about staying awake past midnight. Include: how you felt during 00-04 watch, what coffee/stretching helped, why fatigue is normal on night watches, how to rest before next watch.", keywords:["night","watch","sleepy","coffee","stretching","fatigue","rest","midnight"] } }, part2:{ A:{ title:"Bunkering Oil Safely", task:"Write about preventing oil spills during refueling. Say: how you feel monitoring tank levels, what absorbent pads/plugs to place first, how constant communication avoids overflows, why checklists support environmental safety.", keywords:["bunkering","oil","spill","tank","level","absorbent","plug","communication","checklist","environment"] }, B:{ title:"Receiving Feedback from Chief Cook", task:"Write about improving based on kitchen feedback. Say: how you feel when corrected, what skills to improve first, how listening to feedback shows respect for seniors, why good kitchen duties help crew health.", keywords:["feedback","cook","kitchen","correct","knife","hygiene","respect","senior","health","crew"] } } }
};

// ======================== SPEAKING DATA ========================
const speakingData = {
    1: { part1:{ title:"Part I – Introduction and Career Life", questions:[
        { q:"What is your favorite color and why?", keywords:["favorite","color","blue","ocean","calm","sea","like"], sample:"My favorite color is blue because it looks like the ocean and makes me feel calm." },
        { q:"What's your dream job?", keywords:["dream","job","captain","officer","container","ship","career"], sample:"My dream job is to become a Captain of a container ship one day." },
        { q:"Why do you want to be a seafarer?", keywords:["travel","world","international","experience","salary","adventure","sea"], sample:"I want to be a seafarer to travel the world, get international experience, and earn a good salary." },
        { q:"Do you enjoy traveling to new places?", keywords:["traveling","new","places","cultures","countries","see","learn"], sample:"Yes, I love traveling because I can see different countries and learn about new cultures." },
        { q:"What languages can you speak?", keywords:["speak","Burmese","English","fluent","language","communication"], sample:"I can speak Burmese and English fluently." },
        { q:"How do you spend your free time?", keywords:["free","time","reading","books","music","exercise","hobbies"], sample:"In my free time, I like reading books, listening to music, and exercising." },
        { q:"What is your duty on board?", keywords:["duty","cadet","assist","officer","bridge","deck","maintenance"], sample:"As a cadet, my duty is to assist senior officers on the bridge and help with deck maintenance." }
    ]}, part2:{ title:"Part II – Understanding the Situation (Task 1: PPE)", questions:[
        { q:"Why must you wear safety boots on deck?", keywords:["protect","feet","heavy","falling","objects","slipping","steel-toe"], sample:"To protect my feet from heavy falling objects and to prevent slipping." },
        { q:"When should you use a helmet?", keywords:["helmet","deck","engine room","maintenance","work","head","protection"], sample:"I should use a helmet whenever I am working on deck, in the engine room, or during maintenance tasks." },
        { q:"What happens if you do not wear gloves?", keywords:["gloves","hurt","hands","sharp","materials","heat","chemicals"], sample:"If I don't wear gloves, I can hurt my hands from sharp materials, heat, or dangerous chemicals." },
        { q:"Who can give you PPE?", keywords:["PPE","Safety Officer","Chief Mate","provide","necessary","equipment"], sample:"The ship's Safety Officer or Chief Mate will provide the necessary PPE." },
        { q:"Why is PPE important at work?", keywords:["PPE","prevents","accidents","protects","crew","injuries","workplace"], sample:"PPE is important because it prevents accidents and protects the crew from workplace injuries." },
        { q:"Where should you wear ear protection?", keywords:["ear","protection","engine room","loud","noise","hearing","damage"], sample:"Ear protection should be worn in the engine room and other areas with loud noise to prevent hearing damage." },
        { q:"How often should PPE be inspected?", keywords:["PPE","inspected","regularly","check","damage","replace","safety"], sample:"PPE should be inspected regularly for any damage and replaced immediately if it is no longer safe." }
    ]}, part3:{ title:"Part III – Debate Conversation (Topic: Stress Management)", warmups:[
        { q:"What causes stress on a ship?", keywords:["stress","long","hours","away","family","weather","workload"], sample:"Long working hours, staying away from family, and rough weather can cause stress on a ship." },
        { q:"How can teamwork reduce stress?", keywords:["teamwork","share","workload","support","mental","pressure","safer"], sample:"Teamwork helps share the workload, which makes tasks easier and reduces mental pressure." },
        { q:"What do you do when you feel stressed?", keywords:["stressed","exercise","listen","music","talk","crewmates","relax"], sample:"When I feel stressed, I like to exercise, listen to music, or talk to my crewmates." }
    ], debates:[
        { statement:"'Team support reduces stress.'", keywords:["agree","support","safer","relaxed","team","helps"], sample:"I agree, because knowing your team has your back helps you feel safer and more relaxed." },
        { statement:"'Stress makes people work better.'", keywords:["disagree","too much","panic","mistakes","accidents"], sample:"I disagree, because too much stress causes panic, mistakes, and accidents." },
        { statement:"'Talking about stress is important.'", keywords:["agree","sharing","feelings","solves","problems","mental","exhaustion"], sample:"I agree, because sharing your feelings helps solve problems and prevents mental exhaustion." },
        { statement:"'A calm team works more effectively.'", keywords:["agree","calm","think","clearly","execute","safety","procedures"], sample:"I agree, because a calm team can think clearly and execute safety procedures perfectly." },
        { statement:"'Senior officers should help junior crew manage stress.'", keywords:["agree","senior","officers","junior","mentor","guide","support"], sample:"I agree, senior officers have experience and can guide junior crew to handle stress better." }
    ]} },
    2: { part1:{ title:"Part I – Introduction and Career Life", questions:[
        { q:"Where do you live and what do you like about it?", keywords:["live","Yangon","city","friendly","people","beautiful","home"], sample:"I live in Yangon. I like it because it is a lively city with friendly people and beautiful places." },
        { q:"Why did you choose the maritime sector for your career?", keywords:["chose","maritime","career","growth","adventure","discipline","travel"], sample:"I chose this sector because it offers great career growth, professional discipline, and a chance to explore the world." },
        { q:"Who inspires you the most in your life?", keywords:["inspire","parents","hard work","honest","teacher","family"], sample:"My parents inspire me the most because they always teach me to work hard and stay honest." },
        { q:"Do you prefer working in the day or at night?", keywords:["day","night","visibility","natural","prefer","watch"], sample:"I prefer working in the day because there is better visibility and it feels more natural." },
        { q:"What computer skills do you have?", keywords:["computer","Microsoft","Office","email","files","skills"], sample:"I know how to use Microsoft Office, check emails, and manage digital files properly." },
        { q:"How do you keep yourself healthy and fit?", keywords:["fit","exercise","running","push-ups","healthy","food","diet"], sample:"I keep fit by doing regular exercises like running and push-ups, and by eating healthy food." },
        { q:"What is the most exciting part of living on a ship?", keywords:["exciting","ship","sunrise","new","country","travel","sea"], sample:"The most exciting part is waking up in a new country and seeing the beautiful sunrises at sea." }
    ]}, part2:{ title:"Part II – Understanding the Situation (Task 2: Daily Ship Routine)", questions:[
        { q:"What time do you start working on the ship?", keywords:["start","work","0800","watch","schedule","duty"], sample:"Usually, normal deck work starts at 08:00 hours, but watchkeeping depends on my schedule." },
        { q:"Who tells you about your daily tasks?", keywords:["tasks","Chief Officer","Bosun","briefing","morning"], sample:"The Chief Officer or the Bosun tells us about our daily tasks during the morning briefing." },
        { q:"Why must you arrive on time?", keywords:["arrive","on time","discipline","relieve","watch","punctual"], sample:"I must arrive on time to show discipline and to relieve the previous watchkeeping crew without delay." },
        { q:"What should you bring to work each day?", keywords:["bring","PPE","notebook","pen","tools","safety"], sample:"I should bring my proper PPE, a notebook, a pen, and the right tools for my assigned task." },
        { q:"Why is it important to follow the schedule?", keywords:["schedule","smooth","safely","operation","time","finish"], sample:"It is important so that all ship operations can run smoothly, safely, and finish on time." },
        { q:"What happens if you miss a briefing?", keywords:["miss","briefing","information","task","safety","mistake"], sample:"If I miss the briefing, I may not know my tasks and could make a safety mistake." },
        { q:"How do you stay alert during your watch?", keywords:["alert","watch","coffee","stretch","rested","focus"], sample:"I stay alert by getting enough rest before watch, drinking coffee, and stretching if I feel tired." }
    ]}, part3:{ title:"Part III – Debate Conversation (Topic: Safety Drills)", warmups:[
        { q:"What are safety drills?", keywords:["safety","drills","practice","emergency","fire","abandon"], sample:"Safety drills are regular practice sessions that teach the crew how to handle emergencies like fire or flooding." },
        { q:"Why are drills important?", keywords:["important","drills","respond","quickly","correctly","emergency"], sample:"They are important because they train us to respond quickly and correctly during a real emergency." },
        { q:"How often should drills happen?", keywords:["often","drills","monthly","regular","regulation"], sample:"Drills should happen regularly, usually once every month, according to maritime regulations." }
    ], debates:[
        { statement:"'Drills prepare teams for emergencies.'", keywords:["agree","drills","prepare","muscle","memory","critical"], sample:"I agree completely, because regular practice builds muscle memory for critical situations." },
        { statement:"'Drills are boring but necessary.'", keywords:["agree","boring","necessary","repetitive","skills","sharp"], sample:"I agree, because even if they feel repetitive, they keep our safety skills sharp." },
        { statement:"'Frequent drills improve safety.'", keywords:["agree","frequent","improve","practice","fewer","mistakes"], sample:"I agree, because the more we practice, the fewer mistakes we will make during a crisis." },
        { statement:"'Teams should take drills seriously.'", keywords:["agree","seriously","mistake","drill","disaster","real"], sample:"I agree, because a small mistake during a drill could mean a disaster in a real emergency." },
        { statement:"'Drills are a waste of time.'", keywords:["disagree","waste","time","save","lives","protect"], sample:"I disagree, because drills save lives and protect the ship." }
    ]} },
    3: { part1:{ title:"Part I – Introduction and Career Life", questions:[
        { q:"What was your favorite subject in school and why?", keywords:["favorite","subject","Maths","solve","logical","problems"], sample:"My favorite subject was Mathematics because I enjoy solving logical problems." },
        { q:"How do you feel about leaving your family for long contracts?", keywords:["family","contracts","difficult","support","career","strong"], sample:"It is difficult to stay away from family, but I stay strong to support them and build my career." },
        { q:"What are the essential qualities of a good seafarer?", keywords:["qualities","disciplined","hardworking","responsible","team","player"], sample:"A good seafarer must be disciplined, hardworking, highly responsible, and a good team player." },
        { q:"Do you like cooking or trying new foods?", keywords:["cooking","foods","traditional","countries","enjoy","try"], sample:"I don't cook much, but I really enjoy trying traditional foods from different countries." },
        { q:"How do you handle difficult weather conditions?", keywords:["weather","calm","protocols","secured","deck","safety"], sample:"I handle it by staying calm, following all safety protocols, and ensuring everything on deck is tightly secured." },
        { q:"What are your long-term career goals in five years?", keywords:["goals","officer","Second","exams","qualified","promotion"], sample:"In five years, I hope to pass my officer exams and become a qualified Second Officer." },
        { q:"How do you stay connected with friends when you are away?", keywords:["connected","social","media","internet","messaging","apps"], sample:"I stay connected by using social media and messaging apps whenever the ship has internet access." }
    ]}, part2:{ title:"Part II – Understanding the Situation (Task 3: Handling Emergency Alarms)", questions:[
        { q:"What should you do immediately when you hear the general alarm?", keywords:["alarm","stop","muster","station","immediately"], sample:"I must stop whatever I am doing and go to my designated muster station immediately." },
        { q:"Where is your designated muster station located?", keywords:["muster","station","boat","deck","Muster List","location"], sample:"It is usually located on the boat deck, but I must check the vessel's Muster List to be absolutely sure." },
        { q:"What personal emergency gear must you collect from your cabin?", keywords:["gear","lifejacket","immersion","suit","clothing","discharge","book"], sample:"I must collect my lifejacket, immersion suit, warm clothing, and my discharge book." },
        { q:"Who is responsible for counting the crew at the station?", keywords:["count","Officer","Charge","muster","responsible"], sample:"The Officer in Charge of that specific muster station is responsible for counting and checking the crew." },
        { q:"Why is calm behavior critical during an emergency?", keywords:["calm","think","clearly","listen","panic","safety"], sample:"Staying calm helps us think clearly, listen to orders correctly, and avoid dangerous panic on board." },
        { q:"What happens if you go to the wrong muster station?", keywords:["wrong","station","count","confusion","delay","search"], sample:"If I go to the wrong station, it causes confusion and delay in the emergency count." },
        { q:"How do you know which lifeboat to board?", keywords:["lifeboat","assignment","muster","list","station","boat"], sample:"The muster list tells me which lifeboat I am assigned to." }
    ]}, part3:{ title:"Part III – Debate Conversation (Topic: Language Barriers)", warmups:[
        { q:"What language problems can happen on a ship?", keywords:["language","misunderstand","orders","safety","signs","different"], sample:"Crew members might misunderstand orders or safety signs if they don't speak the same language." },
        { q:"How can teams communicate with language differences?", keywords:["communicate","standard","phrases","simple","English","gestures"], sample:"Teams can use standard marine phrases, simple English words, and clear hand gestures to communicate." },
        { q:"Why is clear language important?", keywords:["clear","language","confusion","operations","safely"], sample:"Clear language is important to avoid confusion and to ensure all operations are done safely." }
    ], debates:[
        { statement:"'Language barriers affect teamwork.'", keywords:["agree","barriers","fail","coordinate","smoothly"], sample:"I agree, because if communication fails, the crew cannot coordinate their tasks smoothly." },
        { statement:"'Simple language improves communication.'", keywords:["agree","simple","basic","direct","prevents","confusion"], sample:"I agree, because using basic and direct words prevents confusion among international crew." },
        { statement:"'Everyone should speak one common language.'", keywords:["agree","common","Maritime","English","same","page"], sample:"I agree, and that language should be Maritime English so that everyone is on the same page." },
        { statement:"'Misunderstandings can cause accidents.'", keywords:["agree","misheard","command","heavy","operations","injuries"], sample:"I agree completely, because a misheard command during heavy operations can lead to injuries." },
        { statement:"'Gestures are enough for communication.'", keywords:["disagree","gestures","not","enough","complex","emergency"], sample:"I disagree, gestures are not enough for complex tasks and emergencies." }
    ]} },
    4: { part1:{ title:"Part I – Introduction and Career Life", questions:[
        { q:"What is your favorite type of weather and why?", keywords:["weather","sunny","clear","deck","work","safer"], sample:"I like clear, sunny weather because it makes deck work much safer and easier." },
        { q:"What training courses have you completed recently?", keywords:["training","BST","Security","Awareness","courses"], sample:"I have recently completed my Basic Safety Training (BST) and Security Awareness courses." },
        { q:"Why is English communication important for international crews?", keywords:["English","important","standard","maritime","avoid","misunderstandings"], sample:"English is important because it is the standard maritime language used to avoid misunderstandings on board." },
        { q:"Do you prefer indoor tasks or outdoor tasks on deck?", keywords:["outdoor","active","fresh","air","deck"], sample:"I prefer outdoor tasks because I enjoy being active on deck and breathing fresh air." },
        { q:"What hobbies do you plan to practice during off-duty hours?", keywords:["hobbies","study","books","watch","movies","table","tennis"], sample:"I plan to study maritime books, watch educational videos, or play table tennis with my crewmates." },
        { q:"How do you react when someone gives you constructive feedback?", keywords:["feedback","positively","thank","improve","working","habits"], sample:"I accept it positively, thank them, and use it to improve my working habits." },
        { q:"What type of vessel do you hope to join first?", keywords:["vessel","bulk","carrier","container","basic","training"], sample:"I hope to join a bulk carrier or a container ship because they provide excellent basic training for beginners." }
    ]}, part2:{ title:"Part II – Understanding the Situation (Task 4: Maintenance & Housekeeping)", questions:[
        { q:"Why must oily rags be thrown into specific covered bins?", keywords:["oily","rags","spontaneous","combustion","fire"], sample:"To prevent spontaneous combustion which can cause a serious fire in the workspace." },
        { q:"When should the deck department perform rust removal?", keywords:["rust","removal","regularly","dry","weather"], sample:"They should do it regularly during normal maintenance hours when weather conditions are completely dry." },
        { q:"What happens if tools are left scattered on the walkways?", keywords:["tools","scattered","tripping","hazard","injuries"], sample:"It creates a serious tripping hazard and can cause painful injuries to the crew moving on deck." },
        { q:"Who inspects the cleanliness of the engine room daily?", keywords:["cleanliness","Second","Engineer","Chief","daily"], sample:"The Second Engineer and Chief Engineer inspect the engine room cleanliness on a daily basis." },
        { q:"Why is proper maintenance connected to avoiding accidents?", keywords:["maintenance","machinery","correctly","unexpected","failures"], sample:"Proper maintenance ensures that all gear and machinery work correctly, preventing unexpected failures and accidents." },
        { q:"What should you do with a broken tool?", keywords:["broken","tool","report","bosun","repair","replace"], sample:"I should report the broken tool to the bosun and have it repaired or replaced." },
        { q:"How do you dispose of used paint cans?", keywords:["paint","cans","hazardous","waste","MARPOL","garbage"], sample:"Used paint cans are hazardous waste and must be disposed of according to MARPOL regulations." }
    ]}, part3:{ title:"Part III – Debate Conversation (Topic: Shipboard Discipline)", warmups:[
        { q:"What are the most common rules on a vessel?", keywords:["rules","PPE","watch","schedule","alcohol","smoking"], sample:"Common rules include wearing full PPE, following watch schedules, and no alcohol consumption on board." },
        { q:"Why do we need strict discipline at sea?", keywords:["discipline","sea","unforgiving","keeps","operations","safe"], sample:"We need strict discipline because the sea can be unforgiving, and discipline keeps operations safe." },
        { q:"Who ensures everyone follows the regulations?", keywords:["Captain","senior","officers","regulations","follow"], sample:"The Captain and the senior officers ensure that everyone follows shipboard regulations." }
    ], debates:[
        { statement:"'Strict discipline keeps the ship safe.'", keywords:["agree","discipline","ensures","never","ignored","bypassed"], sample:"I agree, because it ensures that safety rules are never ignored or bypassed." },
        { statement:"'Some rules are too difficult to follow.'", keywords:["disagree","rules","designed","protect","lives","experience"], sample:"I disagree, because every rule on board is designed based on past experiences to protect our lives." },
        { statement:"'Breaking minor rules does not matter.'", keywords:["disagree","minor","build","up","major","accident"], sample:"I disagree, because minor mistakes can build up and lead to a major accident later." },
        { statement:"'An organized crew works faster.'", keywords:["agree","organized","knows","roles","flows","smoothly"], sample:"I agree, because when everyone knows the rules and their specific roles, work flows smoothly." },
        { statement:"'Discipline is only for junior crew.'", keywords:["disagree","discipline","everyone","equal","safety"], sample:"I disagree, discipline applies to everyone on board equally." }
    ]} },
    5: { part1:{ title:"Part I – Introduction and Career Life", questions:[
        { q:"Who is your best friend on board or in training?", keywords:["best","friend","roommate","help","study","training"], sample:"My roommate during training is my best friend because we always help each other study." },
        { q:"What are the main challenges of sharing a cabin space?", keywords:["cabin","privacy","clean","limited","space","tidy"], sample:"The main challenges are respecting each other's privacy and keeping the limited space clean and tidy." },
        { q:"How do you motivate yourself during a tiring shift?", keywords:["motivate","duties","family","stay","strong","remind"], sample:"I remind myself of my duties and think about supporting my family to stay motivated." },
        { q:"Do you think maritime life changes a person's character?", keywords:["character","independent","disciplined","responsible"], sample:"Yes, I think it makes a person much more independent, disciplined, and responsible." },
        { q:"What is the first thing you want to buy with your salary?", keywords:["salary","laptop","study","officer","exams"], sample:"I want to buy a good laptop to help me study for my future officer examinations." },
        { q:"How do you handle disagreements with colleagues?", keywords:["disagreement","calm","privately","solve","professionally"], sample:"I handle it by staying calm, talking privately, and focusing on solving the problem professionally." },
        { q:"What advice would you give to a brand-new cadet?", keywords:["advice","cadet","listen","officers","PPE","ask","questions"], sample:"I would advise them to listen carefully to senior officers, always wear PPE, and never hesitate to ask questions." }
    ]}, part2:{ title:"Part II – Understanding the Situation (Task 5: Galley Hygiene)", questions:[
        { q:"Why must the galley staff wear gloves and hairnets?", keywords:["gloves","hairnets","clean","contamination","hair","food"], sample:"To keep the food perfectly clean and prevent any contamination or hair from falling into the meals." },
        { q:"When should the fresh water tanks be checked for quality?", keywords:["water","tanks","checked","regularly","port","fresh"], sample:"They should be checked regularly, especially before taking in new fresh water supplies at a port." },
        { q:"What happens if meat is stored in a broken refrigerator?", keywords:["meat","spoil","bad","poisoning","crew","refrigerator"], sample:"The meat will spoil and go bad, which can cause severe food poisoning for the whole crew." },
        { q:"Who decides the weekly menu adjustments for the crew?", keywords:["menu","Chief","Cook","Captain","approval"], sample:"The Chief Cook decides the menu, usually with the approval of the Captain or Chief Mate." },
        { q:"Why does healthy food improve the energy of the seafarers?", keywords:["healthy","food","nutrients","energy","physical","work"], sample:"Healthy food provides the necessary nutrients and energy required to perform hard physical work safely at sea." },
        { q:"What should you do if you find a pest in the galley?", keywords:["pest","galley","report","chief","cook","hygiene"], sample:"I should report it to the Chief Cook immediately to maintain hygiene." },
        { q:"How often should the galley be sanitized?", keywords:["sanitized","daily","after","meal","clean"], sample:"The galley should be sanitized daily and after every meal preparation." }
    ]}, part3:{ title:"Part III – Debate Conversation (Topic: Working with Seniors)", warmups:[
        { q:"How do you feel about talking to senior officers?", keywords:["talking","senior","respectful","confident","etiquette"], sample:"I feel respectful but confident, as long as I follow proper bridge and ship etiquette." },
        { q:"What can a beginner learn from an experienced engineer or captain?", keywords:["learn","real-world","problem-solving","safety","tips","books"], sample:"A beginner can learn real-world problem-solving skills and practical safety tips that aren't in books." },
        { q:"Why is asking questions important?", keywords:["asking","questions","doubts","avoid","mistakes","dangerous"], sample:"Asking questions is important to clear up any doubts and avoid making dangerous operational mistakes." }
    ], debates:[
        { statement:"'Seniors are always right.'", keywords:["disagree","experience","anyone","mistake","checklists","correct"], sample:"I disagree; while seniors have great experience, anyone can make a mistake. What matters is following correct safety checklists." },
        { statement:"'Asking questions shows that you want to learn.'", keywords:["agree","asking","shows","active","careful","eager","improve"], sample:"I agree 100%, because it shows that a junior crew member is active, careful, and eager to improve." },
        { statement:"'Young crew members have better modern technical skills.'", keywords:["agree","extent","younger","familiar","digital","software"], sample:"I agree to an extent, as younger crew are often more familiar with modern digital devices and software." },
        { statement:"'Respecting seniors is the most important shipboard rule.'", keywords:["agree","proper","hierarchy","mutual","respect","command","safety"], sample:"I agree, because a proper hierarchy and mutual respect are essential for maintaining command and safety on board." },
        { statement:"'Juniors should not question seniors.'", keywords:["disagree","question","safety","unsafe","challenge","improve"], sample:"I disagree; if something seems unsafe, juniors must speak up for safety." }
    ]} }
};
// Demo Data = Set 1
const demoData = {
    grammar: { title:"📖 Grammar Demo", questions: grammarData[1].questions },
    reading: { title:"📰 Reading Demo", passages: readingData[1].passages },
    listening: { title:"🎧 Listening Demo", task2: listeningData[1].task2, task3: listeningData[1].task3, audioTask2: listeningData[1].audioFiles.task2, audioTask3: listeningData[1].audioFiles.task3 },
    writing: { title:"✍️ Writing Demo", part1: writingData[1].part1, part2: writingData[1].part2 },
    speaking: { title:"🗣️ Speaking Demo", part1: speakingData[1].part1, part2: speakingData[1].part2, part3: speakingData[1].part3 }
};

// ======================== SET BUTTONS ========================
function generateSetButtons(section) {
    const container = document.getElementById(`${section}SetButtons`);
    if (!container) return;
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<button class="set-btn" onclick="loadSet('${section}', ${i})">
            <span class="set-number">Set ${i}</span>
            <span class="set-level">${getLevel(i)}</span>
        </button>`;
    }
    container.innerHTML = html;
}
function getLevel(i) { return {1:'Beginner (A1)',2:'Elementary (A2)',3:'Pre-Intermediate (B1)',4:'Intermediate (B1+)',5:'Upper-Intermediate (B2)'}[i]||''; }
// ======================== SET BUTTONS & LOADERS ========================
let currentSets = { grammar:1, reading:1, writing:1, listening:1, speaking:1 };
function loadSet(section, setNum) {
    currentSets[section] = setNum;
    document.getElementById(`${section}SetSelection`).style.display = 'none';
    const data = section === 'grammar' ? grammarData[setNum] : section === 'reading' ? readingData[setNum] : section === 'listening' ? listeningData[setNum] : section === 'writing' ? writingData[setNum] : speakingData[setNum];
    if (!data) return;
    if (section === 'grammar') loadGrammarContent(data);
    else if (section === 'reading') loadReadingContent(data);
    else if (section === 'listening') loadListeningContent(data);
    else if (section === 'writing') loadWritingContent(data);
    else if (section === 'speaking') loadSpeakingContent(data);
    document.getElementById(`${section}Questions`).style.display = 'block';
    document.getElementById(`${section}BackBtn`).style.display = 'block';
    const submitBtn = document.getElementById(`submit${capitalize(section)}Btn`);
    if (submitBtn) submitBtn.style.display = 'block';
    document.getElementById(`${section}Result`).innerHTML = '';
    document.getElementById(`${section}Questions`).scrollIntoView({ behavior:'smooth' });
}
function backToSets(section) {
    document.getElementById(`${section}SetSelection`).style.display = 'block';
    document.getElementById(`${section}Questions`).style.display = 'none';
    document.getElementById(`${section}BackBtn`).style.display = 'none';
    const submitBtn = document.getElementById(`submit${capitalize(section)}Btn`);
    if (submitBtn) submitBtn.style.display = 'none';
    document.getElementById(`${section}Result`).innerHTML = '';
}
// ======================== CONTENT LOADERS ========================
function loadGrammarContent(data) {
    let html = `<h3>📖 Grammar - Set ${currentSets.grammar}</h3>`;
    data.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="gq${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    document.getElementById('grammarQuestions').innerHTML = html;
    window._grammarData = data;
}

function loadReadingContent(data) {
    let html = `<h3>📰 Reading - Set ${currentSets.reading}</h3>`;
    let qNum = 1;
    data.passages.forEach(pass => {
        html += `<div class="reading-passage"><h4>${pass.title}</h4><p>${pass.text}</p>`;
        pass.questions.forEach(q => {
            html += `<div class="question"><p><strong>${qNum++}.</strong> ${q.q}</p>
            <select id="rq${qNum-2}">
                <option value="">Select</option>
                <option value="T">True</option>
                <option value="F">False</option>
                <option value="D">Doesn't Say</option>
            </select></div>`;
        });
        html += `</div>`;
    });
    document.getElementById('readingQuestions').innerHTML = html;
    // Store flat answers array
    let allAnswers = [];
    data.passages.forEach(p => p.questions.forEach(q => allAnswers.push(q.ans)));
    window._readingAnswers = allAnswers;
}

function loadListeningContent(data) {
    let html = `<h3>🎧 Listening - Set ${currentSets.listening}</h3>`;
    // Task 2
    html += `<div class="card"><h4>Task 2: ${data.task2.title}</h4>
        <div class="audio-container"><audio controls><source src="${data.audioFiles.task2}" type="audio/mpeg"></audio></div>`;
    data.task2.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l2q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div>`;
    // Task 3
    html += `<div class="card"><h4>Task 3: ${data.task3.title}</h4>
        <div class="audio-container"><audio controls><source src="${data.audioFiles.task3}" type="audio/mpeg"></audio></div>`;
    data.task3.questions.forEach((q, i) => {
        html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
        q.opts.forEach(opt => { html += `<label><input type="radio" name="l3q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
        html += `</div></div>`;
    });
    html += `</div>`;
    document.getElementById('listeningQuestions').innerHTML = html;
    // Store answers
    window._listeningTask2Answers = data.task2.questions.map(q => q.ans);
    window._listeningTask3Answers = data.task3.questions.map(q => q.ans);
}

function loadWritingContent(data) {
    let html = `<h3>✍️ Writing - Set ${currentSets.writing}</h3>`;
    // Part 1
    html += `<div class="card"><h4>Part 1 (approx. 25 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card"><h5>Option A: ${data.part1.A.title}</h5><p>${data.part1.A.task}</p><textarea id="w1A" rows="3" placeholder="Type here..."></textarea></div>
            <div class="option-card"><h5>Option B: ${data.part1.B.title}</h5><p>${data.part1.B.task}</p><textarea id="w1B" rows="3" placeholder="Type here..."></textarea></div>
        </div></div>`;
    // Part 2
    html += `<div class="card"><h4>Part 2 (80–100 words) – Choose ONE</h4>
        <div class="writing-options">
            <div class="option-card"><h5>Option A: ${data.part2.A.title}</h5><p>${data.part2.A.task}</p><textarea id="w2A" rows="5" placeholder="Type here..."></textarea></div>
            <div class="option-card"><h5>Option B: ${data.part2.B.title}</h5><p>${data.part2.B.task}</p><textarea id="w2B" rows="5" placeholder="Type here..."></textarea></div>
        </div></div>`;
    document.getElementById('writingQuestions').innerHTML = html;
    window._writingData = data;
}

function loadSpeakingContent(data) {
    let html = `<h3>🗣️ Speaking - Set ${currentSets.speaking}</h3>`;
    // Part I
    html += `<h4>${data.part1.title}</h4>`;
    data.part1.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p>
        <textarea id="sp1_${i}" rows="2" placeholder="Type your answer..."></textarea>
        <button class="back-btn" style="margin-top:5px;" onclick="toggleSample('sp1_sample_${i}')">📋 Show Sample</button>
        <div id="sp1_sample_${i}" style="display:none; background:#eef5fa; padding:10px; border-radius:6px; margin-top:5px;">💡 ${q.sample}</div></div>`;
    });
    // Part II
    html += `<h4>${data.part2.title}</h4>`;
    data.part2.questions.forEach((q, i) => {
        html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p>
        <textarea id="sp2_${i}" rows="2" placeholder="Type your answer..."></textarea>
        <button class="back-btn" style="margin-top:5px;" onclick="toggleSample('sp2_sample_${i}')">📋 Show Sample</button>
        <div id="sp2_sample_${i}" style="display:none; background:#eef5fa; padding:10px; border-radius:6px; margin-top:5px;">💡 ${q.sample}</div></div>`;
    });
    // Part III warmups
    html += `<h4>${data.part3.title} – Warm-up Questions</h4>`;
    data.part3.warmups.forEach((q, i) => {
        html += `<div class="card"><p><strong>Warm-up ${i+1}:</strong> ${q.q}</p>
        <textarea id="sp3w_${i}" rows="2" placeholder="Type your answer..."></textarea>
        <button class="back-btn" style="margin-top:5px;" onclick="toggleSample('sp3w_sample_${i}')">📋 Show Sample</button>
        <div id="sp3w_sample_${i}" style="display:none; background:#eef5fa; padding:10px; border-radius:6px; margin-top:5px;">💡 ${q.sample}</div></div>`;
    });
    // Part III debates
    html += `<h4>Debate Statements (Agree or Disagree)</h4>`;
    data.part3.debates.forEach((q, i) => {
        html += `<div class="card"><p><strong>Statement ${i+1}:</strong> ${q.statement}</p>
        <textarea id="sp3d_${i}" rows="2" placeholder="Type your response..."></textarea>
        <button class="back-btn" style="margin-top:5px;" onclick="toggleSample('sp3d_sample_${i}')">📋 Show Sample</button>
        <div id="sp3d_sample_${i}" style="display:none; background:#eef5fa; padding:10px; border-radius:6px; margin-top:5px;">💡 ${q.sample}</div></div>`;
    });
    document.getElementById('speakingQuestions').innerHTML = html;
    window._speakingData = data;
}

function toggleSample(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ======================== SUBMIT HANDLERS ========================
function submitGrammar() {
    const data = window._grammarData;
    if (!data) return;
    let score = 0;
    data.questions.forEach((q, i) => {
        const sel = document.querySelector(`input[name="gq${i}"]:checked`);
        if (sel && sel.value === q.ans) score++;
    });
    showResult('grammar', score, data.questions.length);
}

function submitReading() {
    const answers = window._readingAnswers;
    if (!answers) return;
    let score = 0;
    answers.forEach((ans, i) => {
        const sel = document.getElementById(`rq${i}`);
        if (sel && sel.value === ans) score++;
    });
    showResult('reading', score, answers.length);
}

function submitListening() {
    const t2Answers = window._listeningTask2Answers || [];
    const t3Answers = window._listeningTask3Answers || [];
    let score = 0, total = t2Answers.length + t3Answers.length;
    t2Answers.forEach((ans, i) => {
        const sel = document.querySelector(`input[name="l2q${i}"]:checked`);
        if (sel && sel.value === ans) score++;
    });
    t3Answers.forEach((ans, i) => {
        const sel = document.querySelector(`input[name="l3q${i}"]:checked`);
        if (sel && sel.value === ans) score++;
    });
    showResult('listening', score, total);
}

function submitWriting() {
    const data = window._writingData;
    if (!data) return;
    // Grade Part 1
    let part1Score = 0;
    const text1A = document.getElementById('w1A')?.value || '';
    const text1B = document.getElementById('w1B')?.value || '';
    const text1 = text1A.length >= text1B.length ? text1A : text1B; // choose the one with more content
    const kw1A = data.part1.A.keywords;
    const kw1B = data.part1.B.keywords;
    const kw1 = text1 === text1A ? kw1A : kw1B;
    let c = 0;
    kw1.forEach(k => { if (text1.toLowerCase().includes(k)) c++; });
    part1Score = Math.min(10, c * 2);
    // Grade Part 2
    let part2Score = 0;
    const text2A = document.getElementById('w2A')?.value || '';
    const text2B = document.getElementById('w2B')?.value || '';
    const text2 = text2A.length >= text2B.length ? text2A : text2B;
    const kw2A = data.part2.A.keywords;
    const kw2B = data.part2.B.keywords;
    const kw2 = text2 === text2A ? kw2A : kw2B;
    c = 0;
    kw2.forEach(k => { if (text2.toLowerCase().includes(k)) c++; });
    part2Score = Math.min(15, Math.floor(c * 1.5));
    const totalScore = part1Score + part2Score;
    // Show sample answers
    let sampleHtml = '<h4>📌 Your Answers</h4>';
    sampleHtml += `<p><strong>Part 1 (${text1 === text1A ? 'Option A' : 'Option B'}):</strong> ${text1 || 'Not answered'}</p>`;
    sampleHtml += `<p><strong>Part 2 (${text2 === text2A ? 'Option A' : 'Option B'}):</strong> ${text2 || 'Not answered'}</p>`;
    document.getElementById('writingSampleResult').innerHTML = sampleHtml;
    document.getElementById('writingSampleResult').style.display = 'block';
    showResult('writing', totalScore, 25);
}

function submitSpeaking() {
    const data = window._speakingData;
    if (!data) return;
    let totalScore = 0, maxScore = 0;
    // Part 1 (7 Qs, each maxScore 3) – total 21
    data.part1.questions.forEach((q, i) => {
        const text = document.getElementById(`sp1_${i}`)?.value || '';
        let c = 0;
        q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
        totalScore += Math.min(q.maxScore || 3, c);
        maxScore += (q.maxScore || 3);
    });
    // Part 2 (7 Qs, each maxScore 3)
    data.part2.questions.forEach((q, i) => {
        const text = document.getElementById(`sp2_${i}`)?.value || '';
        let c = 0;
        q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
        totalScore += Math.min(q.maxScore || 3, c);
        maxScore += (q.maxScore || 3);
    });
    // Part 3 warmups (3 Qs, each maxScore 1) – speaking data may not have maxScore, default to 1
    data.part3.warmups.forEach((q, i) => {
        const text = document.getElementById(`sp3w_${i}`)?.value || '';
        let c = 0;
        q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
        totalScore += Math.min(1, c);
        maxScore += 1;
    });
    // Part 3 debates (5 Qs, each maxScore 1)
    data.part3.debates.forEach((q, i) => {
        const text = document.getElementById(`sp3d_${i}`)?.value || '';
        let c = 0;
        q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
        totalScore += Math.min(1, c);
        maxScore += 1;
    });
    showResult('speaking', totalScore, maxScore);
}

// ======================== RESULT DISPLAY ========================
function showResult(section, score, total) {
    const pct = Math.round((score / total) * 100);
    const g = getGrade(pct);
    document.getElementById(`${section}Result`).innerHTML = `
        <div class="result-card">
            <h4>📊 ${capitalize(section)} Result - Set ${currentSets[section]}</h4>
            <div class="result-score-circle"><span class="big-score">${pct}%</span><span>${score}/${total}</span></div>
            <div class="result-grade ${g.class}">${g.emoji} ${g.text}</div>
            <button class="back-btn" onclick="backToSets('${section}')">⬅ Try Another Set</button>
        </div>`;
    document.getElementById(`${section}Result`).scrollIntoView({ behavior: 'smooth' });
}

function getGrade(pct) {
    if (pct >= 90) return { class: 'grade-excellent', emoji: '🏆', text: 'Excellent! (A+)' };
    if (pct >= 80) return { class: 'grade-excellent', emoji: '🌟', text: 'Very Good! (A)' };
    if (pct >= 70) return { class: 'grade-good', emoji: '👍', text: 'Good! (B)' };
    if (pct >= 60) return { class: 'grade-good', emoji: '✅', text: 'Satisfactory (C)' };
    if (pct >= 50) return { class: 'grade-fair', emoji: '📚', text: 'Needs Improvement (D)' };
    return { class: 'grade-poor', emoji: '💪', text: 'Keep Studying! (F)' };
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ======================== DEMO SYSTEM ========================
function openDemo(section) {
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('demoSection').style.display = 'block';
    const data = demoData[section];
    document.getElementById('demoTitle').textContent = data.title;
    let html = '';
    if (section === 'grammar') {
        html = `<h4>Grammar Demo</h4>`;
        data.questions.forEach((q, i) => {
            html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
            q.opts.forEach(opt => { html += `<label><input type="radio" name="dgq${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
            html += `</div></div>`;
        });
    } else if (section === 'reading') {
        html = `<h4>Reading Demo</h4>`;
        let qNum = 1;
        data.passages.forEach(pass => {
            html += `<div class="reading-passage"><h5>${pass.title}</h5><p>${pass.text}</p>`;
            pass.questions.forEach(q => {
                html += `<div class="question"><p><strong>${qNum++}.</strong> ${q.q}</p>
                <select id="drq${qNum-2}"><option value="">Select</option><option value="T">True</option><option value="F">False</option><option value="D">Doesn't Say</option></select></div>`;
            });
            html += `</div>`;
        });
        window._demoReadingAns = [];
        data.passages.forEach(p => p.questions.forEach(q => window._demoReadingAns.push(q.ans)));
    } else if (section === 'listening') {
        html = `<h4>Listening Demo</h4>
            <div class="audio-container"><audio controls><source src="${data.audioTask2}" type="audio/mpeg"></audio></div>
            <p>Task 2 Questions:</p>`;
        data.task2.questions.forEach((q, i) => {
            html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
            q.opts.forEach(opt => { html += `<label><input type="radio" name="dl2q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
            html += `</div></div>`;
        });
        html += `<div class="audio-container"><audio controls><source src="${data.audioTask3}" type="audio/mpeg"></audio></div><p>Task 3 Questions:</p>`;
        data.task3.questions.forEach((q, i) => {
            html += `<div class="question"><p><strong>${i+1}.</strong> ${q.q}</p><div class="options">`;
            q.opts.forEach(opt => { html += `<label><input type="radio" name="dl3q${i}" value="${opt.charAt(0)}"> ${opt}</label>`; });
            html += `</div></div>`;
        });
        window._demoListAns2 = data.task2.questions.map(q => q.ans);
        window._demoListAns3 = data.task3.questions.map(q => q.ans);
    } else if (section === 'writing') {
        html = `<h4>Writing Demo</h4>
            <div class="card"><h5>Part 1 – Choose ONE</h5>
                <p>Option A: ${data.part1.A.title}</p><p>${data.part1.A.task}</p><textarea id="dw1A" rows="3"></textarea>
                <p>Option B: ${data.part1.B.title}</p><p>${data.part1.B.task}</p><textarea id="dw1B" rows="3"></textarea>
            </div>
            <div class="card"><h5>Part 2 – Choose ONE</h5>
                <p>Option A: ${data.part2.A.title}</p><p>${data.part2.A.task}</p><textarea id="dw2A" rows="5"></textarea>
                <p>Option B: ${data.part2.B.title}</p><p>${data.part2.B.task}</p><textarea id="dw2B" rows="5"></textarea>
            </div>`;
        window._demoWritingData = data;
    } else if (section === 'speaking') {
        html = `<h4>Speaking Demo</h4>`;
        data.part1.questions.forEach((q, i) => {
            html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="dsp1_${i}" rows="2"></textarea></div>`;
        });
        data.part2.questions.forEach((q, i) => {
            html += `<div class="card"><p><strong>Q${i+1}:</strong> ${q.q}</p><textarea id="dsp2_${i}" rows="2"></textarea></div>`;
        });
        data.part3.warmups.forEach((q, i) => {
            html += `<div class="card"><p><strong>Warm-up ${i+1}:</strong> ${q.q}</p><textarea id="dsp3w_${i}" rows="2"></textarea></div>`;
        });
        data.part3.debates.forEach((q, i) => {
            html += `<div class="card"><p><strong>Statement ${i+1}:</strong> ${q.statement}</p><textarea id="dsp3d_${i}" rows="2"></textarea></div>`;
        });
        window._demoSpeakingData = data;
    }
    document.getElementById('demoQuestions').innerHTML = html;
    document.getElementById('demoSubmitBtn').style.display = 'block';
    document.getElementById('demoResult').style.display = 'none';
    document.getElementById('demoPremiumBanner').style.display = 'none';
    window._currentDemo = section;
    document.getElementById('demoSection').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('demoSubmitBtn').addEventListener('click', () => {
    const section = window._currentDemo;
    const data = demoData[section];
    let score = 0, total = 0;
    if (section === 'grammar') {
        total = data.questions.length;
        data.questions.forEach((q, i) => {
            const sel = document.querySelector(`input[name="dgq${i}"]:checked`);
            if (sel && sel.value === q.ans) score++;
        });
    } else if (section === 'reading') {
        const answers = window._demoReadingAns;
        total = answers.length;
        answers.forEach((ans, i) => {
            const sel = document.getElementById(`drq${i}`);
            if (sel && sel.value === ans) score++;
        });
    } else if (section === 'listening') {
        const t2 = window._demoListAns2, t3 = window._demoListAns3;
        total = t2.length + t3.length;
        t2.forEach((ans, i) => {
            const sel = document.querySelector(`input[name="dl2q${i}"]:checked`);
            if (sel && sel.value === ans) score++;
        });
        t3.forEach((ans, i) => {
            const sel = document.querySelector(`input[name="dl3q${i}"]:checked`);
            if (sel && sel.value === ans) score++;
        });
    } else if (section === 'writing') {
        const d = data;
        // Part 1
        const t1A = document.getElementById('dw1A')?.value || '';
        const t1B = document.getElementById('dw1B')?.value || '';
        const text1 = t1A.length >= t1B.length ? t1A : t1B;
        const kw1 = text1 === t1A ? d.part1.A.keywords : d.part1.B.keywords;
        let c1 = 0; kw1.forEach(k => { if (text1.toLowerCase().includes(k)) c1++; });
        let s1 = Math.min(10, c1 * 2);
        // Part 2
        const t2A = document.getElementById('dw2A')?.value || '';
        const t2B = document.getElementById('dw2B')?.value || '';
        const text2 = t2A.length >= t2B.length ? t2A : t2B;
        const kw2 = text2 === t2A ? d.part2.A.keywords : d.part2.B.keywords;
        let c2 = 0; kw2.forEach(k => { if (text2.toLowerCase().includes(k)) c2++; });
        let s2 = Math.min(15, Math.floor(c2 * 1.5));
        score = s1 + s2;
        total = 25;
    } else if (section === 'speaking') {
        const d = data;
        // Part1
        d.part1.questions.forEach((q, i) => {
            const text = document.getElementById(`dsp1_${i}`)?.value || '';
            let c = 0;
            q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
            score += Math.min(q.maxScore || 3, c);
            total += (q.maxScore || 3);
        });
        // Part2
        d.part2.questions.forEach((q, i) => {
            const text = document.getElementById(`dsp2_${i}`)?.value || '';
            let c = 0;
            q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
            score += Math.min(q.maxScore || 3, c);
            total += (q.maxScore || 3);
        });
        // Part3 warmups
        d.part3.warmups.forEach((q, i) => {
            const text = document.getElementById(`dsp3w_${i}`)?.value || '';
            let c = 0;
            q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
            score += Math.min(1, c);
            total += 1;
        });
        // Part3 debates
        d.part3.debates.forEach((q, i) => {
            const text = document.getElementById(`dsp3d_${i}`)?.value || '';
            let c = 0;
            q.keywords.forEach(k => { if (text.toLowerCase().includes(k)) c++; });
            score += Math.min(1, c);
            total += 1;
        });
    }
    const pct = Math.round((score / total) * 100);
    const grade = getGrade(pct);
    document.getElementById('demoResult').innerHTML = `
        <div class="result-card">
            <h4>📊 Demo Result</h4>
            <div class="result-score-circle"><span class="big-score">${pct}%</span><span>${score}/${total}</span></div>
            <div class="result-grade ${grade.class}">${grade.emoji} ${grade.text}</div>
        </div>`;
    document.getElementById('demoResult').style.display = 'block';
    document.getElementById('demoPremiumBanner').style.display = 'block';
    document.getElementById('demoSubmitBtn').style.display = 'none';
    document.getElementById('demoResult').scrollIntoView({ behavior: 'smooth' });
});

function closeDemo() {
    document.getElementById('demoSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
}

// ======================== EVENT BINDINGS ========================
document.getElementById('submitGrammarBtn').onclick = submitGrammar;
document.getElementById('submitReadingBtn').onclick = submitReading;
document.getElementById('submitWritingBtn').onclick = submitWriting;
document.getElementById('submitListeningBtn').onclick = submitListening;
document.getElementById('submitSpeakingBtn').onclick = submitSpeaking;

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

window.onload = () => {
    document.getElementById('grammarSetSelection').style.display = 'block';
};