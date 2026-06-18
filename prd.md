APLIKASI WEB INTREGRASI SHOPEE

Product Requirement Document (PRD) - MVP Version
Nama Proyek: Multi-Channel Premium Account Claim System (Web & Shopee Integration)
Status Dokumen: Approved for Backlog Refinement
Target Pengguna: Pembeli Akun Premium (Shopee & Web) & Admin Seller

1. Tujuan Produk (Product Objective)
   Membangun sebuah sistem berbasis web otomatis yang memvalidasi pesanan dari dua jalur penjualan (Shopee via API Resmi dan Pembeli Langsung di Web) untuk mendistribusikan stok akun premium (Email & Password) secara real-time, aman, dan mandiri tanpa intervensi manual dari customer service.
2. Fitur Utama & Prioritas (MVP Scope)
   Kita membagi fitur menjadi dua kategori: Must-Have (Wajib ada di versi rilis pertama) dan Nice-to-Have (Ditunda untuk pengembangan fase berikutnya demi menghemat biaya dan waktu).
   A. Fitur Wajib (Must-Have)
   🛡️ Modul Admin (Dashboard Seller)
   Authentication & Security: Login aman khusus untuk Admin/Seller.
   Stok Pool Management (CSV/Excel Bulk Upload): Fitur untuk mengunggah ratusan data akun premium (email_premium dan password_premium) sekaligus ke dalam sistem menggunakan format Excel/CSV.
   Shopee API Integrator & Backup System:
   Halaman konfigurasi untuk memasukkan kredensial API Shopee (Client ID, Secret, Webhook Secret).
   Tombol Manual Sync: Fitur darurat untuk upload data pesanan Shopee via Excel jika API Shopee sedang mengalami kendala/down.
   Monitoring & Log Klaim: Tabel transparan yang mencatat pesanan mana yang sudah melakukan klaim, akun mana yang diberikan, jam berapa diklaim, dan status garansinya.
   🛒 Modul Toko Web Internal (Direct Channel)
   Katalog Produk Sederhana: Halaman depan yang menampilkan variasi produk premium (misal: YouTube 1 Bulan, YouTube 3 Bulan).
   Integrasi Payment Gateway (Midtrans/Xendit): Sistem pembayaran otomatis. Begitu pembeli bayar menggunakan QRIS/E-Wallet/Transfer Bank, sistem langsung mendeteksi status Success.
   🔐 Modul Klaim Pembeli (Claim Engine)
   Form Klaim Tanpa Login: Input nomor pesanan (Mendukung validasi Nomor Pesanan Shopee dan Nomor Invoice Web).
   2-Factor Verification Gate: Fitur keamanan untuk pembeli Shopee dengan mencocokkan 4 digit terakhir nomor HP mereka yang terdaftar di Shopee sebelum akun ditampilkan.
   Halaman Hasil Klaim (Secure Display): Menampilkan rincian akun (Email, Password) serta perhitungan tanggal kedaluwarsa secara otomatis (Tanggal Klaim + Durasi Paket).
   B. Fitur Pendukung (Nice-to-Have - Fase 2 Scale-Up)
   Integrasi WhatsApp Gateway: Mengirimkan detail akun premium langsung ke WhatsApp pembeli setelah klaim berhasil sebagai cadangan catatan.
   Sistem Garansi Otomatis (Replace Button): Tombol bagi pembeli untuk klaim garansi jika akun terkena banned sebelum waktunya (Sistem akan otomatis mengganti dengan akun baru dari stok jika disetujui admin).
   Sistem Membership Web: Fitur bagi pembeli web untuk mendaftar akun agar bisa melihat riwayat seluruh pembelian mereka terdahulu.
3. Aturan Logika Bisnis & Validasi Sistem (Business Logic)
   Satu Pesanan = Satu Akun: Satu nomor pesanan (Shopee/Web) hanya memiliki hak untuk melakukan klaim sebanyak 1 kali. Jika nomor pesanan yang sama diinput kembali, sistem harus menolak dan menampilkan pesan: "Nomor pesanan ini sudah mengklaim akun."
   FIFO (First In, First Out) Stock: Sistem harus mengambil stok akun premium berdasarkan waktu unggah paling lama yang berstatus available (untuk mencegah stok lama kedaluwarsa di dalam database).
   Otomatisasi Status Stok: Begitu akun premium ditampilkan di layar pembeli, detik itu juga status akun tersebut di database berubah menjadi used dan terikat selamanya dengan nomor pesanan pengklaim.
4. Kriteria Penerimaan (Acceptance Criteria)
   Sisi Pembeli Shopee: Pembeli memasukkan nomor pesanan Shopee -> Memasukkan 4 digit nomor HP -> Sistem menampilkan email & password YouTube dengan benar. Durasi pengerjaan proses ini di web harus di bawah 3 detik.
   Sisi Pembeli Web: Pembeli bayar di web -> Pembayaran sukses -> Halaman web otomatis menampilkan email & password tanpa perlu pembeli menginput nomor pesanan secara manual lagi.
   Sisi Admin: Admin mengunggah file berisi 100 akun baru -> Stok di dashboard bertambah menjadi +100 -> File log mencatat aktivitas upload tersebut dengan aman.
   ⚠️ Risk Assessment & Mitigation (Peringatan PM)
   Risiko Kebocoran Data (Brute Force): Karena sistem klaim Shopee tidak memerlukan login, orang iseng bisa menggunakan skrip untuk menebak nomor pesanan Shopee secara acak.
   Mitigasi: Developer wajib menerapkan Rate Limiting (Membatasi input maksimal 5 kali per menit dari IP Address yang sama) dan fitur verifikasi 4 digit nomor HP Shopee harus bersifat strict (salah 3 kali, kunci akses selama 15 menit).
   Risiko Regulasi Shopee API: Mendapatkan akses API resmi Shopee untuk menarik data sensitif seperti nomor HP pembeli memerlukan verifikasi toko yang ketat.
   Mitigasi: Pastikan tokomu di Shopee performanya baik dan tidak memiliki poin penalti besar, atau siapkan fitur Backup Import Excel di modul admin sejak hari pertama development agar bisnis tetap bisa jalan secara semi-otomatis selagi menunggu persetujuan API Shopee.

🛠️ Tech Stack & Architecture Recommendation (MVP)
Melihat kebutuhan real-time status, kecepatan klaim (< 3 detik), dan budget efficiency, ini rekomendasi stack kita:

Front-End & Admin Dashboard: Next.js 14+ (App Router) + Tailwind CSS. Kita pakai Next.js karena butuh SSR/ISR buat katalog web depan (biar SEO bagus) dan API Routes untuk nge-handle webhook Midtrans/Xendit serta Shopee.

Database & Auth: Firebase (Firestore & Auth) atau Supabase (PostgreSQL).

Saran Gue: Karena kita butuh sistem antrean stok berbasis FIFO yang strict dan atomic transaction (biar nggak ada race condition—dua orang ngeklaim akun yang sama di detik yang sama), Supabase/Postgres sedikit lebih unggul dengan fitur SELECT FOR UPDATE (row locking). Tapi kalau lo mau speed to market pakai Firestore, kita bisa akalin pakai Firestore Transaction + Timestamp indexing.

State Management: Zustand (ringan, ga ribet kayak Redux).
