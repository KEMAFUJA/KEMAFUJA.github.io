# KEMAFUJA.github.io

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR para Perfil Personal</title>
    <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
</head>
<body style="background-color: #002655; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; text-align: center; margin: 0;">
    <h1>Escanea el QR : NOTARIA N°135</h1>
    <canvas id="qr"></canvas>

    <script>
        var enlacePerfil = 'https://drive.google.com/file/d/1eEgqV4FaiYiCh9pkvJSTTEm22WT5wTGg/view?usp=drive_link';
        var qr = new QRious({
            element: document.getElementById('qr'),
            value: enlacePerfil,
            size: 300
        });
    </script>
</body>
</html>
