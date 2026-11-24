import { useState } from 'react';

const NAV_ITEMS = [
  ['home', 'Verify a certificate', 'Verifikasi sertifikat'],
  ['est', 'Find an establishment', 'Cari fasilitas'],
  ['req', 'Export requirements', 'Persyaratan ekspor'],
  ['journey', 'How seafood is controlled', 'Cara mutu dikendalikan'],
];

export default function SiteChrome({ activeView, onNavigate }) {
  const [language, setLanguage] = useState('en');

  function toggleLanguage() {
    const nextLanguage = language === 'en' ? 'id' : 'en';
    document.querySelectorAll('[data-id]').forEach((element) => {
      const textNode = element.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
      if (!element.dataset.en) element.dataset.en = textNode.nodeValue;
      textNode.nodeValue = nextLanguage === 'id'
        ? `${element.dataset.id} `
        : element.dataset.en;
    });
    document.documentElement.lang = nextLanguage;
    setLanguage(nextLanguage);
  }

  return (
    <div className="public-chrome">
      <div className="official">
        <div className="wrap">
          <span aria-hidden="true" className="flag" />
          <span data-id="Situs resmi Otoritas Kompeten hasil perikanan Republik Indonesia">
            Official website of the Competent Authority for fishery products, Republic of Indonesia
          </span>
          <button className="lang" onClick={toggleLanguage} type="button">
            {language === 'en' ? 'Bahasa Indonesia' : 'English'}
          </button>
        </div>
      </div>
      <header className="mast">
        <div className="wrap">
          <a className="brand" data-go="home" href="#">
            <span className="brand-main">Indonesia Seafood Assurance</span>
            <span className="brand-sub">MUTIARA, Otoritas Kompeten Perikanan Indonesia</span>
          </a>
          <nav aria-label="Main">
            {NAV_ITEMS.map(([id, label, translation]) => (
              <a
                className={activeView === id ? 'on' : ''}
                data-go={id}
                data-id={translation}
                href="#"
                key={id}
                onClick={() => {
                  onNavigate(id);
                  window.scrollTo(0, 0);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
