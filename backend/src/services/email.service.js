import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to, resetLink) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "Recupera tu contraseña - VacunApp MX",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">Recupera tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en VacunApp.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block; padding:10px 20px; background:#1a73e8; color:#fff; text-decoration:none; border-radius:6px;">
            Restablecer contraseña
          </a>
        </p>
        <p>Este enlace expira en 30 minutos. Si tú no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Error al enviar correo: ${error.message}`);
  }

  return data;
}
