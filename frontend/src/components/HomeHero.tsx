import { Link } from 'react-router-dom'
import { eventConfig } from '../config/eventConfig'
import { wedding } from '../config/wedding'
import { HeroCountdown } from './HeroCountdown'
import { IconCamera, IconGallery, IconPin } from './Icons'

type Props = {
  onUpload: () => void
  onShare: () => void
}

export function HomeHero({ onUpload, onShare }: Props) {
  return (
    <section className="home-stage">
      <div className="hero-media">
        <img className="hero-media__blur" src={eventConfig.heroImage.src} alt="" aria-hidden decoding="async" />
        <img
          className="hero-media__image"
          src={eventConfig.heroImage.src}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="home-hero">
        <div className="home-hero__inner">
          <p className="home-hero__kicker">{wedding.invitationTitle}</p>
          <h1 className="home-hero__title">{wedding.childName}</h1>
          <p className="home-hero__text">{wedding.invitationMessage}</p>
          <time className="home-hero__date" dateTime={wedding.weddingDate}>
            {wedding.eventDateLabel}
          </time>

          <HeroCountdown />

          <div className="cta-row">
            <button className="btn btn--warm" type="button" onClick={onUpload}>
              <IconCamera className="btn-ico" size={18} />
              Fotoğraf Yükle
            </button>
            <Link className="btn btn--glass" to="/gallery">
              <IconGallery className="btn-ico" size={18} />
              Galeriyi Gör
            </Link>
          </div>

          <div className="home-venue">
            <p className="home-venue__name">{wedding.venueName}</p>
            <p className="home-venue__addr">{wedding.address}</p>
            <a className="btn btn--maps" href={wedding.googleMapsUrl} target="_blank" rel="noreferrer">
              <IconPin className="btn-ico" size={18} />
              Yol Tarifi
            </a>
          </div>

          <button className="btn btn--ghost-wide" type="button" onClick={onShare}>
            Davetiyeyi Paylaş
          </button>
        </div>
      </div>
    </section>
  )
}
