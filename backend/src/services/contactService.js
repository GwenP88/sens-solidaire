// contactService.js
// Sends the contact-form email via Resend.
//
// GDPR note: contact messages are NOT persisted in our database — they are
// only forwarded through Resend as an outgoing email. This means the app
// has no retention duration to define and no erasure procedure to build for
// this data: nothing here to delete, because nothing here is stored.

import { Resend } from 'resend'

// Escapes the five characters that matter in an HTML context. Order matters:
// '&' must be replaced first, otherwise it would re-escape the entities we
// just produced for the other characters.
const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const sendContactEmail = async ({ nom, prenom, email, sujet, message }) => {
  // Le client Resend est créé ICI, seulement quand la fonction est appelée
  const resend = new Resend(process.env.RESEND_API_KEY)

  // All five fields are visitor-controlled and end up in the HTML body —
  // escape them before interpolation so a visitor can't inject a phishing
  // link into an email that looks like it comes from the association.
  const safeNom = escapeHtml(nom)
  const safePrenom = escapeHtml(prenom)
  const safeEmail = escapeHtml(email)
  const safeSujet = escapeHtml(sujet)
  // Newlines are converted to <br /> AFTER escaping, so a literal "<br>"
  // typed by the visitor stays inert escaped text instead of becoming a
  // real line break (or worse, a real tag if we escaped afterwards).
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  const { data, error } = await resend.emails.send({
    from: 'Contact Sens Solidaires <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL_TO || 'gwenpichot@gmail.com',
    // replyTo keeps the RAW (unescaped) value on purpose — counter-intuitive
    // given everything else here is escaped, but this is an email HEADER
    // field parsed by the recipient's mail client, not an HTML context.
    // HTML-escaping it would corrupt a legitimate address (e.g. turn a
    // "'" into "&#39;") and break "Reply" for no security benefit.
    replyTo: email,
    subject: `[Contact] ${safeSujet}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom :</strong> ${safePrenom} ${safeNom}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Sujet :</strong> ${safeSujet}</p>
      <hr />
      <p>${safeMessage}</p>
    `,
  })

  if (error) throw new Error(error.message)
  return data
}
