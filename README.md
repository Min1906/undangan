# 💍 Website Undangan Pernikahan Digital - Elegant Minimalist (Enhanced Edition)

Proyek website undangan pernikahan digital responsif, modern, dan sangat estetis yang dibangun murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript** tanpa ketergantungan framework berat.

---

## 🌟 Fitur Interaktif & Estetis Tambahan

1. **Cover dengan Segel Lilin Estetis (Wax Seal Stamp):**
   - Menampilkan emblem inisial mempelai (*"A&A"*) bergaya segel lilin emas timbul (*wax seal*) dengan efek animasi bernapas (*pulse*).
   - Tombol **"Buka Undangan"** dengan kilauan cahaya (*shimmer gleam*).
2. **Efek Guguran Kelopak Bunga (Falling Flower Petals):**
   - Partikel kelopak bunga melati/sakura lembut dan serpihan emas melayang di latar belakang menggunakan HTML5 Canvas.
   - Dilengkapi tombol floating melayang di kanan bawah untuk mengaktifkan/menonaktifkan efek kelopak bunga kapan saja (🌸).
3. **Piringan Hitam & Visualizer Audio (Mini Equalizer):**
   - Tombol pengontrol musik di sudut kanan bawah kini dilengkapi animasi bar equalizer gelombang suara aktif saat musik diputar.
4. **Generator Tautan Undangan WhatsApp (Share Tool):**
   - Tamu atau pengantin dapat mengklik tombol **"Kirim Undangan ke Teman"** di bagian atas untuk membuka jendela modal pembuat pesan WhatsApp otomatis. Cukup masukkan nama teman, maka teks personalisasi beserta tautan resmi akan terbentuk dan siap dikirim via WhatsApp Web/App dalam 1 klik!
5. **Modal Preview QRIS Amplop Digital:**
   - Selain opsi nomor rekening dan salin nomor rekening, tamu dapat mengklik tombol **"Lihat QRIS"** untuk menampilkan barcode QRIS digital yang bisa langsung di-scan oleh aplikasi e-wallet (GoPay, OVO, Dana, BCA Mobile, dll).
6. **Reaksi Emoji pada Buku Tamu & Doa:**
   - Tamu kini dapat memberikan reaksi emoji interaktif pada setiap ucapan yang ada:
     - ❤️ **Cinta / Love**
     - 🙏 **Amin / Doa**
     - 👏 **Selamat / Bahagia**
   - Jumlah reaksi dihitung dan tersimpan secara real-time di **LocalStorage**.
7. **Filter Kategori Galeri Foto:**
   - Tab navigasi galeri prewedding: **Semua Foto**, **Outdoor**, **Studio**, dan **Detail Momen**.
   - Dilengkapi dukungan **Touch Swipe** (geser layar ke kiri/kanan di ponsel) pada tampilan Lightbox.
8. **Ornamen Bingkai Botani (Gold Foil Botanical Accents):**
   - Hiasan sudut daun botani SVG bergoyang lembut (*gentle leaf sway*) di sudut header dan penutup.

---

## 📁 Struktur Folder

```
fita/
├── index.html              # Halaman utama undangan (12 bagian lengkap + modal interaktif)
├── css/
│   ├── style.css           # Desain tema Elegant Minimalist, frosted glass, & warna mewah
│   └── animations.css      # Animasi scroll reveal, wax seal pulse, shimmer, & equalizer
├── js/
│   ├── app.js              # Controller utama: URL parsing, WhatsApp generator, QRIS modal, toast
│   ├── countdown.js        # Countdown timer real-time & integrasi Google Calendar
│   ├── gallery.js          # Lightbox foto, tab kategori filter, & gestur swipe
│   ├── music-confetti.js   # Pemutar audio, visualizer bar, konfeti, & kelopak bunga
│   └── rsvp-wishes.js      # Manajemen data LocalStorage (RSVP, Doa, Reaksi Emoji, & Moderasi)
├── assets/
│   ├── images/             # Folder aset foto lokal
│   └── music/              # Folder berkas audio lokal (wedding-song.mp3)
└── README.md               # Panduan lengkap proyek
```

---

## 🚀 Petunjuk Menjalankan Proyek

### Cara 1: Langsung di Browser (Paling Praktis)
1. Buka folder proyek ini di File Explorer: `c:\Users\iqbal\OneDrive - Universitas Semarang\Documents\fita\`
2. Klik dua kali pada file `index.html` (atau klik kanan > **Open with** > Google Chrome / Microsoft Edge / Firefox).
3. Anda dapat langsung menguji dengan menambahkan nama tamu di URL:
   ```text
   index.html?to=Bapak+Joko+Santoso
   ```

### Cara 2: Menjalankan di XAMPP (Localhost)
1. Salin seluruh folder `fita` ke direktori `htdocs` XAMPP Anda:
   - Contoh path Windows: `C:\xampp\htdocs\fita\`
2. Jalankan modul **Apache** di **XAMPP Control Panel**.
3. Akses melalui browser:
   ```text
   http://localhost/fita/?to=Sahabat+Dimas+Prasetyo+%26+Partner
   ```

---

## 🛠️ Ringkasan PIN & Konfigurasi

- **PIN Moderasi Ucapan**: `1234` (dapat diubah di `js/rsvp-wishes.js` baris ke-7).
- **Target Tanggal Acara**: `2027-04-18` (dapat diubah di `js/countdown.js` baris ke-7).
- **Format Parameter URL Nama Tamu**: `?to=Nama+Tamu` atau `?u=Nama+Tamu` atau `?guest=Nama+Tamu`.
