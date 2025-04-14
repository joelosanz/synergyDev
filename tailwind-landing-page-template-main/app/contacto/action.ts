'use server';

import nodemailer from 'nodemailer';

export async function submitContactForm(prevState: any, formData: FormData) {
  // Extraer datos del formulario
  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const message = formData.get('message')?.toString() || '';

  // Validación básica
  if (!name || !email || !message) {
    return { error: 'Todos los campos son requeridos' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Formulario de Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Error al enviar el mensaje' };
  }
}