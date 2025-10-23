# Dynamic QRIS Generator 💳✨

Website sederhana untuk membuat QRIS Dynamic dengan nominal pembayaran kustom dari QRIS Statis yang sudah ada. Website ini berjalan sepenuhnya di browser Anda (client-side) tanpa memerlukan backend.

<img src="https://i.imgur.com/nNBWzNJ.jpeg">

---

## Fitur Utama 🌟

* **Input Nominal Kustom.**
* **Generate QRIS Dinamis.**
* **Download QRIS.**
* **Riwayat Transaksi.**
* **Grafik Transaksi.**

---

## Cara Menggunakan 🚀

### 1. Online (Rekomendasi)

Anda bisa langsung menggunakannya melalui link berikut:

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

2.  **Buka `index.html`:** Cukup klik dua kali file `index.html`. Website akan terbuka di browser default Anda.

---

## Teknologi yang Digunakan 🛠️

* **HTML:** Struktur halaman web.
* **CSS:** Styling dan efek Glassmorphism.
* **JavaScript:** Logika Website.

---

## Catatan Penting ⚠️

* **Client-Side Only:** Website ini **tidak terhubung** ke sistem pembayaran bank atau *payment gateway* mana pun.
* **Bukan Transaksi Nyata:** QRIS code yang dihasilkan hanya meniru struktur data QRIS dinamis. Kemampuannya untuk diproses sebagai pembayaran *tergantung* pada sistem *payment gateway* merchant asli dari QRIS statis yang Anda upload. Website ini **tidak memproses atau memvalidasi pembayaran**.
* **Riwayat Lokal:** Riwayat transaksi hanya tersimpan di browser perangkat yang Anda gunakan. Beda perangkat, beda riwayat.

---
