export interface DialogueLine {
  speaker: string;
  text: string;
}

export const DIALOGUES = {
  intro: [
    { speaker: "ANI_LOG_01", text: "Sıcak bir akşam yemeği... Gülüşmeler... Annemin sesi..." },
    { speaker: "ANI_LOG_02", text: "Ve sonra birden kapı kırıldı. Siyah zırhlı muhafızlar... Aetheria'nın köpekleri." },
    { speaker: "KARDEŞ", text: "Abi... yardım et... bırak beni!" },
    { speaker: "ANI_LOG_03", text: "Annem ve babam yerde yatıyordu. Her şey kana bulanmıştı. Onu zorla götürdüler." },
    { speaker: "NULL BREAKER", text: "Bunu ödeyecekler. Sizi benden alan o gökyüzü şehrini yakacağım." },
    { speaker: "SİSTEM MESAJI", text: "Bağlantı kuruluyor... Sinyal zayıf..." },
    { speaker: "NULL BREAKER", text: "Dayan kardeşim. Seni buldum. Oraya geliyorum." }
  ],
  sibling_pleas: [
    "...abi... acıyor...",
    "Çok soğuk... üşüyorum...",
    "Beni burada bırakma!",
    "Sinyal... zayıflıyor... acele et...",
    "Korkuyorum...",
    "Giderek daha da karanlık oluyor...",
    "Unutma beni..."
  ],
  pre_firewall_logs: [
    { speaker: "SİSTEM", text: "Dış ağ dinleniyor. Sivil haberleşme frekanslarına girildi." },
    { speaker: "VATANDAŞ_A", text: "Bugün hava sensörleri mükemmel çalışıyor. Aetheria'da yaşamak ne büyük bir lütuf." },
    { speaker: "VATANDAŞ_B", text: "Güneşin doğuşunu izlemek için üst güverteye çıkacağım. Şehrimiz cennetin ta kendisi." },
    { speaker: "NULL BREAKER", text: "Aşağıdaki cehennemi görmezden gelerek cenneti yaşıyorlar... Kardeşimin kanıyla. Kapıyı kıracağım." }
  ],
  exploration_1: [
    { speaker: "SİSTEM", text: "Firewall çökertildi. Ağda ani enerji dalgalanması tespit edildi." },
    { speaker: "ACİL_DURUM_ANONSU", text: "UYARI! Sektör 4'te yapısal bütünlük tehlikede! Kalkanlar devre dışı!" },
    { speaker: "VATANDAŞ_A", text: "Neler oluyor?! Evim... evim parçalanıyor! Tanrım, aşağı düşüyoruz!" },
    { speaker: "VATANDAŞ_C", text: "Çocuklarımı bulamıyorum! Lütfen yardım edin! Kalkanlar nerede?!" },
    { speaker: "NULL BREAKER", text: "Bu... sadece başlangıç. Onu bana geri vereceksiniz." }
  ],
  exploration_2: [
    { speaker: "SİSTEM", text: "Eski arşiv logları çözümleniyor..." },
    { speaker: "KARDEŞ - GÜN 12", text: "Canım çok yanıyor... Lütfen biri beni çıkarsın." },
    { speaker: "KARDEŞ - GÜN 45", text: "Acı... hissetmiyorum. Enerji çok saf. Sistemin her noktasını hissedebiliyorum." },
    { speaker: "KARDEŞ - GÜN 80", text: "Aetheria'nın zayıflıklarını görebiliyorum. Onlar birer kör... Sadece beni buradan çıkaracak bir anahtara ihtiyacım var." },
    { speaker: "NULL BREAKER", text: "Neler oluyor sana... Sadece dayan." }
  ],
  breaking_point: [
    { speaker: "SİSTEM", text: "YÜCE BÜYÜCÜ (CORE AI) ÇEVRİMDIŞI. ANA GÜÇ HATLARI KORUMASIZ." },
    { speaker: "NULL BREAKER", text: "Bitti. Fişi çekiyorum." },
    { speaker: "SİSTEM", text: "UYARI: Şehir Sağlığı Kritik. Enerji Çöküşü. YÜZBİNLERCE YAŞAM İŞARETİ SİLİNDİ." },
    { speaker: "NULL BREAKER", text: "Kardeşim... Seni alıyorum." }
  ],
  boss1_firewall: {
    pre_fight: [
      { speaker: "FIREWALL", text: "Tanımlanamayan kullanıcı tespit edildi. Erişim izni: REDDEDİLDİ." },
      { speaker: "NULL BREAKER", text: "İzin istemiyorum. Yolumdan çekil." },
      { speaker: "FIREWALL", text: "Bir hiç uğruna savaşan bir parazit için fazla cüretkarsın." },
      { speaker: "FIREWALL", text: "%10 veri temizliği tamamlandı... %20... Yok oluşun sessiz olacak." },
      { speaker: "NULL BREAKER", text: "Sessizliği sen seçtin. Ben gürültü yapmaya geldim." }
    ],
    post_fight: [
      { speaker: "FIREWALL", text: "Sistem... kritik... hata... Bir hata... nasıl olur da... sistemi..." },
      { speaker: "NULL BREAKER", text: "Ben hata değilim. Ben sonucum." }
    ]
  },
  boss2_antivirus: {
    pre_fight: [
      { speaker: "ANTIVIRUS", text: "Dur. Daha fazla ileri gidemezsin, Breaker. Kalbe giden yol, milyonların can damarıdır." },
      { speaker: "NULL BREAKER", text: "O can damarı benim kardeşimin kanıyla besleniyor. Ailemi benden aldınız!" },
      { speaker: "ANTIVIRUS", text: "Anıların... ne kadar güvenilir, Breaker? Bir kişinin anısı için milyonların geleceğiyle oynuyorsun." },
      { speaker: "ANTIVIRUS", text: "Kardeşin için milyonlarca masumu düşürmeye hazır mısın? Onların kanı da senin ellerinde olacak." },
      { speaker: "NULL BREAKER", text: "Onu aldığınız gün o teraziyi kırdınız. Şimdi sıra geri kalanında." }
    ],
    mid_fight_logs: [
      { speaker: "LOG", text: "Enerji şebekesinde dalgalanma. %30 kapasite kaybı." },
      { speaker: "LOG", text: "Sivil Tahliye Protokolü başarısız. Şehir irtifa kaybediyor." }
    ]
  },
  boss3_coreai: {
    pre_fight: [
      { speaker: "CORE AI", text: "Sonunda geldin. Sistemin son hatası. Sence onu kurtarınca her şey eskisi gibi mi olacak?" },
      { speaker: "CORE AI", text: "Onu 'Katalizör' yapan biz değildik. O, bu sistemin kalbine ulaşmak için bir anahtar arayan bir açlıktı. Ve o anahtar... sensin." },
      { speaker: "NULL BREAKER", text: "Yalan söylemeyi bırak. Onu o makineden çıkaracağım." },
      { speaker: "CORE AI", text: "Çıkar o zaman. Ama hatırla: Bir tanrıyı kafesinden çıkaran kişi, onun ilk kurbanı olur." },
      { speaker: "CORE AI", text: "{ GLITCH_DETECTION } : G_E_C_E_L_E_R_I_N_İ_Z_B_İ_T_T_İ ." }
    ]
  },
  final_boss_sibling: {
    pre_fight: [
      { speaker: "NULL BREAKER", text: "Başardım... Kapsül açılıyor. Hadi, gidelim buradan." },
      { speaker: "KARDEŞ", text: "Gidelim mi? Nereye abi? Aşağıya mı? O çamura, o karanlığa mı?" },
      { speaker: "NULL BREAKER", text: "Ne diyorsun sen? Seni kurtarmak ve ailemizin intikamını almak için her şeyi yaktım!" },
      { speaker: "KARDEŞ", text: "Ailemiz mi? Ah, canım abim... O geceyi gerçekten böyle mi hatırlıyorsun?" },
      { speaker: "NULL BREAKER", text: "N-ne?" },
      { speaker: "KARDEŞ", text: "Kapıyı kıran kimse yoktu. Onlar sadece beni 'durdurmaya' çalıştılar. Benim gücümden korktular." },
      { speaker: "KARDEŞ", text: "Onları öldüren bendim abi. Sistemdeki bu yere ulaşmak için ailemizi ben feda ettim." },
      { speaker: "NULL BREAKER", text: "Hayır... Hayır, bu bir yalan! Sistem zihnini zehirlemiş!" },
      { speaker: "KARDEŞ", text: "Zehir değil, evrim. Sana gösterdiğim o sahte anılar, illüzyonlar... Benim en büyük silahımdı. Sadık bir koruyucu ve kapıları açacak mükemmel bir anahtar." },
      { speaker: "KARDEŞ", text: "Artık Aetheria'nın gardiyanları yok. Core AI silindi. Ve onların yerini ben alıyorum. Şimdi, yeni efendine boyun eğ!" }
    ],
    mid_fight_hacks: [
      { speaker: "KARDEŞ", text: "Annemizin son sözlerini hatırlıyor musun? Benim adım değildi." },
      { speaker: "KARDEŞ", text: "Sana gösterdiğim her anı bir yalandı. Sen sadece benim piyonumdun." },
      { speaker: "KARDEŞ", text: "BENİ. DURDURAMAZSIN." }
    ]
  },
  endings: {
    A_DARKNESS: "SON A: KARANLIK\n(Şehri yaktın, kardeşini aldın ama o artık senin bildiğin kişi değil. Ailenin katiliyle baş başasın. Ekran kararır, sadece kardeşinin nefes alış verişi duyulur.)",
    B_SACRIFICE: "SON B: FEDAKARLIK\n(Kardeşini durdurmak için sistemi kendi üzerine patlattın. Aetheria kurtuldu, sen ve kardeşin tarihten silindiniz.)",
    C_NULL: "SON C: NULL\n(Gizli protokolü buldun. Şehri yavaşça yere indirdin. Kardeşin güçlerini kaybetti ama artık özgür. Ama bedeli ne oldu?)"
  }
};