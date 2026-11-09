// contactService.js
// Envoie l'e-mail du formulaire de contact via Resend.
//
// RGPD : les messages de contact ne sont PAS enregistrés en base — ils sont
// seulement transmis par Resend sous forme d'e-mail. L'application n'a donc
// ni durée de conservation à définir, ni procédure d'effacement à prévoir
// pour ces données : rien à supprimer, puisque rien n'est stocké.

import { Resend } from 'resend'

// Échappe les cinq caractères sensibles en HTML. L'ordre compte :
// '&' doit être remplacé en premier, sinon il ré-échapperait les entités
// que l'on vient de produire pour les autres caractères.
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

  // Les cinq champs sont saisis par le visiteur et finissent dans le HTML de l'e-mail :
  // on les échappe avant de les insérer, pour qu'un visiteur ne puisse pas glisser
  // un lien d'hameçonnage dans un e-mail qui semble venir de l'association.
  const safeNom = escapeHtml(nom)
  const safePrenom = escapeHtml(prenom)
  const safeEmail = escapeHtml(email)
  const safeSujet = escapeHtml(sujet)
  // Les retours à la ligne deviennent des <br /> APRÈS l'échappement : un "<br>"
  // tapé par le visiteur reste du texte inoffensif, au lieu de devenir un vrai
  // retour à la ligne (ou pire, une vraie balise si l'on échappait après).
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  const { data, error } = await resend.emails.send({
    from: 'Contact Sens Solidaires <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL_TO || 'gwenpichot@gmail.com',
    // replyTo garde volontairement la valeur BRUTE (non échappée) — contre-intuitif
    // puisque tout le reste est échappé, mais c'est un champ d'EN-TÊTE d'e-mail,
    // lu par la messagerie du destinataire, pas du HTML. L'échapper abîmerait
    // une adresse valide (ex. "'" transformé en "&#39;") et casserait le bouton
    // « Répondre », sans aucun gain de sécurité.
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
