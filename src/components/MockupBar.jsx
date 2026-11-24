const VIEWS = [
  ['home', 'Home'],
  ['est', 'Establishments'],
  ['req', 'Export requirements'],
  ['journey', 'Assurance journey'],
  ['work', 'Internal workspace'],
  ['analysis', 'Requirements analysis'],
];

export default function MockupBar({ activeView, onNavigate }) {
  return (
    <div className="mock-bar">
      <span>
        <strong>Mockup, draft 1.</strong> Every company, number and certificate shown is sample data.
      </span>
      <div className="mock-tabs">
        {VIEWS.map(([id, label]) => (
          <button
            className={activeView === id ? 'on' : ''}
            data-go={id}
            key={id}
            onClick={() => {
              onNavigate(id);
              window.scrollTo(0, 0);
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
