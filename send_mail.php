<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // ✅ Configurare SMTP cu o adresă NO-REPLY fixă
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; 
    $mail->SMTPAuth = true;
    $mail->Username = 'sauciucis112@gmail.com'; 
    $mail->Password = 'd v t e h o r x i k v y o s v v';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // ✅ Expeditorul este „No-Reply” (clientul NU trebuie să aibă configurări speciale)
    $mail->setFrom('no-reply@domeniul-tau.ro', 'Firma Ta');

    // ✅ „Reply-To” este adresa clientului, astfel încât să poți răspunde
    $mail->addReplyTo($_POST["email"], $_POST["nume"] . " " . $_POST["prenume"]);

    // ✅ Destinatarul este adresa firmei (unde vrei să primești emailul)
    $mail->addAddress("ssauciuci@gmail.com");

    // ✅ Subiect și mesaj
    $mail->Subject = $_POST["subiect"];
    $mail->isHTML(true);
    $mail->Body = "
        <h2>Mesaj de pe site</h2>
        <p><strong>Nume:</strong> {$_POST['nume']}</p>
        <p><strong>Prenume:</strong> {$_POST['prenume']}</p>
        <p><strong>Email:</strong> {$_POST['email']}</p>
        <p><strong>Telefon:</strong> {$_POST['telefon']}</p>
        <p><strong>Subiect:</strong> {$_POST['subiect']}</p>
        <p><strong>Mesaj:</strong><br>{$_POST['mesaj']}</p>
    ";

    // ✅ Trimite email-ul
    $mail->send();

    echo "<script>alert('Mesaj trimis cu succes!'); window.location.href='index.html';</script>";
} catch (Exception $e) {
    echo "Eroare la trimiterea emailului: {$mail->ErrorInfo}";
}
?>
