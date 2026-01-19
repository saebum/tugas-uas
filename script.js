// --- KONFIGURASI ---
// Ganti URL ini dengan URL Webhook n8n Anda (Pilih opsi 'Test' atau 'Production' URL)
// Contoh: https://n8n.server-anda.com/webhook/lapor
const WEBHOOK_URL = 'https://n8n-re9macilutpq.kol.sumopod.my.id/webhook/lapor-bot'; 

const form = document.getElementById('complaintForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultArea = document.getElementById('resultArea');

// Elemen Output
const badgeCategory = document.getElementById('badgeCategory');
const botReply = document.getElementById('botReply');
const priorityLevel = document.getElementById('priorityLevel');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // 1. Ambil data dari form
    const nama = document.getElementById('nama').value;
    const pesan = document.getElementById('pesan').value;

    // 2. Ubah tampilan tombol jadi loading
    setLoading(true);
    resultArea.classList.add('hidden'); // Sembunyikan hasil lama jika ada

    try {
        // 3. Kirim data ke n8n via Webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama: nama,
                pesan: pesan
            })
        });

        if (!response.ok) {
            throw new Error('Gagal menghubungi server');
        }

        // 4. Terima balasan JSON dari n8n
        const data = await response.json();
        
        // 5. Tampilkan hasil di layar
        displayResult(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim laporan. Pastikan n8n aktif.');
    } finally {
        // 6. Kembalikan tombol seperti semula
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Memproses...';
        loader.style.display = 'block';
    } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Kirim Laporan';
        loader.style.display = 'none';
    }
}

function displayResult(data) {
    // Mapping data JSON dari n8n ke HTML
    // Pastikan key object-nya sesuai dengan settingan "Respond to Webhook" di n8n
    
    botReply.textContent = data.reply || "Terima kasih, laporan diterima.";
    badgeCategory.textContent = data.ticket_info?.kategori || "UMUM";
    priorityLevel.textContent = data.ticket_info?.urgensi || "Normal";
    
    // Mewarnai badge berdasarkan urgensi (Opsional logika simpel)
    const urgensi = (data.ticket_info?.urgensi || '').toLowerCase();
    if(urgensi.includes('tinggi')) {
        badgeCategory.style.backgroundColor = '#fee2e2'; // Merah muda
        badgeCategory.style.color = '#991b1b';
    } else {
        badgeCategory.style.backgroundColor = '#dbeafe'; // Biru muda
        badgeCategory.style.color = '#1e40af';
    }

    // Munculkan kartu hasil
    resultArea.classList.remove('hidden');
}