let saldo = 0;
let riwayat = [];
let chart;

window.onload = function() {
    // Load data
    if(localStorage.getItem('saldo')) saldo = parseInt(localStorage.getItem('saldo'));
    if(localStorage.getItem('riwayat')) riwayat = JSON.parse(localStorage.getItem('riwayat'));
    
    // Load theme
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('toggleTheme').checked = true;
    }

    tampilkanSaldo();
    tampilkanRiwayat();
    updateChart();
    updateReport();
    tampilkanMotivasi(); // Tampilkan quote motivasi
};

// Theme toggle
document.getElementById('toggleTheme').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', this.checked ? 'dark' : 'light');
});

// Tambah transaksi
function tambahTransaksi() {
    const keterangan = document.getElementById('keterangan').value;
    const jumlah = parseInt(document.getElementById('jumlah').value);
    const tipe = document.getElementById('tipe').value;
    const kategori = document.getElementById('kategori').value;

    if (!keterangan || isNaN(jumlah)) return alert('Isi semua data transaksi!');

    saldo += tipe === 'pemasukan' ? jumlah : -jumlah;

    const transaksi = { keterangan, jumlah, tipe, kategori, tanggal: new Date().toLocaleString() };
    riwayat.push(transaksi);

    localStorage.setItem('saldo', saldo);
    localStorage.setItem('riwayat', JSON.stringify(riwayat));

    tampilkanSaldo();
    tampilkanRiwayat();
    updateChart();
    updateReport();
    tampilkanMotivasi(); // Update quote
    document.getElementById('keterangan').value = '';
    document.getElementById('jumlah').value = '';
}

// Tampilkan saldo
function tampilkanSaldo() {
    document.getElementById('saldo').innerText = saldo;
}

// Tampilkan riwayat dengan filter
function tampilkanRiwayat() {
    const list = document.getElementById('riwayat');
    const filterTipe = document.getElementById('filterTipe').value;
    const filterKategori = document.getElementById('filterKategori').value;

    list.innerHTML = '';
    riwayat.slice().reverse().forEach(item => {
        if((filterTipe === 'all' || item.tipe === filterTipe) &&
           (filterKategori === 'all' || item.kategori === filterKategori)) {
            const li = document.createElement('li');
            li.innerText = `[${item.tanggal}] ${item.tipe.toUpperCase()} - ${item.keterangan} (${item.kategori}): Rp ${item.jumlah}`;
            list.appendChild(li);
        }
    });
}

// Update chart
function updateChart() {
    const pemasukan = riwayat.filter(t => t.tipe === 'pemasukan').reduce((a,b) => a + b.jumlah, 0);
    const pengeluaran = riwayat.filter(t => t.tipe === 'pengeluaran').reduce((a,b) => a + b.jumlah, 0);

    const ctx = document.getElementById('grafik').getContext('2d');
    if(chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{ label: 'Rp', data: [pemasukan, pengeluaran], backgroundColor: ['#4CAF50','#f44336'] }]
        },
        options: { responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
    });
}

// Update laporan bulanan
function updateReport() {
    const now = new Date();
    const bulan = now.getMonth();
    const tahun = now.getFullYear();
    const pemasukan = riwayat.filter(t => {
        const d = new Date(t.tanggal);
        return t.tipe==='pemasukan' && d.getMonth()===bulan && d.getFullYear()===tahun;
    }).reduce((a,b)=>a+b.jumlah,0);

    const pengeluaran = riwayat.filter(t => {
        const d = new Date(t.tanggal);
        return t.tipe==='pengeluaran' && d.getMonth()===bulan && d.getFullYear()===tahun;
    }).reduce((a,b)=>a+b.jumlah,0);

    document.getElementById('lapPemasukan').innerText = pemasukan;
    document.getElementById('lapPengeluaran').innerText = pengeluaran;
    document.getElementById('lapSaldo').innerText = pemasukan - pengeluaran;
}

// Tampilkan kata motivasi random
function tampilkanMotivasi() {
    const quotes = [
        "Manage pengeluaran kamu agar menjadi financial freedom",
        "Hemat hari ini, nikmati kebebasan besok",
        "Uangmu adalah alat, gunakan dengan bijak",
        "Catat pengeluaran, raih mimpi finansialmu",
        "Setiap rupiah yang dicatat mendekatkanmu ke tujuan"
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('motivasi').innerText = quotes[randomIndex];
}
