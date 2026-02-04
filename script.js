let saldo = 0;
let riwayat = [];

window.onload = function() {
    if(localStorage.getItem('saldo')) saldo = parseInt(localStorage.getItem('saldo'));
    if(localStorage.getItem('riwayat')) riwayat = JSON.parse(localStorage.getItem('riwayat'));
    tampilkanSaldo();
    tampilkanRiwayat();
    updateChart();
};

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

    document.getElementById('keterangan').value = '';
    document.getElementById('jumlah').value = '';
}

function tampilkanSaldo() {
    document.getElementById('saldo').innerText = saldo;
}

function tampilkanRiwayat() {
    const list = document.getElementById('riwayat');
    list.innerHTML = '';
    riwayat.slice().reverse().forEach(item => {
        const li = document.createElement('li');
        li.innerText = `[${item.tanggal}] ${item.tipe.toUpperCase()} - ${item.keterangan} (${item.kategori}): Rp ${item.jumlah}`;
        list.appendChild(li);
    });
}

let chart;
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
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
                            }
