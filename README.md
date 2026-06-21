# Null Breaker

Null Breaker, kardeşini Aetheria'nın enerji çekirdeğinden kurtarmaya çalışan bir sistem sızıcısını konu alan terminal tabanlı cyberpunk aksiyon oyunudur. Oyuncunun her saldırısı kardeşini özgürlüğe yaklaştırırken şehrin bütünlüğünü ve sivillerin hayatını tehlikeye atar.

## Oynanış

- Ekrandaki sistem komutlarını boss'tan önce yaz.
- Kırmızı `[TRAP]` kelimelerden kaçın.
- Mor `[ENCRYPTED]` düğümleri çözerek gerçek saldırıyı açığa çıkar.
- `Space` ile savaş başına bir kez EMP kullan; 200 HP ve şehir bütünlüğü karşılığında 300 hasar ver.
- `F2` ile savaşı duraklat, `Escape` ile mevcut kelime hedefini temizle.
- Finalde Aetheria ve kardeşin için üç farklı sonuçtan birini seç.

## Dinamik sistemler

- Boss canı `%70`, `%40` ve `%15` seviyelerinde savaş durur; iki ahlaki komuttan birini yazarak seçersin.
- Kararlar kardeşin stabilitesini, şehir bütünlüğünü, sivil kayıpları ve boss canını doğrudan değiştirir.
- Kardeş; combo, EMP, tuzaklar ve alınan hasara göre canlı tepki verir. İsimli siviller kararların ardından telsizden konuşur.
- WPM, doğruluk ve combo takip edilir; her beşli combo kardeşi ek olarak stabilize eder.
- Firewall hedefleri temizler, Antivirus sahte karakter üretir, Core AI kelimeleri tersine çevirir, Final Boss arayüzü parçalar.
- Web Audio tabanlı kalp atışı ve düşük sesli synth müzik karar anlarında tamamen susar; her tuş mekanik klavye sesi, hasar ve EMP ise ekran/ses geri bildirimi üretir.
- Final ekranı karar geçmişini, kayıp/kurtarılan sivilleri, WPM, doğruluk ve maksimum combo değerini özetler.

## Kardeş ve dünya bağı

- Oyun, kardeşlerin çocukken kullandığı `STILL_HERE` terminal koduyla açılır; aynı motif final boss sırasında oynanabilir bir komut olarak geri döner.
- Dr. Lena, Deniz, Nehir, Arda ve Mira üç kurtarma görevinde tanıtılır. Oyuncunun sonraki ahlaki komutları bu kişilerin kaderini değiştirebilir.
- Her beşli combo kardeş bağlantısını etkinleştirerek boss yazımını yavaşlatır; kritik oyuncu canında bir defalık daha güçlü yardım gelir.
- Klinik, tahliye koridoru ve şebeke görevlerinde toplam 117.000 sivil kurtarılabilir.
- Final raporu her isimli karakterin kaderini karar geçmişi ve performans değerleriyle birlikte gösterir.

## Kurulum

Gereksinimler: Node.js 20 veya üzeri ve npm.

```powershell
npm.cmd install
npm.cmd run dev
```

PowerShell yürütme politikası `npm.ps1` dosyasını engelliyorsa politika ayarını değiştirmek yerine `npm.cmd` kullanabilirsin. Oyun geliştirme sunucusunda `http://localhost:3000` adresinde açılır.

## Komutlar

```powershell
npm.cmd run dev        # Geliştirme sunucusu
npm.cmd run lint       # ESLint
npm.cmd run typecheck  # TypeScript kontrolü
npm.cmd run build      # Production build
npm.cmd run start      # Production sunucusu
```

## Teknoloji

- Next.js 16 App Router
- React 19 ve TypeScript
- Tailwind CSS 4
- Zustand 5
- Framer Motion 12

## Proje yapısı

```text
app/                    Next.js route ve global stiller
components/screens/     Menü, intro, oyun ve combat ekranları
game/constants/         Boss, kelime ve diyalog verileri
store/                  Merkezi oyun state machine
types/                  Oyun domain tipleri
```

Hikâye ve tasarım kapsamı için [ProjectScope.md](./ProjectScope.md), yapılan çalışmalar için [Proggress.md](./Proggress.md) dosyasına bakabilirsin.
