# 🎓 PlacePro — Multi-Step Placement Test Engine

> **Mini Project Seleksi Front-end Developer** — Aplikasi web *Multi-Step Placement Test Engine* untuk mengukur level kemampuan dan memberikan rekomendasi program belajar.

## 🔗 Tautan Penting

| | Tautan |
|---|---|
| **📦 Repositori GitHub** | https://github.com/SuryaRf/placepro |
| **🌐 Live Deployment** | `https://your-live-deployment.vercel.app` *(isi setelah deploy)* |

---

## 📖 Tentang Proyek

PlacePro adalah aplikasi web **Single Page Application (SPA)** yang memandu calon peserta didik melewati alur lengkap:

1. **Registrasi Biodata** — pengisian identitas (Nama, Email, WhatsApp, Domisili, Target Program) dengan validasi form menyeluruh.
2. **Pengerjaan Ujian** — 15 soal pilihan ganda dengan navigasi bebas, indikator progress real-time, dan **auto-save** progress ke `localStorage`.
3. **Hasil & Rekomendasi** — kalkulasi skor, penentuan level (Beginner / Intermediate / Advanced), kartu rekomendasi program, serta tombol CTA **WhatsApp** dengan pesan ter-generate otomatis.

### Fitur Unggulan

- ✅ **Step indicator** — indikator visual 3 langkah (Biodata → Tes → Hasil) di setiap halaman agar pengguna selalu tahu posisinya.
- ✅ **Validasi form intuitif** — pesan error per bidang, live-clear saat mengetik ulang, fokus otomatis ke field yang bermasalah.
- ✅ **Auto-save progress** — jawaban & posisi soal tersimpan otomatis; ditutup browser pun tetap terlindungi.
- ✅ **Navigasi & progress bar real-time** — peta soal (terjawab/belum/aktif) + animasi progress, tersedia sebagai grid pada desktop & panel collapsible di mobile.
- ✅ **Konfirmasi submit** — modal konfirmasi + pengecekan soal belum terjawab (feedback shake).
- ✅ **Auto-advance cerdas** — usai menjawab langsung lompat ke soal berikutnya yang belum dijawab.
- ✅ **Pesan WhatsApp dinamis** — nomor otomatis dinormalisasi ke kode negara Indonesia (`0xxxx` → `62xxxx`).
- ✅ **Visualisasi skor** — ring animasi persentase pada halaman hasil.
- ✅ **Animasi halus** — transisi antar soal dengan Framer Motion (spring, staggered, layout).
- ✅ **Mobile-responsive** — layout adaptif, tombol navigasi soal, dan sticky submit bar di mobile.
- ✅ **Empty & loading states** — splash loading saat "fetch" soal, guard redirect bila akses tidak sah.

---

## 🚀 Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18 ke atas
- npm (bundling otomatis dengan Vite)

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/your-username/studycase_fe.git
cd studycase_fe

# 2. Install dependensi
npm install

# 3. Jalankan mode development
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build Production

```bash
npm run build      # menghasilkan folder dist/
npm run preview    # pratinjau hasil build
npm run lint       # menjalankan oxlint
```

---

## 🧱 Stack Teknologi

| Teknologi | Keterangan |
|---|---|
| **React 19** | Library UI (Vite + JSX) |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first CSS framework (`@tailwindcss/vite`) |
| **React Router v7** | Routing SPA (`/`, `/test`, `/result`) |
| **Framer Motion** | Animasi & transisi |
| **localStorage** | Auto-save progress & data sesi |

> Seluruh antarmuka dibangun **mandiri** dengan Tailwind CSS — **tanpa** pustaka komponen pihak ketiga (shadcn/ui, DaisyUI, dsb).

**Sumber data:** soal & rekomendasi program disimpan sebagai **mock data JSON lokal** yang terstruktur di `src/data/questions.json` (dimuat melalui `src/data/quizData.js`), sesuai ketentuan bahwa sumber data dapat berupa mock data JSON lokal yang dikelola secara terstruktur.

---

## 🗂 Struktur Proyek

```
src/
├── components/
│   ├── layout/
│   │   ├── Background.jsx   # Dekorasi latar bersama
│   │   └── Logo.jsx         # Logo merek
│   └── ui/                  # Komponen reusable modular
│       ├── Button.jsx
│       ├── TextInput.jsx     # Form Input
│       ├── OptionButton.jsx  # Option Button
│       ├── ProgressBar.jsx   # Progress Bar
│       ├── QuestionCard.jsx  # Question Card
│       ├── ResultCard.jsx    # Result Card (rekomendasi + CTA)
│       ├── ScoreCard.jsx     # Ring skor & level
│       ├── Stepper.jsx       # Indikator langkah multi-step
│       └── Icon.jsx          # Set ikon SVG mandiri
├── context/
│   └── QuizContext.jsx      # State global + useQuiz hook
├── data/
│   ├── questions.json       # Mock data JSON (15 soal & rekomendasi)
│   └── quizData.js          # Loader data dari JSON
├── pages/
│   ├── Landing.jsx          # Halaman landing + biodata (/)
│   ├── Quiz.jsx             # Halaman pengerjaan ujian (/test)
│   └── Result.jsx           # Halaman hasil & rekomendasi (/result)
├── utils/
│   ├── quiz.js              # skoring, level, buildWhatsAppLink
│   ├── storage.js           # abstraksi localStorage
│   └── validation.js        # validasi biodata
├── App.jsx                  # Router
├── main.jsx                 # Entry point
└── index.css                # Design system (Tailwind theme)
```

---

## ⚙️ Arsitektur & Manajemen State

Manajemen state pengerjaan kuis **terisolasi rapi** melalui **React Context API** (`QuizContext`) yang mengekspos hook `useQuiz()`.

```js
const {
  questions,      // daftar soal
  user,           // profil biodata
  answers,        // { questionId: keyPilihan }
  currentIndex,   // indeks soal aktif
  selectAnswer,   // mencatat pilihan
  goTo, goNext, goPrev,  // navigasi soal
  resetTest,      // reset seluruh progres tes
} = useQuiz()
```

**Efisiensi re-render:** state yang sering berubah (`answers`, `currentIndex`) dikelola tersentralisasi sehingga hanya komponen yang mengonsumsi nilai tersebut yang re-render. `value` context dimemoize dengan `useMemo`; aksi dibungkus `useCallback`.

### Auto-save ke localStorage

```js
// storage utils — kunci data
placepro.user              // profil biodata
placepro.answers           // { qId: key }
placepro.current           // indeks soal aktif
placepro.submitted         // flag submit
placepro.result            // (cadangan) hasil
```

Setiap perubahan `answers` / `currentIndex` langsung dipersist lewat `useEffect`, sehingga pengguna bisa menutup browser dan melanjutkan kapan saja.

---

## 🧮 Logika Kalkulasi & Level

- **Skor** = jumlah jawaban benar dari 15 soal.
- **Persentase** = `(benar / 15) × 100`.
- **Level** ditentukan berdasarkan rentang (sesuai ketentuan):

| Rentang Skor | Level |
|---|---|
| 0 – 40% | **Beginner** |
| 41 – 75% | **Intermediate** |
| 76 – 100% | **Advanced** |

Soal juga memiliki atribut kesulitan (`easy` / `medium` / `hard`) untuk menampilkan rincian kekuatan per kategori di halaman hasil.

### Rekomendasi Program

- **Beginner** → *Foundations of English* (12 minggu)
- **Intermediate** → *Conversational Confidence* (10 minggu)
- **Advanced** → *Professional Fluency* (8 minggu)

Setiap program menyertakan deskripsi, tujuan belajar, durasi, dan modul pembelajaran.

### Pesan WhatsApp Dinamis

```js
buildWhatsAppLink({ phone, name, level, score, total, programTitle })
```

- Normalisasi nomor WhatsApp: `0812...` → `62812...` (kode negara Indonesia).
- Generate pesan terformat berisi nama, level, skor, dan program yang direkomendasikan.

---

## 🎨 Desain & UX

- **Palet warna**: *paper* (hangat), *ink* (gelap), *moss* (hijau), *sun* (amber) — nuansa editorial yang tenang, tidak generik.
- **Tipografi**: `Space Grotesk` (display) + `Plus Jakarta Sans` (teks).
- **Asimetri & whitespace** luas pada landing, kartu dengan bayangan halus, dan sudut membulat.
- **Struktur jelas**: halaman landing disusun menjadi Hero → Cara Kerja → Program, masing-masing dengan judul dan penjelasan eksplisit agar tidak membingungkan.
- **Mikro-interaksi**: hover lift tombol/kartu, spring physics Framer Motion, transisi geser antar soal, gerakan staggered, ring skor animasi, dan tombol scroll ke form.
- **Aksesibilitas**: fokus ring `focus-visible`, `aria-pressed` pada opsi, kontras WCAG AA.
- **Responsif**: `flex/grid` adaptif, navigasi soal collapse, sticky submit bar di mobile.

---

## 📝 Dokumentasi Penggunaan AI

> Sesuai ketentuan, seluruh prompt yang digunakan bersama AI dicantumkan di sini.

**Prompt utama (ringkasan):**

> "Bantu saya mengerjakan Mini Project Seleksi Front-end Developer — aplikasi web React + Tailwind CSS sebagai Multi-Step Placement Test Engine. Ikuti ketentuan: modular komponen, Context API/useQuiz, halaman landing+biodata dengan validasi, halaman ujian 15 soal dengan auto-save localStorage dan navigasi bebas, halaman hasil dengan level Beginner/Intermediate/Advanced, rekomendasi program, dan CTA WhatsApp dinamis. Buat tampilan depan yang indah, modern, animatif namun tetap clean dan tidak berlebihan. Kerjakan secara rapi, gunakan package pendukung yang diperlukan."

**Iterasi tambahan (ringkasan):**
- "Normalisasi nomor WhatsApp Indonesia (leading 0 → +62) pada link CTA."
- "Tambah hint pada input nomor WhatsApp untuk kejelasan UX."
- "Pastikan guard redirect pada halaman tes/hasil bila akses tidak sah."
- "Verifikasi fungsionalitas via automation (Playwright) dan pastikan lint + build bersih."

---

## 🧪 Pengujian

Fungsionalitas divalidasi dengan automation **Playwright** (21 kasus uji):

- ✅ Validasi form biodata (error muncul saat kosong)
- ✅ Navigasi ke `/test` setelah submit
- ✅ Render soal & 15 tombol navigasi
- ✅ Auto-advance & progress 100% setelah semua terjawab
- ✅ Modal konfirmasi submit
- ✅ Hasil: header, skor, level, seksi rekomendasi
- ✅ CTA WhatsApp (ter-normalisasi + pesan ter-generate)
- ✅ Persistensi `localStorage` (answers, user, submitted)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan seleksi Front-end Developer. Silakan digunakan sebagai referensi belajar.

---

*Dibuat dengan ☕, React, dan Tailwind CSS.*
