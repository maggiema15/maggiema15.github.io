import posterImage from '../assests/Name Poster.png'
import posterLightImage from '../assests/clean/light-on-top-tight.png'
import { contacts } from '../data/contacts'

export function PosterWall({ inert }: { inert: boolean }) {
  return (
    <section
      className="posterWall"
      aria-label="About poster and contact links"
      inert={inert}
    >
      <div className="namePosterDisplay">
        <div className="posterLight" aria-hidden="true">
          <img src={posterLightImage} alt="" />
        </div>
        <div className="framedPoster namePosterFrame">
          <img
            className="poster namePoster"
            src={posterImage}
            alt="Maggie Ma, computer engineering student at the University of Toronto"
          />
        </div>
      </div>
      <nav className="contactVinyls" aria-label="Contact links">
        {contacts.map((contact) => {
          const artwork = (
            <>
              <img className="contactVinylImage" src={contact.image} alt="" />
              <img className="contactVinylLogo" src={contact.logo} alt="" />
            </>
          )

          return contact.href ? (
            <a
              key={contact.id}
              className="contactVinyl"
              href={contact.href}
              target={contact.external ? '_blank' : undefined}
              rel={contact.external ? 'noreferrer' : undefined}
              aria-label={contact.label}
            >
              {artwork}
            </a>
          ) : (
            <span
              key={contact.id}
              className="contactVinyl"
              role="link"
              aria-disabled="true"
              aria-label={`${contact.label}: ${contact.unavailable}`}
              title={`${contact.label}: ${contact.unavailable}`}
            >
              {artwork}
            </span>
          )
        })}
      </nav>
    </section>
  )
}
