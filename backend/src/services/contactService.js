// contactService.js
// Service d'envoi d'email de contact via Resend

import { Resend } from 'resend'

export const sendContactEmail = async ({ nom, prenom, email, sujet, message }) => {
  // Le client Resend est créé ICI, seulement quand la fonction est appelée
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: 'Contact Sens Solidaire <onboarding@resend.dev>',
    to: 'gwenpichot@gmail.com',
    replyTo: email,
    subject: `[Contact] ${sujet}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom :</strong> ${prenom} ${nom}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${sujet}</p>
      <hr />
      <p>${message}</p>
    `,
  })

  if (error) throw new Error(error.message)
  return data
}