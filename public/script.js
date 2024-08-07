// Sayfa yüklendiğinde veri çekme
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/sonuclar')
        .then(response => response.json())
        .then(data => {
            // Gelen JSON verisini JS nesnesine çevirme
            const tablo1 = data.tablo1;
            const tablo2 = data.tablo2;
            const info = data.info;

            document.querySelector("#sekme").innerHTML = info.sekme
            document.querySelector("#program").innerHTML = info.program
            document.querySelector("#baslik").innerHTML = info.baslik
            document.querySelector("#tesis").innerHTML = info.tesis

            // Chart.js kullanarak grafiği oluşturma
            const ctx = document.getElementById('chart1').getContext('2d');
            const ctx2 = document.getElementById('chart2').getContext('2d');

            const myChart = new Chart(ctx, {
                type: 'line', // Grafik tipi (line, bar, pie, etc.)
                data: {
                    datasets: [{
                        label: 'Veri Seti',
                        data: tablo1, // Y ekseni verileri
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Grafik arka plan rengi
                        borderColor: 'rgba(75, 192, 192, 1)', // Grafik kenar rengi
                        borderWidth: 2 // Kenar kalınlığı
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const myChart2 = new Chart(ctx2, {
                type: 'line', // Grafik tipi (line, bar, pie, etc.)
                data: {
                    datasets: [{
                        label: '% Verim',
                        data: tablo2, // Y ekseni verileri
                        backgroundColor: 'rgba(74, 0, 117,0.2)', // Grafik arka plan rengi
                        borderColor: 'rgba(74, 0, 117,1)', // Grafik kenar rengi
                        borderWidth: 2 // Kenar kalınlığı
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});