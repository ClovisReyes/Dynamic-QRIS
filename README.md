# Dynamic QRIS Generator 💳✨

Aplikasi web sederhana untuk membuat QR code QRIS dengan nominal pembayaran kustom dari gambar QRIS statis yang sudah ada. Aplikasi ini berjalan sepenuhnya di browser Anda (client-side) tanpa memerlukan backend.

![Screenshot Aplikasi](link-ke-screenshot-anda.png) 
*(Ganti `link-ke-screenshot-anda.png` dengan URL screenshot aplikasi Anda, misalnya dari Imgur)*

---

## Fitur Utama 🌟

* **Upload QRIS Statis:** Unggah gambar QRIS statis Anda (format PNG, JPG, dll.).
* **Pemindaian Otomatis:** Kode QRIS dari gambar akan otomatis terbaca.
* **Input Nominal Kustom:** Masukkan jumlah pembayaran yang Anda inginkan (dengan format pemisah ribuan otomatis).
* **Generate QR Dinamis (Client-Side):** Membuat QR code baru dengan struktur data QRIS yang menyertakan nominal pembayaran Anda.
* **Download QR:** Unduh QR code yang baru dibuat sebagai file PNG (sudah termasuk border putih).
* **Riwayat Transaksi:** Melihat daftar transaksi yang pernah Anda generate (disimpan di `localStorage` browser Anda).
* **Grafik Transaksi:** Visualisasi sederhana dari nominal transaksi Anda.
* **Desain Glassmorphism:** Tampilan modern dengan efek kaca buram.
* **Font Kustom:** Menggunakan font Linotte.

---

## Cara Menggunakan 🚀

### 1. Online (Rekomendasi)

Anda bisa langsung menggunakan aplikasi ini melalui link berikut:

**(https://dynamic-qris-ten.vercel.app/)**

### 2. Secara Lokal (Offline)

Jika Anda ingin menjalankannya di komputer Anda:

1.  **Unduh Semua File:** Pastikan Anda memiliki semua file proyek ini dalam satu folder:
    * `index.html`
    * `style.css`
    * `script.js`
    * `jsqr.min.js`
    * `qrcode.min.js`
    * `chart.min.js`
    * Folder `fonts/` (berisi file `Linotte-Regular.otf` dan `Linotte-Bold.otf`)

2.  **Buka `index.html`:** Cukup klik dua kali file `index.html`. Aplikasi akan terbuka di browser default Anda. **Tidak perlu instalasi `npm` atau server.**

---

## Teknologi yang Digunakan 🛠️

* **HTML:** Struktur halaman web.
* **CSS:** Styling dan efek Glassmorphism.
* **JavaScript (Vanilla):** Logika aplikasi.
* **jsQR.js:** Library untuk membaca data QR code dari gambar.
* **QRCode.js:** Library untuk meng-generate gambar QR code.
* **Chart.js:** Library untuk membuat grafik transaksi.
* **Linotte Font:** Font kustom untuk tampilan.
* **LocalStorage:** Untuk menyimpan riwayat transaksi di browser.

---

## Batasan Penting ⚠️

* **Client-Side Only:** Aplikasi ini **tidak terhubung** ke sistem pembayaran bank atau *payment gateway* mana pun.
* **Bukan Transaksi Nyata:** QR code yang dihasilkan hanya meniru struktur data QRIS dinamis. Kemampuannya untuk diproses sebagai pembayaran *tergantung* pada sistem *payment gateway* merchant asli dari QRIS statis yang Anda upload. Aplikasi ini **tidak memproses atau memvalidasi pembayaran**.
* **Riwayat Lokal:** Riwayat transaksi hanya tersimpan di browser perangkat yang Anda gunakan. Beda perangkat, beda riwayat.

---
