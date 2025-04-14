import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello, Next.js!" });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail", // Puedes cambiarlo por otro servicio SMTP
      auth: {
        user: process.env.EMAIL_USER, // 📌 Usa variables de entorno
        pass: process.env.EMAIL_PASS, // 📌 Usa una contraseña segura o App Password
      },
    });

    // Configurar el correo
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO, // 📌 Reemplázalo con tu correo destino
      subject: "Nuevo mensaje de contacto",
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    });

    return NextResponse.json({ message: "Correo enviado con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ error: "Error al enviar correo" }, { status: 500 });
  }
}
