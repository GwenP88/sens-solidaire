// FooterContact.jsx
// Bloc adresses + email — colonne "Nous contacter", répétée sur les 3 versions du Footer

import { IconPin, IconMail } from '../../utils/icons'
import { CONTACTS } from '../../utils/footerData'

function FooterContact() {
  return (
    <div className="flex flex-col gap-sm">
      <h3 className="text-label text-surface mb-6">Nous contacter</h3>
      {CONTACTS.map(contact => (
        <div key={contact.href} className="flex gap-sm">
          {contact.type === 'address' ? (
            <>
              <IconPin className="text-surface text-lg mt-1 shrink-0" />
              <a href={contact.href} target="_blank" rel="noopener noreferrer" className="link-inline text-surface/70 hover:text-surface">
                {contact.label}<br />{contact.detail}
              </a>
            </>
          ) : (
            <>
              <IconMail className="text-surface text-lg mt-1 shrink-0" />
              <a href={contact.href} className="link-inline text-surface/70 hover:text-surface">
                {contact.label}
              </a>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default FooterContact