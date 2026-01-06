document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const passwordPrompt = prompt("Ingrese la contraseña para acceder al simulador:");
    const correctPassword = "personal_adys2025";

    if (passwordPrompt !== correctPassword) {
        alert("Contraseña incorrecta. Acceso denegado.");
        container.style.display = 'none';
        document.body.innerHTML = '<h1 style="color: red; text-align: center;">Acceso denegado</h1>';
    } else {
        container.style.display = 'block';
    }
});

function calcularPension() {
    const cliente = document.getElementById('cliente').value;
    const años = parseInt(document.getElementById('años').value);
    const sueldo = parseFloat(document.getElementById('sueldo').value);

    if (!cliente || isNaN(años) || isNaN(sueldo) || años < 5 || años > 40) {
        alert('Por favor, ingrese un nombre y valores válidos (años entre 5 y 40).');
        return;
    }

    // Tabla de coeficientes original
    const coefficients = {
        5: 0.4375,
        6: 0.4500,
        7: 0.4625,
        8: 0.4750,
        9: 0.4875,
        10: 0.5000,
        11: 0.5125,
        12: 0.5250,
        13: 0.5375,
        14: 0.55,
        15: 0.5625,
        16: 0.5750,
        17: 0.5875,
        18: 0.6000,
        19: 0.6125,
        20: 0.6250,
        21: 0.6375,
        22: 0.65,
        23: 0.6625,
        24: 0.6750,
        25: 0.6875,
        26: 0.7000,
        27: 0.7125,
        28: 0.7250,
        29: 0.7375,
        30: 0.7500,
        31: 0.7625,
        32: 0.7750,
        33: 0.7875,
        34: 0.8000,
        35: 0.8125,
        36: 0.8325,
        37: 0.8605,
        38: 0.8970,
        39: 0.9430,
        40: 1.0000
    };

    // Tablas de pensiones mínimas y máximas
    const minPensions = {
        '0-10': { percentage: 0.50, amount: 235.00 },
        '11-20': { percentage: 0.60, amount: 282.00 },
        '21-30': { percentage: 0.70, amount: 329.00 },
        '31-35': { percentage: 0.80, amount: 376.00 },
        '36-39': { percentage: 0.90, amount: 423.00 },
        '40+': { percentage: 1.00, amount: 470.00 }
    };

    const maxPensions = {
        '0-10': { percentage: 2.50, amount: 1175.00 },
        '15-19': { percentage: 3.00, amount: 1410.00 },
        '20-24': { percentage: 3.50, amount: 1645.00 },
        '25-29': { percentage: 4.00, amount: 1880.00 },
        '30-34': { percentage: 4.50, amount: 2115.00 },
        '35-39': { percentage: 5.00, amount: 2350.00 },
        '40+': { percentage: 5.50, amount: 2585.00 }
    };

    // Determinar rango de años para mínimas y máximas
    let minRange = '';
    let maxRange = '';
    if (años <= 10) { minRange = '0-10'; maxRange = '0-10'; }
    else if (años <= 20) { minRange = '11-20'; maxRange = '15-19'; }
    else if (años <= 24) { minRange = '21-30'; maxRange = '20-24'; }
    else if (años <= 29) { minRange = '21-30'; maxRange = '25-29'; }
    else if (años <= 34) { minRange = '31-35'; maxRange = '30-34'; }
    else if (años <= 39) { minRange = '36-39'; maxRange = '35-39'; }
    else { minRange = '40+'; maxRange = '40+'; }

    const minPension = minPensions[minRange].amount;
    const maxPension = maxPensions[maxRange].amount;
    const coeficiente = coefficients[años];
    let subtotal = sueldo * coeficiente;
    let pension = subtotal;

    // Ajustar pension según mínimos y máximos
    if (pension < minPension) pension = minPension;
    if (pension > maxPension) pension = maxPension;

    // Formatear números con . para miles y , para centavos
    const formatNumber = (num) => {
        return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Cálculo del décimo tercero (basado en la renta aproximada a conceder)
    const decimoTerceroAcumulado = pension; // Suma total de pensiones / 12, igual a la renta constante
    const decimoTerceroMensual = pension / 12; // Mensualización
    // Cálculo del décimo cuarto (SBU 2025: $470)
    const decimoCuartoAcumulado = 482.00; // Pago único anual
    const decimoCuartoMensual = 482.00 / 12; // $39.17 mensual

    // Crear una nueva ventana para los resultados
    const printWindow = window.open('', '', 'height=700, width=900');
    printWindow.document.write(`
        <html>
        <head>
            <title>Resultados de Jubilación</title>
            <style>
                body { font-family: Arial, sans-serif; background: #FFFFFF; padding: 0; margin: 0; }
                .print-container { padding: 40px; max-width: 900px; margin: 0 auto; }
                .print-logo-container { display: flex; justify-content: space-between; margin-bottom: 30px; align-items: center; }
                .print-logo { height: auto; }
                .print-logo.iess { max-width: 180px; }
                .print-logo.adys { max-width: 220px; }
                .print-title { font-size: 32px; color: #333333; text-align: center; margin-bottom: 20px; font-weight: bold; }
                .print-message { font-size: 18px; color: #333333; text-align: center; margin-bottom: 30px; }
                .print-data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
                .print-data-card { background: #F5F5F5; padding: 15px; border-radius: 8px; text-align: left; }
                .print-data-card label { font-size: 14px; color: #333333; margin-bottom: 5px; }
                .print-data-card span { font-size: 16px; font-weight: bold; color: #F4A700; }
                .print-data-card.final-result { grid-column: span 2; background: #FFF3E0; }
                .print-button { display: block; margin: 0 auto; padding: 12px 30px; background: #F4A700; color: #FFFFFF; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; transition: background 0.3s ease; }
                .print-button:hover { background: #E09400; }
                @media print { .print-button { display: none; } }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="print-logo-container">
                    <img src="iess_logo.png" alt="IESS Logo" class="print-logo iess">
                    <img src="adys_logo.png" alt="ADYS Logo" class="print-logo adys">
                </div>
                <h1 class="print-title">Resultados de Jubilación</h1>
                <p class="print-message">Estimado/a ${cliente},</p>
                <p class="print-message">A continuación, se presenta el informe de su simulación de jubilación.</p>
                <div class="print-data-grid">
                    <div class="print-data-card"><label>Promedio Base:</label><span>${formatNumber(sueldo)}</span></div>
                    <div class="print-data-card"><label>Coefficiente Único:</label><span>${coeficiente.toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span></div>
                    <div class="print-data-card"><label>Subtotal Renta Aproximada:</label><span>${formatNumber(subtotal)}</span></div>
                    <div class="print-data-card final-result"><label>Renta Aproximada a Conceder:</label><span>${formatNumber(pension)}</span></div>
                    <div class="print-data-card"><label>Décimo Tercero Acumulado (Anual):</label><span>${formatNumber(decimoTerceroAcumulado)}</span></div>
                    <div class="print-data-card"><label>Décimo Tercero Mensual:</label><span>${formatNumber(decimoTerceroMensual)}</span></div>
                    <div class="print-data-card"><label>Décimo Cuarto Acumulado (Anual):</label><span>${formatNumber(decimoCuartoAcumulado)}</span></div>
                    <div class="print-data-card"><label>Décimo Cuarto Mensual:</label><span>${formatNumber(decimoCuartoMensual)}</span></div>
                </div>
                <button class="print-button" onclick="window.print()">Imprimir</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();

}
