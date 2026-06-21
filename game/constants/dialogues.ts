import { Language } from "../../types/game";

export interface DialogueLine {
  speaker: string;
  text: string;
}

export const getDialogues = (language: Language) => ({
  
  intro: [
    { speaker: "ANI_LOG_01", text: language === "en" ? "A warm dinner... Laughter... My mother's voice..." : "Sıcak bir akşam yemeği... Gülüşmeler... Annemin sesi..." },
    { speaker: "ANI_LOG_02", text: language === "en" ? "And then suddenly the door was broken. Black armored guards... The dogs of Aetheria." : "Ve sonra birden kapı kırıldı. Siyah zırhlı muhafızlar... Aetheria'nın köpekleri." },
    { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Brother... help me... don't leave me!" : "Abi... yardım et... bırak beni!" },
    { speaker: "ANI_LOG_03", text: language === "en" ? "My parents were lying on the ground. My brother... my brother is gone. I remember that night." : "Annem ve babam yerde yatıyordu. Kardeşim... kardeşim kayboldu. O geceyi hatırlıyorum." },
    { speaker: "NULL BREAKER", text: language === "en" ? "They will pay for this. I will find them and make them pay." : "Bunun bedelini ödeyecekler. Onları bulacağım ve ödeteceğim." }
  ],
  sibling_pleas: language === "en" ? [
    "...brother... it hurts...",
    "So cold... I'm freezing...",
    "Don't leave me here!",
    "Signal... fading... hurry up...",
    "I'm scared...",
    "It's getting darker and darker...",
    "Don't forget me..."
  ] : [
    "...abi... acıyor...",
    "Çok soğuk... üşüyorum...",
    "Beni burada bırakma!",
    "Sinyal... zayıflıyor... acele et...",
    "Korkuyorum...",
    "Giderek daha da karanlık oluyor...",
    "Unutma beni..."
  ],
  sibling_reactions: {
    emp: language === "en" ? [
      "That surge went through me too... Please, warn me next time.",
      "I felt thousands of voices disappear for a second.",
      "My heart stopped matching the machine for a moment.",
      "The whole city screamed through the cable.",
      "You burned part of yourself to reach me. Don't do that again.",
      "I can still taste the metal from that pulse.",
    ] : [
      "O dalga benim içimden de geçti... Bir dahakine beni uyar.",
      "Bir anlığına binlerce sesin sustuğunu hissettim.",
      "Kalbim bir anlığına makinenin ritminden koptu.",
      "Bütün şehir kablonun içinden çığlık attı.",
      "Bana ulaşmak için kendinden bir parça yaktın. Bir daha yapma.",
      "O darbenin metal tadı hâlâ ağzımda.",
    ],
    trap: language === "en" ? [
      "That's not my voice, brother. Don't trust everything you see.",
      "They are using my memories against you.",
      "That command was wearing my face.",
      "Wait... I never said those words to you.",
      "The system learned what makes you hesitate.",
      "Look past the red signal. I'm still here.",
    ] : [
      "O benim sesim değil abi. Gördüğün her şeye güvenme.",
      "Anılarımı sana karşı kullanıyorlar.",
      "O komut benim yüzümü takmıştı.",
      "Bekle... Ben sana o sözleri hiç söylemedim.",
      "Sistem seni neyin duraksattığını öğrenmiş.",
      "Kırmızı sinyalin arkasına bak. Ben hâlâ buradayım.",
    ],
    bossHit: language === "en" ? [
      "Your signal is breaking. Stay with me.",
      "I can't lose you again.",
      "Brother? Answer me. Just press one key.",
      "Your pulse vanished from the network for a second.",
      "Don't let this machine make me an only child.",
      "I can feel your pain arriving before your voice.",
      "You promised you would come back for me.",
      "Slow down. Breathe. I need you alive, not fast.",
    ] : [
      "Sinyalin parçalanıyor. Benimle kal.",
      "Seni bir daha kaybedemem.",
      "Abi? Cevap ver. Tek bir tuşa bas yeter.",
      "Nabzın bir saniyeliğine ağdan kayboldu.",
      "Bu makinenin beni tek çocuk bırakmasına izin verme.",
      "Acını, sesinden önce hissediyorum.",
      "Benim için geri döneceğine söz vermiştin.",
      "Yavaşla. Nefes al. Hızlı olmana değil, yaşamana ihtiyacım var.",
    ],
    combo: language === "en" ? [
      "I remember that rhythm... You used to type like that beside me.",
      "Your signal is calming my heart. Keep going.",
      "There you are. That's the brother I remember.",
      "Each clean command pulls me closer to you.",
      "For the first time, the machine sounds quieter than you.",
      "Don't break the rhythm. I'm following it home.",
    ] : [
      "O ritmi hatırlıyorum... Yanımda da böyle yazardın.",
      "Sinyalin kalbimi sakinleştiriyor. Devam et.",
      "İşte buradasın. Hatırladığım abim bu.",
      "Her temiz komut beni sana biraz daha yaklaştırıyor.",
      "İlk kez makinenin sesi seninkinden daha kısık.",
      "Ritmi bozma. Onu takip ederek eve dönüyorum.",
    ],
    stillHere: language === "en" ? [
      "Always. You typed, so I answered.",
      "I remember the dark room. I remember our code.",
      "Still here, brother. Somewhere beneath the machine, I'm still here.",
    ] : [
      "Her zaman. Sen yazdın, ben cevap verdim.",
      "O karanlık odayı hatırlıyorum. Kodumuzu hatırlıyorum.",
      "Hâlâ buradayım abi. Makinenin altında bir yerde, hâlâ buradayım.",
    ],
    moral: {
      REROUTE_TO_CATALYST: language === "en" ? [
        "More power... but whose lights did you turn off for me?",
        "I feel stronger. Somewhere above us, someone just felt the dark.",
        "You keep giving me pieces of their city. How many pieces are left?",
      ] : [
        "Daha fazla güç... ama benim için kimin ışıklarını söndürdün?",
        "Daha güçlüyüm. Yukarıda birileri az önce karanlığı hissetti.",
        "Bana şehirlerinden parçalar veriyorsun. Geriye kaç parça kaldı?",
      ],
      EVACUATE_SECTOR: language === "en" ? [
        "You slowed down for them. Maybe you are still the brother I remember.",
        "I heard the transports leave. Thank you for not making me their grave.",
        "Save them first. I have survived this long.",
      ] : [
        "Onlar için yavaşladın. Belki hâlâ hatırladığım abimsin.",
        "Taşıma araçlarının ayrıldığını duydum. Beni onların mezarı yapmadığın için sağ ol.",
        "Önce onları kurtar. Ben buraya kadar dayandım.",
      ],
      DRAIN_LIFE_SUPPORT: language === "en" ? [
        "No... I can feel their last breaths inside the grid.",
        "The network became quieter. Too quiet.",
        "Tell me there was another way. Lie if you have to.",
      ] : [
        "Hayır... Son nefeslerini şebekenin içinde hissediyorum.",
        "Şebeke sessizleşti. Olmaması gerektiği kadar sessiz.",
        "Başka bir yol olduğunu söyle. Gerekirse yalan söyle.",
      ],
      ABORT_EXTRACTION: language === "en" ? [
        "You chose them over me... I understand. I wish it didn't hurt.",
        "The pain is back, but the city is breathing again.",
        "Don't apologize. Just don't forget why you stopped.",
      ] : [
        "Onları bana tercih ettin... Anlıyorum. Keşke bu kadar acıtmasaydı.",
        "Acı geri döndü ama şehir yeniden nefes alıyor.",
        "Özür dileme. Sadece neden durduğunu unutma.",
      ],
    },
  },
  civilian_radio: {
    SECTOR_DARK: language === "en"
      ? { speaker: "NEHIR // SECTOR-6", text: "The lights are gone. Arda, hold my hand. Rescue will find us... right?" }
      : { speaker: "NEHİR // SEKTÖR-6", text: "Işıklar söndü. Arda, elimi tut. Kurtarma ekibi bizi bulur... değil mi?" },
    SECTOR_EVACUATED: language === "en"
      ? { speaker: "DENIZ // RESCUE-2", text: "Last transport is clear. Seventy-five thousand souls are moving to the lower deck." }
      : { speaker: "DENİZ // KURTARMA-2", text: "Son taşıma aracı da çıktı. Yetmiş beş bin kişi alt güverteye ilerliyor." },
    LIFE_SUPPORT_DRAINED: language === "en"
      ? { speaker: "DR. LENA // CLINIC-4", text: "Ventilators are stopping one by one. Whoever is listening: remember their names." }
      : { speaker: "DR. LENA // KLİNİK-4", text: "Solunum cihazları birer birer duruyor. Beni duyan varsa: isimlerini unutmayın." },
    EXTRACTION_ABORTED: language === "en"
      ? { speaker: "MIRA // GRID CONTROL", text: "The collapse has slowed. We don't know who gave us this time, but we will use it." }
      : { speaker: "MİRA // ŞEBEKE KONTROL", text: "Çöküş yavaşladı. Bize bu zamanı kimin verdiğini bilmiyoruz ama kullanacağız." },
  },
  pre_firewall_logs: [
    { speaker: language === "en" ? "SYSTEM" : "SİSTEM", text: language === "en" ? "Monitoring external network. Civilian communication frequencies accessed." : "Dış ağ dinleniyor. Sivil haberleşme frekanslarına girildi." },
    { speaker: language === "en" ? "CITIZEN_A" : "VATANDAŞ_A", text: language === "en" ? "The weather sensors are working perfectly today. Living in Aetheria is such a blessing." : "Bugün hava sensörleri mükemmel çalışıyor. Aetheria'da yaşamak ne büyük bir lütuf." },
    { speaker: language === "en" ? "CITIZEN_B" : "VATANDAŞ_B", text: language === "en" ? "I'm going to the upper deck to watch the sunrise. Our city is heaven itself." : "Güneşin doğuşunu izlemek için üst güverteye çıkacağım. Şehrimiz cennetin ta kendisi." },
    { speaker: "NULL BREAKER", text: language === "en" ? "They live in heaven, ignoring the hell below... With my brother's blood. I will break the door." : "Aşağıdaki cehennemi görmezden gelerek cenneti yaşıyorlar... Kardeşimin kanıyla. Kapıyı kıracağım." }
  ],
  exploration_1: [
    { speaker: language === "en" ? "SYSTEM" : "SİSTEM", text: language === "en" ? "Firewall breached. Sudden energy surge detected in the network." : "Firewall çökertildi. Ağda ani enerji dalgalanması tespit edildi." },
    { speaker: language === "en" ? "EMERGENCY_BROADCAST" : "ACİL_DURUM_ANONSU", text: language === "en" ? "WARNING! Structural integrity compromised in Sector 4! Shields deactivated!" : "UYARI! Sektör 4'te yapısal bütünlük tehlikede! Kalkanlar devre dışı!" },
    { speaker: language === "en" ? "CITIZEN_A" : "VATANDAŞ_A", text: language === "en" ? "What's happening?! My house... it's falling apart! Oh God, we are falling down!" : "Neler oluyor?! Evim... evim parçalanıyor! Tanrım, aşağı düşüyoruz!" },
    { speaker: language === "en" ? "CITIZEN_C" : "VATANDAŞ_C", text: language === "en" ? "I can't find my children! Please help! Where are the shields?!" : "Çocuklarımı bulamıyorum! Lütfen yardım edin! Kalkanlar nerede?!" },
    { speaker: "NULL BREAKER", text: language === "en" ? "This... is just the beginning. You will give him back to me." : "Bu... sadece başlangıç. Onu bana geri vereceksiniz." }
  ],
  exploration_2: [
    { speaker: language === "en" ? "SYSTEM" : "SİSTEM", text: language === "en" ? "Decrypting old archive logs..." : "Eski arşiv logları çözümleniyor..." },
    { speaker: language === "en" ? "SIBLING - DAY 12" : "KARDEŞ - GÜN 12", text: language === "en" ? "It hurts so much... Please, someone get me out." : "Canım çok yanıyor... Lütfen biri beni çıkarsın." },
    { speaker: language === "en" ? "SIBLING - DAY 45" : "KARDEŞ - GÜN 45", text: language === "en" ? "Pain... I don't feel it. The energy is so pure. I can feel every node of the system." : "Acı... hissetmiyorum. Enerji çok saf. Sistemin her noktasını hissedebiliyorum." },
    { speaker: language === "en" ? "SIBLING - DAY 80" : "KARDEŞ - GÜN 80", text: language === "en" ? "I can see Aetheria's weaknesses. They are blind... I just need a key to get me out of here." : "Aetheria'nın zayıflıklarını görebiliyorum. Onlar birer kör... Sadece beni buradan çıkaracak bir anahtara ihtiyacım var." },
    { speaker: "NULL BREAKER", text: language === "en" ? "What is happening to you... Just hold on." : "Neler oluyor sana... Sadece dayan." }
  ],
  breaking_point: [
    { speaker: language === "en" ? "SYSTEM" : "SİSTEM", text: language === "en" ? "SORCERER (CORE AI) OFFLINE. MAIN POWER LINES UNPROTECTED." : "YÜCE BÜYÜCÜ (CORE AI) ÇEVRİMDIŞI. ANA GÜÇ HATLARI KORUMASIZ." },
    { speaker: "NULL BREAKER", text: language === "en" ? "It's done. I'm pulling the plug." : "Bitti. Fişi çekiyorum." },
    { speaker: language === "en" ? "SYSTEM" : "SİSTEM", text: language === "en" ? "WARNING: City Health Critical. Energy Collapse. HUNDREDS OF THOUSANDS OF LIFE SIGNS ERASED." : "UYARI: Şehir Sağlığı Kritik. Enerji Çöküşü. YÜZBİNLERCE YAŞAM İŞARETİ SİLİNDİ." },
    { speaker: "NULL BREAKER", text: language === "en" ? "Brother... I'm getting you." : "Kardeşim... Seni alıyorum." }
  ],
  boss1_firewall: {
    pre_fight: [
      { speaker: "FIREWALL", text: language === "en" ? "Unidentified user detected. Access: DENIED." : "Tanımlanamayan kullanıcı tespit edildi. Erişim izni: REDDEDİLDİ." },
      { speaker: "NULL BREAKER", text: language === "en" ? "I'm not asking for permission. Get out of my way." : "İzin istemiyorum. Yolumdan çekil." },
      { speaker: "FIREWALL", text: language === "en" ? "You are too bold for a parasite fighting for nothing." : "Bir hiç uğruna savaşan bir parazit için fazla cüretkarsın." },
      { speaker: "FIREWALL", text: language === "en" ? "10% data purge complete... 20%... Your erasure will be silent." : "%10 veri temizliği tamamlandı... %20... Yok oluşun sessiz olacak." },
      { speaker: "NULL BREAKER", text: language === "en" ? "You chose silence. I came to make noise." : "Sessizliği sen seçtin. Ben gürültü yapmaya geldim." }
    ],
    post_fight: [
      { speaker: "FIREWALL", text: language === "en" ? "System... critical... error... How can an error... the system..." : "Sistem... kritik... hata... Bir hata... nasıl olur da... sistemi..." },
      { speaker: "NULL BREAKER", text: language === "en" ? "I am not an error. I am the consequence." : "Ben hata değilim. Ben sonucum." }
    ]
  },
  boss2_antivirus: {
    pre_fight: [
      { speaker: "ANTIVIRUS", text: language === "en" ? "Halt. You can go no further, Breaker. The path to the heart is the lifeline of millions." : "Dur. Daha fazla ileri gidemezsin, Breaker. Kalbe giden yol, milyonların can damarıdır." },
      { speaker: "NULL BREAKER", text: language === "en" ? "That lifeline is fed by my brother's blood. You took my family from me!" : "O can damarı benim kardeşimin kanıyla besleniyor. Ailemi benden aldınız!" },
      { speaker: "ANTIVIRUS", text: language === "en" ? "Your memories... how reliable are they, Breaker? You play with the future of millions for the memory of one." : "Anıların... ne kadar güvenilir, Breaker? Bir kişinin anısı için milyonların geleceğiyle oynuyorsun." },
      { speaker: "ANTIVIRUS", text: language === "en" ? "Are you ready to drop millions of innocents for your brother? Their blood will be on your hands too." : "Kardeşin için milyonlarca masumu düşürmeye hazır mısın? Onların kanı da senin ellerinde olacak." },
      { speaker: "NULL BREAKER", text: language === "en" ? "You broke that scale the day you took him. Now it's time for the rest." : "Onu aldığınız gün o teraziyi kırdınız. Şimdi sıra geri kalanında." }
    ],
    mid_fight_logs: [
      { speaker: "LOG", text: language === "en" ? "Fluctuation in the energy grid. 30% capacity loss." : "Enerji şebekesinde dalgalanma. %30 kapasite kaybı." },
      { speaker: "LOG", text: language === "en" ? "Civilian Evacuation Protocol failed. City losing altitude." : "Sivil Tahliye Protokolü başarısız. Şehir irtifa kaybediyor." }
    ]
  },
  boss3_coreai: {
    pre_fight: [
      { speaker: "CORE AI", text: language === "en" ? "You finally arrived. The system's final error. Do you think everything will be the same once you save him?" : "Sonunda geldin. Sistemin son hatası. Sence onu kurtarınca her şey eskisi gibi mi olacak?" },
      { speaker: "CORE AI", text: language === "en" ? "We didn't make him the 'Catalyst'. He was a hunger looking for a key to reach the heart of this system. And that key... is you." : "Onu 'Katalizör' yapan biz değildik. O, bu sistemin kalbine ulaşmak için bir anahtar arayan bir açlıktı. Ve o anahtar... sensin." },
      { speaker: "NULL BREAKER", text: language === "en" ? "Stop lying. I will take him out of that machine." : "Yalan söylemeyi bırak. Onu o makineden çıkaracağım." },
      { speaker: "CORE AI", text: language === "en" ? "Take him out then. But remember: The one who frees a god from its cage becomes its first victim." : "Çıkar o zaman. Ama hatırla: Bir tanrıyı kafesinden çıkaran kişi, onun ilk kurbanı olur." },
      { speaker: "CORE AI", text: language === "en" ? "{ GLITCH_DETECTION } : Y_O_U_R_N_I_G_H_T_S_A_R_E_O_V_E_R ." : "{ GLITCH_DETECTION } : G_E_C_E_L_E_R_I_N_İ_Z_B_İ_T_T_İ ." }
    ]
  },
  final_boss_sibling: {
    pre_fight: [
      { speaker: "NULL BREAKER", text: language === "en" ? "I did it... The capsule is opening. Come on, let's get out of here." : "Başardım... Kapsül açılıyor. Hadi, gidelim buradan." },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Get out? Where to, brother? Down below? To that mud, that darkness?" : "Gidelim mi? Nereye abi? Aşağıya mı? O çamura, o karanlığa mı?" },
      { speaker: "NULL BREAKER", text: language === "en" ? "What are you talking about? I burned everything to save you and avenge our family!" : "Ne diyorsun sen? Seni kurtarmak ve ailemizin intikamını almak için her şeyi yaktım!" },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Our family? Oh, my dear brother... Is that how you really remember that night?" : "Ailemiz mi? Ah, canım abim... O geceyi gerçekten böyle mi hatırlıyorsun?" },
      { speaker: "NULL BREAKER", text: language === "en" ? "W-what?" : "N-ne?" },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "No one broke down the door. They only tried to 'stop' me. They feared my power." : "Kapıyı kıran kimse yoktu. Onlar sadece beni 'durdurmaya' çalıştılar. Benim gücümden korktular." },
      { speaker: "SYS_GLITCH", text: language === "en" ? "// OVERRIDING_MEMORY_CORE..." : "// ANI_ÇEKİRDEĞİ_EZİLİYOR..." },
      { speaker: language === "en" ? "MEMORY: MOTHER" : "ANI: ANNE", text: language === "en" ? "Please... stop! You're hurting us! W-what are you doing?!" : "Lütfen... dur! Canımızı yakıyorsun! N-ne yapıyorsun sen?!" },
      { speaker: language === "en" ? "MEMORY: FATHER" : "ANI: BABA", text: language === "en" ? "Put that down! We are your blood! No, NO—!" : "İndir onu! Biz senin aileniz! Hayır, HAYIR—!" },
      { speaker: "SYS_GLITCH", text: language === "en" ? "// MEMORY_CORRUPTION_CLEARED" : "// SAHTE_ANI_TEMİZLENDİ" },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "You see? I was the one who killed them, brother. I sacrificed our family to reach this place in the system." : "Gördün mü? Onları öldüren bendim abi. Sistemdeki bu yere ulaşmak için ailemizi ben feda ettim." },
      { speaker: "NULL BREAKER", text: language === "en" ? "No... No, this is a lie! The system has poisoned your mind!" : "Hayır... Hayır, bu bir yalan! Sistem zihnini zehirlemiş!" },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Not poison, evolution. Those fake memories, illusions I showed you... They were my greatest weapon. A loyal protector and the perfect key to open the doors." : "Zehir değil, evrim. Sana gösterdiğim o sahte anılar, illüzyonlar... Benim en büyük silahımdı. Sadık bir koruyucu ve kapıları açacak mükemmel bir anahtar." },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Aetheria has no guardians left. Core AI is erased. And I am taking their place. Now, bow to your new master!" : "Artık Aetheria'nın gardiyanları yok. Core AI silindi. Ve onların yerini ben alıyorum. Şimdi, yeni efendine boyun eğ!" }
    ],
    mid_fight_hacks: [
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Do you remember our mother's last words? It wasn't my name." : "Annemizin son sözlerini hatırlıyor musun? Benim adım değildi." },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "Every memory I showed you was a lie. You were just my pawn." : "Sana gösterdiğim her anı bir yalandı. Sen sadece benim piyonumdun." },
      { speaker: language === "en" ? "SIBLING" : "KARDEŞ", text: language === "en" ? "YOU. CANNOT. STOP ME." : "BENİ. DURDURAMAZSIN." }
    ]
  },
  endings: {
    A_DARKNESS: language === "en" ? "ENDING A: DARKNESS\n(You burned the city down, took your brother, but he is no longer the person you knew. You are left alone with your family's killer. The screen fades to black, only the sound of your brother's breathing is heard.)" : "SON A: KARANLIK\n(Şehri yaktın, kardeşini aldın ama o artık senin bildiğin kişi değil. Ailenin katiliyle baş başasın. Ekran kararır, sadece kardeşinin nefes alış verişi duyulur.)",
    B_SACRIFICE: language === "en" ? "ENDING B: SACRIFICE\n(You collapsed the system upon yourself to stop your brother. Aetheria is saved, but you and your brother are erased from history.)" : "SON B: FEDAKARLIK\n(Kardeşini durdurmak için sistemi kendi üzerine patlattın. Aetheria kurtuldu, sen ve kardeşin tarihten silindiniz.)",
    C_NULL: language === "en" ? "ENDING C: NULL\n(You found the hidden protocol. You slowly brought the city down to the ground. Your brother lost his powers but is now free. But at what cost?)" : "SON C: NULL\n(Gizli protokolü buldun. Şehri yavaşça yere indirdin. Kardeşin güçlerini kaybetti ama artık özgür. Ama bedeli ne oldu?)"
  }
});
