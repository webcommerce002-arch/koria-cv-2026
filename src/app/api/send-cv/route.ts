import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, fullName, pdfBase64 } = await req.json();

    if (!email || !pdfBase64) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Configuration du transporteur SMTP (à configurer dans Vercel)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER, // Votre email de connexion (ex: koria.contact@gmail.com)
        pass: process.env.SMTP_PASS, // Votre mot de passe d'application
      },
    });

    const mailOptions = {
      from: `"Koria AI" <contact@koria.fr>`, // L'adresse de votre vitrine en expéditeur
      to: email,
      subject: `Votre CV Koria 2026 - ${fullName}`,
      text: `Bonjour ${fullName},\n\nVeuillez trouver ci-joint votre CV optimisé pour 2026 par Koria AI.\n\nBonne chance dans vos recherches !\n\nL'équipe Koria\ncontact@koria.fr`,
      attachments: [
        {
          filename: `CV_KORIA_${fullName.replace(/\s+/g, '_')}_2026.pdf`,
          content: pdfBase64.split(',')[1],
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur Mail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
