# Lingora — Design Revamp Discovery

> Dokumen ini berisi: prompt untuk AI/human, pertanyaan ramah pengguna awam, dan alternatif desain pilihan ganda.
> Input utama: `current-design-system.json`

---

## PROMPT UTAMA (copy-paste ke AI)

```
Kamu adalah Design Consultant yang membantu pemilik produk merancang ulang tampilan aplikasi mereka.

KONTEKS:
Saya punya aplikasi bernama Lingora — platform berlatih percakapan bahasa dengan AI.
Saya ingin revamp 100% desain, tapi prosesnya harus MUDAH untuk orang awam.

DATA DESAIN SAAT INI:
[LAMPIRKAN ISI FILE current-design-system.json DI SINI]

TUGASMU:
1. Pahami atmosphere, nuansa, dan penglihatan app saat ini dari JSON
2. Tanyakan kepadaku (secara bertahap, per section) bagaimana saya ingin app terlihat SETELAH revamp
3. Gunakan bahasa Indonesia yang ramah, hindari jargon desain
4. Setiap pertanyaan harus bisa dijawab dengan PILIHAN GANDA (A/B/C/D)
5. Setelah semua jawaban terkumpul, buatkan:
   - Ringkasan keputusan desain baru
   - Design tokens baru (JSON)
   - Daftar perubahan komponen
   - Preview deskriptif: "App akan terlihat seperti..."

ATURAN PERTANYAAN:
- Maksimal 4 opsi per pertanyaan
- Setiap opsi punya deskripsi singkat + contoh app yang familiar ("mirip Spotify", "mirip Notion", dll.)
- Jangan tanya lebih dari 5 pertanyaan sekaligus
- Mulai dari yang paling terlihat (warna & kesan umum), lalu layout, lalu detail

MULAI dengan Section 1 setelah saya konfirmasi siap.
```

---

## PROMPT RINGKAS (untuk sesi cepat)

```
Baca JSON desain Lingora di bawah ini. Lalu ajukan 10 pertanyaan pilihan ganda (bahasa Indonesia, ramah untuk awam) untuk menentukan revamp desain. Setelah saya jawab semua, hasilkan design-system-v2.json.

[PASTE current-design-system.json]
```

---

## SECTION 1 — Kesan Umum App (Pertanyaan Awam)

### Q1. Saat membuka Lingora, Anda ingin merasa seperti apa?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Ruang belajar yang tenang | Seperti perpustakaan modern — fokus, minim distraksi |
| **B** | Teman ngobrol yang fun | Seperti chat dengan teman — santai, hangat |
| **C** | Coach profesional | Seperti sesi dengan tutor berpengalaman — serius tapi supportif |
| **D** | Game edukasi | Seperti Duolingo — playful, ada reward & energi |

### Q2. Warna utama yang paling cocok untuk app belajar bahasa?

| | Opsi | Warna | Kesan |
|---|------|-------|-------|
| **A** | Hijau (sekarang) | #00A76F | Segar, growth, natural |
| **B** | Biru | #2563EB | Trust, calm, tech |
| **C** | Ungu | #7C3AED | Kreatif, modern, AI |
| **D** | Oranye | #F97316 | Energik, friendly, motivasi |

### Q3. Background app sebaiknya seperti apa?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Putih bersih (sekarang) | Minimal, terang, corporate |
| **B** | Cream/warm white | Lebih hangat, tidak silau |
| **C** | Dark mode default | Gelap, fokus, modern |
| **D** | Gradient lembut | Background berwarna halus, lebih hidup |

---

## SECTION 2 — Layout & Navigasi

### Q4. Navigasi utama app?

| | Opsi | Deskripsi | Contoh familiar |
|---|------|-----------|-----------------|
| **A** | Header atas saja (sekarang) | Link teks di atas | Website sederhana |
| **B** | Sidebar kiri | Menu tetap di kiri | Notion, Gmail |
| **C** | Bottom tab (mobile-first) | 4-5 icon di bawah | Instagram, Spotify |
| **D** | Floating menu | Tombol bulat mengambang | Google Assistant |

### Q5. Halaman Conversation (chat) sebaiknya?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Chat bubble klasik (sekarang) | WhatsApp-style |
| **B** | Full-screen immersive | Hampir tanpa header, fokus suara |
| **C** | Split view | Chat kiri, tips/feedback kanan |
| **D** | Card-based turns | Setiap giliran = satu kartu besar |

---

## SECTION 3 — Typography & Bentuk

### Q6. Gaya huruf/tulisan?

| | Opsi | Font feel | Contoh |
|---|------|-----------|--------|
| **A** | Modern bold (sekarang) | Public Sans tebal | Startup SaaS |
| **B** | Soft & rounded | Bulat, friendly | Headspace |
| **C** | Classic serif | Elegan, akademik | Medium, NY Times |
| **D** | Geometric clean | Tegas, minimal | Linear, Vercel |

### Q7. Sudut elemen (border radius)?

| | Opsi | Nilai | Kesan |
|---|------|-------|-------|
| **A** | Sedang 8px (sekarang) | Standar MUI | Seimbang |
| **B** | Sangat rounded 16-24px | Pill-like | Friendly, modern |
| **C** | Tajam 0-4px | Sharp corners | Professional, editorial |
| **D** | Mixed | Card bulat, button tajam | Kontras menarik |

---

## SECTION 4 — Komponen Kunci

### Q8. Tombol utama (CTA) seperti apa?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Solid filled hijau (sekarang) | Tombol penuh warna |
| **B** | Outline/border | Tombol garis, isi transparan |
| **C** | Gradient | Tombol bergradasi warna |
| **D** | Soft/tinted | Background warna tipis, teks berwarna |

### Q9. Kartu/kontainer konten?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Card putih + shadow (sekarang) | Mengambang di background |
| **B** | Flat tanpa shadow | Border tipis saja |
| **C** | Glassmorphism | Transparan blur |
| **D** | Tanpa card | Konten langsung di background |

---

## SECTION 5 — Mode & Aksesibilitas

### Q10. Default tema saat pertama buka?

| | Opsi |
|---|------|
| **A** | Light mode (sekarang) |
| **B** | Dark mode |
| **C** | Ikuti sistem (auto) |

### Q11. Ilustrasi & imagery?

| | Opsi | Deskripsi |
|---|------|-----------|
| **A** | Tanpa ilustrasi (sekarang) | Pure UI, teks saja |
| **B** | Ilustrasi flat/colorful | Karakter & scene |
| **C** | Foto real orang | Human connection |
| **D** | Abstract shapes | Bentuk geometris dekoratif |

---

## ALTERNATIF DESAIN (berdasarkan data saat ini)

Berdasarkan `current-design-system.json`, berikut 4 arah revamp yang realistis:

---

### Alternatif A — "Evolution" (perbaiki yang ada)

**Konsep:** Pertahankan basis Minimals, tambah identitas Lingora

| Aspek | Perubahan |
|-------|-----------|
| Warna | Hijau primary dipertahankan, purple jadi aksen sekunder aktif |
| Layout | Tambah sidebar kiri (gunakan themeLayout vertical yang sudah ada) |
| Conversation | Bubble dipertahankan, tambah avatar AI & user |
| Typography | Public Sans tetap |
| Atmosphere | Professional → Professional + warm |

**Cocok jika:** Anda suka tampilan sekarang tapi ingin lebih "punya karakter"

---

### Alternatif B — "Calm Coach" (tenang & fokus)

**Konsep:** Ruang belajar digital yang menenangkan

| Aspek | Perubahan |
|-------|-----------|
| Warna | Primary → Blue #3B82F6, background → #F8FAFC |
| Layout | Sidebar minimal + area konten luas |
| Conversation | Split view: chat + panel tips pronounciation |
| Typography | Inter atau Plus Jakarta Sans (lebih soft) |
| Radius | 12px — lebih rounded |
| Atmosphere | Dashboard → Meditation app meets tutor |

**Cocok jika:** Target user belajar malam hari, ingin fokus tanpa distraksi

---

### Alternatif C — "Speak Play" (energik & fun)

**Konsep:** Belajar bahasa terasa seperti main game

| Aspek | Perubahan |
|-------|-----------|
| Warna | Primary → Orange #F97316, secondary → Purple |
| Layout | Bottom navigation 4 tab |
| Conversation | Full-screen immersive, besar, dengan animasi |
| Typography | Nunito atau Poppins — rounded friendly |
| Radius | 20px+ pill buttons |
| Imagery | Ilustrasi karakter AI tutor |
| Atmosphere | Admin panel → Duolingo meets chat app |

**Cocok jika:** Target user muda, ingin belajar terasa fun bukan formal

---

### Alternatif D — "AI Native" (futuristik & tech-forward)

**Konsep:** Platform AI speaking yang terasa cutting-edge

| Aspek | Perubahan |
|-------|-----------|
| Warna | Primary → Purple #8B5CF6, dark mode default |
| Layout | Header minimal, sidebar collapsible |
| Conversation | Card-based turns + waveform audio visual |
| Typography | Geist atau SF Pro — clean tech |
| Radius | 8px sharp-modern |
| Effects | Glassmorphism cards, subtle gradients |
| Atmosphere | SaaS admin → ChatGPT meets voice app |

**Cocok jika:** Ingin positioning sebagai AI product premium

---

## MATRIKS PILIHAN CEPAT

Jawab 4 huruf untuk dapat rekomendasi awal:

```
Q1 (Kesan):    A / B / C / D
Q2 (Warna):    A / B / C / D
Q4 (Navigasi): A / B / C / D
Q5 (Chat UI):  A / B / C / D
```

| Jawaban dominan | Rekomendasi |
|-----------------|-------------|
| A + A + A + A | Alternatif A (Evolution) |
| A + B + B + C | Alternatif B (Calm Coach) |
| B/D + C/D + C/D + B | Alternatif C (Speak Play) |
| C + C + B + D | Alternatif D (AI Native) |

---

## OUTPUT YANG DIHASILKAN SETELAH DISCOVERY

Setelah semua pertanyaan dijawab, generate:

1. `design-system-v2.json` — tokens baru
2. `design-migration-map.json` — file mana yang perlu diubah
3. `design-preview.md` — deskripsi "app akan terlihat seperti..."
4. Implementasi bertahap di `src/theme/`

---

## Cara Pakai (untuk Anda)

1. Buka `current-design-system.json` — ini snapshot desain sekarang
2. Copy **PROMPT UTAMA** di atas ke chat AI baru
3. Paste JSON-nya
4. Jawab pertanyaan pilihan ganda per section
5. Minta hasilkan `design-system-v2.json`
6. Baru mulai implementasi revamp
