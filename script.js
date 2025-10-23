document.addEventListener('DOMContentLoaded', () => {
    
    const totalTransaksiEl = document.getElementById('total-transaksi');
    const totalNilaiEl = document.getElementById('total-nilai');
    const rataRataTransaksiEl = document.getElementById('rata-rata-transaksi');
    const qrisImageUpload = document.getElementById('qrisImageUpload');
    const qrCanvasReader = document.getElementById('qrCanvasReader');
    const qrCanvasReaderCtx = qrCanvasReader.getContext('2d');
    const qrisCodeInput = document.getElementById('qrisCodeInput');
    const nominalInput = document.getElementById('nominalInput');
    const generateQrisBtn = document.getElementById('generateQrisBtn');
    const generatedQrCodeDiv = document.getElementById('generatedQrCode');
    const downloadQrBtn = document.getElementById('downloadQrBtn');
    const transactionChartCanvas = document.getElementById('transactionChart').getContext('2d');
    const transactionTableBody = document.getElementById('transactionTableBody');

    let transactions = [];
    let qrCodeInstance = null;
    let transactionChart = null;
    
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                qrCanvasReader.width = img.width;
                qrCanvasReader.height = img.height;
                qrCanvasReaderCtx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = qrCanvasReaderCtx.getImageData(0, 0, img.width, img.height);
                
                try {
                    if (typeof jsQR === 'undefined') {
                        alert("ERROR: Library jsqr.min.js tidak ditemukan. Pastikan file ada di folder yang sama.");
                        return;
                    }
                    
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        qrisCodeInput.value = code.data;
                    } else {
                        alert("Tidak dapat membaca QR code dari gambar. Pastikan gambar jelas.");
                    }
                } catch (err) {
                    alert("Terjadi error saat memindai QR.");
                    console.error(err);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };
    
    const buildQrisString = (baseString, nominal) => {
        let tags = {};
        let i = 0;
        let finalString = "";
        
        try {
            while (i < baseString.length) {
                const tag = baseString.substring(i, i + 2);
                i += 2;
                if (i + 2 > baseString.length) break;
                const length = parseInt(baseString.substring(i, i + 2), 10);
                i += 2;
                if (i + length > baseString.length) break;
                const value = baseString.substring(i, i + length);
                i += length;
                if (tag !== '54' && tag !== '62' && tag !== '63') {
                    tags[tag] = value;
                }
            }
        } catch(e) {
            console.error("Gagal mem-parsing base string", e);
            return baseString;
        }

        const orderedTags = ["00", "01", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "58", "59", "60", "61"];
        
        orderedTags.forEach(tag => {
            if (tags[tag]) {
                finalString += tag + String(tags[tag].length).padStart(2, '0') + tags[tag];
            }
        });

        const amountString = nominal.toFixed(2);
        finalString += '54' + String(amountString.length).padStart(2, '0') + amountString;
        
        finalString += '6304';
        const crc = computeCRC(finalString);
        finalString += crc;
        
        return finalString;
    };

    const computeCRC = (data) => {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= (data.charCodeAt(i) & 0xFF) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) > 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };

    const handleGenerate = () => {
        const baseQris = qrisCodeInput.value;
        
        const nominalString = nominalInput.value;
        const cleanNominal = nominalString.replace(/\./g, '');
        const nominal = parseFloat(cleanNominal);

        if (!baseQris) {
            alert("Kode QRIS tidak boleh kosong. Silakan upload gambar QRIS statis Anda.");
            return;
        }
        if (isNaN(nominal) || nominal <= 0) {
            alert("Masukkan nominal pembayaran yang valid.");
            return;
        }

        const qrisString = buildQrisString(baseQris, nominal);

        generatedQrCodeDiv.innerHTML = '';
        generatedQrCodeDiv.classList.remove('qr-placeholder');
        qrCodeInstance = new QRCode(generatedQrCodeDiv, {
            text: qrisString,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        const newTransaction = {
            id: Date.now(),
            tanggal: new Date().toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour24: true
            }),
            nominal: nominal,
        };

        transactions.push(newTransaction);
        saveData();
        updateUI();
    };

    const updateUI = () => {
        updateSummary();
        updateTable();
        updateChart();
    };

    const updateSummary = () => {
        const totalCount = transactions.length;
        const totalValue = transactions.reduce((sum, tx) => sum + tx.nominal, 0);
        const avgValue = totalCount > 0 ? totalValue / totalCount : 0;

        totalTransaksiEl.textContent = totalCount;
        totalNilaiEl.textContent = formatRupiah(totalValue);
        rataRataTransaksiEl.textContent = formatRupiah(avgValue);
    };

    const updateTable = () => {
        transactionTableBody.innerHTML = '';
        if (transactions.length === 0) {
            transactionTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Belum ada transaksi</td></tr>';
            return;
        }
        
        const reversedTransactions = [...transactions].reverse();

        reversedTransactions.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Tanggal">${tx.tanggal}</td>
                <td data-label="Nominal">${formatRupiah(tx.nominal)}</td>
                <td data-label="Aksi">
                    <button class="btn-delete" data-id="${tx.id}">Hapus</button>
                </td>
            `;
            transactionTableBody.appendChild(row);
        });
    };

    const initChart = () => {
        transactionChart = new Chart(transactionChartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Nominal Transaksi',
                    data: [],
                    borderColor: 'rgba(217, 4, 41, 1)',
                    backgroundColor: 'rgba(217, 4, 41, 0.1)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => formatRupiah(value)
                        }
                    }
                }
            }
        });
    };

    const updateChart = () => {
        const labels = transactions.map(tx => new Date(tx.id).toLocaleTimeString('id-ID'));
        const data = transactions.map(tx => tx.nominal);
        
        transactionChart.data.labels = labels;
        transactionChart.data.datasets[0].data = data;
        transactionChart.update();
    };

    const handleDownload = () => {
        const originalCanvas = generatedQrCodeDiv.querySelector('canvas');
        
        if (originalCanvas) {
            const border = 10;
            const newCanvas = document.createElement('canvas');
            
            const newSize = originalCanvas.width + (border * 2);
            newCanvas.width = newSize;
            newCanvas.height = newSize;

            const ctx = newCanvas.getContext('2d');
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, newSize, newSize);
            
            ctx.drawImage(originalCanvas, border, border);
            
            const cleanNominal = nominalInput.value.replace(/\./g, '');
            const link = document.createElement('a');
            link.download = `QRIS_${cleanNominal || 'qrcode'}.png`;
            
            link.href = newCanvas.toDataURL('image/png');
            link.click();
        } else {
            alert("Silakan generate QR code terlebih dahulu.");
        }
    };

    transactionTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const id = parseInt(e.target.dataset.id);
            if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
                transactions = transactions.filter(tx => tx.id !== id);
                saveData();
                updateUI();
            }
        }
    });

    const saveData = () => {
        localStorage.setItem('qrisHubTransactions', JSON.stringify(transactions));
    };

    const loadData = () => {
        const data = localStorage.getItem('qrisHubTransactions');
        if (data) {
            transactions = JSON.parse(data);
        }
        updateUI();
    };

    nominalInput.addEventListener('input', (e) => {
        let value = e.target.value;
        let cleanValue = value.replace(/\./g, '');
        
        if (isNaN(cleanValue) || cleanValue === '') {
            e.target.value = '';
            return;
        }

        let numValue = parseInt(cleanValue, 10);
        let formattedValue = new Intl.NumberFormat('id-ID').format(numValue);
        
        e.target.value = formattedValue;
    });

    qrisImageUpload.addEventListener('change', handleImageUpload);
    generateQrisBtn.addEventListener('click', handleGenerate);
    downloadQrBtn.addEventListener('click', handleDownload);
    
    initChart();
    loadData();
});



