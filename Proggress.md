# Null Breaker — Geliştirme İlerlemesi

Son güncelleme: 21 Haziran 2026

## Seçilen öncelikli sorunlar

- [x] **1 — Boss dengesi:** Boss canları 250 yerine boss'a göre 1000–1500 aralığına taşındı; sağlık çubukları gerçek maksimum değeri kullanıyor.
- [x] **2 — Şehir/kardeş sonuçları:** Doğru kelime, tuzak, boss vuruşu, EMP ve boss yenilgileri şehir ile kardeş verilerini dinamik olarak etkiliyor.
- [x] **3 — Finaller:** A, B ve C finalleri seçilebilir hale getirildi; tarayıcı `alert()` penceresi kaldırıldı ve oyun içi final ekranı eklendi.
- [x] **4 — Merkezi state:** Menü, intro, hikâye, bulmaca, savaş, final seçimi ve final geçişleri Zustand state machine altında birleştirildi.
- [x] **5 — Kelime hedefleme:** Birbirinin öneki olan kelimelerin aynı anda seçilmesi engellendi; ortak ilk harflerde adaylar yazılan önekle ayrıştırılıyor.
- [x] **6 — Timer/pause:** Combat için kelimelerle çakışmayan `[F2]` duraklatma ve sekme odağı kaybında otomatik pause eklendi; iç içe timer'lar temizleniyor.
- [x] **8 — Kod temizliği:** Yinelenen eski combat uygulaması tek satırlık uyumluluk export'una indirildi; kullanılmayan mermi prototipi etkisizleştirildi, eski state referansları kaldırıldı ve boss/kelime verileri ayrı sabit dosyasına taşındı.
- [x] **9 — Proje sunumu:** Null Breaker metadata'sı, dinamik HTML dili, README, kapsam belgesi, offline font zinciri ve proje komutları güncellendi.

## Doğrulama

- [x] ESLint — `npm.cmd run lint`
- [x] TypeScript typecheck — `npm.cmd run typecheck`
- [x] Next.js production build — `npm.cmd run build`

## Duygusal etki ve oynanış genişletmesi

- [x] Boss canı `%70`, `%40` ve `%15` eşiklerinde yazılabilir ahlaki komutlar.
- [x] `REROUTE_TO_CATALYST`, `EVACUATE_SECTOR`, `DRAIN_LIFE_SUPPORT` ve `ABORT_EXTRACTION` için kalıcı sonuçlar.
- [x] İsimli sivil telsiz mesajları ve performansa tepki veren kardeş diyalogları.
- [x] WPM, doğruluk, current/max combo ve combat süresi takibi; beşli combo stabilite bonusu.
- [x] Firewall paket temizleme, Antivirus sahte karakter, Core AI ters kelime ve Final Boss ekran bölme mekanikleri.
- [x] Web Audio kalp atışı, ambient katman, başarı/hasar/EMP sesleri ve kritik karar sessizliği.
- [x] Hasar/EMP ekran sarsıntısı ve final karar-performans özeti.
- [x] Canlı sinyal tepki havuzları genişletildi, aynı mesajın art arda seçilmesi engellendi ve mesaj kutusu kelimeleri kapatmaması için üst bölgeye taşındı.

## Notlar

- Çalışma, `AGENTS.md` gereği `node_modules/next/dist/docs/` içindeki Next.js 16 Server/Client Components, metadata, proje yapısı ve erişilebilirlik rehberleri okunarak yapıldı.
- Güvenlik uyarıları için kırıcı olabilecek `npm audit fix --force` çalıştırılmadı.
- Google Fonts ağ bağımlılığı kaldırıldı; production build çevrimdışı sistem font zinciriyle başarıyla tamamlandı.
- İlk build'den kalan kilitli `.next` önbelleği, yolu çalışma alanı içinde doğrulandıktan sonra temizlendi.
- Pause kısayolu, `P` harfinin kelime girişini engellemesi nedeniyle `[F2]` olarak değiştirildi.
