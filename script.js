// Ganti dengan nomor WhatsApp tujuan
const whatsappNumber = "6282160845317"; 
let produkTerpilih = {}; 

/**
 * FUNGSI 1: Membuka Form Alamat
 * Dipanggil saat tombol "Pesan Sekarang" di klik
 */
function bukaFormAlamat(nama, harga) {
    // Simpan data produk ke variabel sementara
    produkTerpilih = { nama, harga };
    
    // Cari elemen di HTML
    const infoProduk = document.getElementById('infoProduk');
    const modalCheckout = document.getElementById('checkoutModal');
    
    // Tampilkan detail produk di dalam form
    if (infoProduk) {
        infoProduk.innerText = `📦 Pesanan: ${nama} (Rp ${harga.toLocaleString('id-ID')})`;
    }
    
    // Tampilkan modal alamat
    if (modalCheckout) {
        modalCheckout.style.display = "flex";
    }
}

/**
 * FUNGSI 2: Menutup Form Alamat
 */
function tutupFormAlamat() {
    document.getElementById('checkoutModal').style.display = "none";
}

/**
 * FUNGSI 3: Proses Kirim WA & Simpan Riwayat
 * Dipanggil saat tombol "Kirim ke WhatsApp & Simpan" di klik
 */
function prosesKeWhatsApp() {
    // Ambil nilai dari inputan user
    const namaPembeli = document.getElementById('inputNama').value;
    const alamatPembeli = document.getElementById('inputAlamat').value;

    // Validasi: Jangan biarkan kosong
    if (!namaPembeli || !alamatPembeli) {
        alert("Harap lengkapi Nama dan Alamat pengiriman!");
        return;
    }

    const waktu = new Date().toLocaleString('id-ID', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
    });
    
    // Siapkan data untuk riwayat
    const dataPesanan = { 
        nama: produkTerpilih.nama, 
        harga: produkTerpilih.harga, 
        pembeli: namaPembeli,
        alamat: alamatPembeli,
        waktu: waktu 
    };

    // --- 1. SIMPAN KE LOCALSTORAGE (Riwayat Browser) ---
    let riwayat = JSON.parse(localStorage.getItem('riwayatAndaliman')) || [];
    riwayat.unshift(dataPesanan); 
    localStorage.setItem('riwayatAndaliman', JSON.stringify(riwayat));

    // --- 2. FORMAT PESAN WHATSAPP ---
    const pesanWA = `Halo Andaliman Ruth, saya ingin memesan:

Produk: *${produkTerpilih.nama}*
Harga: *Rp ${produkTerpilih.harga.toLocaleString('id-ID')}*

*Detail Pengiriman:*
Nama: *${namaPembeli}*
Alamat: *${alamatPembeli}*
Waktu Pesan: ${waktu}

Mohon segera diproses ya, terima kasih!`;

    // --- 3. EKSEKUSI ---
    const urlWA = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(pesanWA)}`;
    
    window.open(urlWA, '_blank'); // Buka WhatsApp
    tutupFormAlamat(); // Tutup Modal
    
    // Bersihkan form agar jika pesan lagi sudah kosong
    document.getElementById('inputNama').value = "";
    document.getElementById('inputAlamat').value = "";
}

/**
 * FUNGSI 4: Menampilkan Riwayat
 */
function showHistory() {
    const modalHistory = document.getElementById("historyModal");
    const containerList = document.getElementById("historyList");
    let riwayat = JSON.parse(localStorage.getItem('riwayatAndaliman')) || [];

    if (modalHistory) {
        modalHistory.style.display = "flex";
    }
    
    if (riwayat.length === 0) {
        containerList.innerHTML = "<p class='text-center text-muted'>Belum ada riwayat pesanan.</p>";
    } else {
        containerList.innerHTML = riwayat.map(item => `
            <div class="p-3 mb-3 border-start border-4 border-success bg-light rounded shadow-sm">
                <div class="d-flex justify-content-between">
                    <strong style="color: #2c3e50;">${item.nama}</strong>
                    <span class="badge bg-success">Rp ${item.harga.toLocaleString('id-ID')}</span>
                </div>
                <div class="small mt-2">
                    <div>👤 <strong>${item.pembeli}</strong></div>
                    <div class="text-muted">📍 ${item.alamat}</div>
                    <div class="text-muted" style="font-size: 10px;">📅 ${item.waktu}</div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * FUNGSI 5: Menutup Riwayat
 */
function closeHistory() {
    document.getElementById("historyModal").style.display = "none";
}

/**
 * Tambahan: Tutup modal jika user klik di area hitam (luar kotak)
 */
window.onclick = function(event) {
    const checkModal = document.getElementById("checkoutModal");
    const histModal = document.getElementById("historyModal");
    
    if (event.target == checkModal) {
        checkModal.style.display = "none";
    }
    if (event.target == histModal) {
        histModal.style.display = "none";
    }
}
