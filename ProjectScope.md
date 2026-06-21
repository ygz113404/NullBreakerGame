# Null Breaker: Part 1 - Uyanış

Aetheria şehrinin kusursuzluğunu yok etme pahasına, sistemin kalbinde tutulan kardeşini kurtarmaya çalışan bir "Null Breaker"ın hikayesi.

## 🌌 Proje Vizyonu & High Concept
Null Breaker, arayüz tabanlı bir hacker-aksiyon oyunudur. Oyunun temel felsefesi **"Dünyamı kurtarmak için dünyayı yakar mıyım?"** ikilemi üzerine kuruludur. Oyuncu, rasyonel bir kahraman değil, duygusal bir koruyucu (abi) rolündedir.

## 📖 Hikaye Arka Planı: "Pil" Teorisi
* **Aetheria:** Gökyüzünde süzülen, insanların yaşlanmadığı ütopik şehir.
* **Katalizör (Pil):** Şehrin ölümsüzlük enerjisi, aşağı dünyadan kaçırılan bir insanın (kardeşin) yaşam enerjisinden çekilmektedir.
* **Çatışma:** Kardeşini sistemden ayırmak, Aetheria'nın enerji şebekesini çökertmek ve şehrin düşmesine (milyonların ölmesine) sebep olmak demektir.

---

## 🛠 Teknik Mimari (Tech Stack)
* **Framework:** Next.js 16 (App Router)
* **Dil:** TypeScript
* **Styling:** Tailwind CSS (Dark/Cyberpunk Theme)
* **Animasyon:** Framer Motion (UI geçişleri ve mermi efektleri)
* **State Management:** Zustand (Şehir ve Kardeş verilerinin senkronizasyonu için)
* **Fizik:** Custom Vector Reflection Logic (HTML5 Canvas veya DOM tabanlı)

---

## 🖥 Ekran Mimarisi (UI Layout)

Ekran `3 Sütunlu Grid` yapısı üzerine kuruludur:

### 1. Sol Panel: Aetheria Şehir Ağı (%25)
* **Amacı:** Şehrin çöküşünü izlemek.
* **Veriler:** `cityHealth`, `gridStatus`, `civilianCasualtyCount`.
* **Tasarım:** Endüstriyel, soğuk camgöbeği/mavi tonlar.

### 2. Sağ Panel: Katalizör [Kardeş] Vitalleri (%25)
* **Amacı:** Kardeşin iyileşmesini izlemek.
* **Veriler:** `heartRate (BPM)`, `neuroStress`, `stabilityIndex`.
* **Tasarım:** Organik, başlangıçta kritik kırmızı, iyileştikçe stabilize olan yeşil tonlar.

### 3. Orta Panel: Ana Konsol (%50)
* **Üst Bölge (%30):** Boss diyalogları ve sistem logları. Typewriter efekti kullanılır.
* **Alt Bölge (%70):** **Terminal Combat (Fight Box)**. Hacker temalı terminal arayüzü.

---

## 🕹 Oynanış Mekaniklerini: Terminal Combat
* **Terminal Ekranı:** Siyah, hacker tarzı bir konsol.
* **Güvenlik Düğümleri (Kelimeler/Komutlar):** Yukarıdan aşağı düşen sistem komutları (örn. `OVERRIDE_GATE`, `KILL_PROCESS`).
* **Typing Mekaniği:** Oyuncu klavye ile kelimeleri hatasız yazarak onları yok eder.
* **Boss Evreleri:** 
  1. **Kapı Gardiyanı (Firewall):** Basit komutlar, zamanla hızlanır.
  2. **Ana Kaledeki Şövalye (Antivirus):** Tuzak kelimeler (kırmızı/yeşil) ve şifreli metinler (`*#@!X`).
  3. **Yüce Büyücü (Core AI):** Kaotik ekran, tersten yazılar, UI bozulmaları (Glitch).

---

## 📂 Dosya Yapısı (Folder Structure)

```text
app/                     # Next.js route, metadata ve global stiller
components/screens/      # Menü, intro, ana oyun ve terminal combat
game/constants/          # Boss ayarları, kelime havuzları ve diyaloglar
store/                   # Zustand merkezi oyun state machine
types/                   # GameScene, boss, final ve veri tipleri
```
