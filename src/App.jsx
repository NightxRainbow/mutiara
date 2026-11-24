import { useEffect, useRef, useState } from 'react';
import SiteChrome from './components/SiteChrome.jsx';
import MockupBar from './components/MockupBar.jsx';
import { VIEW_CONTENT, VIEWS } from './pages/content.js';
import { useMockupBehavior } from './hooks/useMockupBehavior.js';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const contentRef = useRef(null);

  useMockupBehavior(contentRef);

  useEffect(() => {
    document.body.dataset.mode = ['home', 'est', 'req', 'journey'].includes(activeView)
      ? 'public'
      : 'internal';
  }, [activeView]);

  return (
    <>
      <MockupBar activeView={activeView} onNavigate={setActiveView} />
      <SiteChrome activeView={activeView} onNavigate={setActiveView} />
      <main
        onClick={(event) => {
          const target = event.target.closest('[data-go]');
          if (target) {
            event.preventDefault();
            setActiveView(target.dataset.go);
            window.scrollTo(0, 0);
          } else if (event.target.closest('a[href="#"]')) {
            event.preventDefault();
          }
        }}
        ref={contentRef}
      >
        {VIEWS.map(({ id, title }) => (
          <section
            aria-label={title}
            className={`view${activeView === id ? ' on' : ''}`}
            id={`v-${id}`}
            key={id}
            hidden={activeView !== id}
          >
            <div dangerouslySetInnerHTML={{ __html: VIEW_CONTENT[id] }} />
          </section>
        ))}
      </main>
      <footer
        className="public-chrome foot"
        onClick={(event) => {
          const target = event.target.closest('[data-go]');
          if (!target) return;
          event.preventDefault();
          setActiveView(target.dataset.go);
          window.scrollTo(0, 0);
        }}
      >
        <div className="wrap">
          <p style={{ maxWidth: 'none' }}>
            <strong>
              Badan Pengendalian dan Pengawasan Mutu Hasil Kelautan dan Perikanan (BPPMHKP)
            </strong>
            , Ministry of Marine Affairs and Fisheries, Republic of Indonesia. Legal basis: Permen
            KP No. 8/2024.
          </p>
          <p style={{ maxWidth: 'none', margin: 0 }}>
            Statuses on this site come from the issuing unit&apos;s system and carry the time they
            were last updated. To report a suspected false certificate or an error in a listing,{' '}
            <a href="#" data-go="home">contact the authority</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
