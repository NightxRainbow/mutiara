# MUTIARA Seafood Assurance mockup

This project is the React/Vite version of the original single-file MUTIARA mockup. It keeps the six existing views and the working sample interactions, while separating the application shell, page content, behavior, and styles so they can be located and edited more easily.

> **Important:** This is a mockup. Company names, certificate numbers, status dates, statistics, market requirements, and workspace records are sample or illustrative data. Do not treat them as official records or regulatory advice.

## Requirements

- Node.js 18 or newer
- npm (included with Node.js)

## Start the app

Open a terminal in the project folder and run:

```sh
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`). Open that URL in a browser. Keep the terminal running while you use the development server.

To create and preview a production build:

```sh
npm run build
npm run preview
```

The production files are written to `dist/`. `npm run preview` serves that build locally; it is not itself a production hosting service.

## Project layout

```text
.
├── index.html                   # Vite HTML entry point
├── package-lock.json            # Reproducible dependency versions
├── package.json                 # Scripts and app dependencies
├── .gitignore                   # Generated files and installed dependencies
├── vite.config.js               # React JSX transform plugin
├── README.md                    # Setup and editing guide
└── src/
    ├── App.jsx                  # React app shell, view switching, footer
    ├── main.jsx                 # React entry point and global stylesheet import
    ├── styles.css               # All shared and responsive styles
    ├── components/
    │   ├── MockupBar.jsx        # Mockup navigation tabs
    │   └── SiteChrome.jsx       # Public header, navigation, language toggle
    ├── content/
    │   ├── home.html            # Home view content
    │   ├── est.html             # Establishments view content
    │   ├── req.html             # Export requirements view content
    │   ├── journey.html         # Assurance journey view content
    │   ├── work.html            # Internal workspace view content
    │   └── analysis.html        # Requirements analysis view content
    ├── hooks/
    │   └── useMockupBehavior.js # Sample records, status rules, and interactions
    └── pages/
        └── content.js           # View metadata and content imports
```

The original `mutiara-mockup.html` is left in the folder as a reference copy. The React app starts from `index.html`; edit files under `src/` for the running app.

## How the app is organized

### React shell and navigation

`src/main.jsx` mounts the React application and imports the global stylesheet. `src/App.jsx` owns the current view and chooses which content fragment is visible. The mockup navigation and public header are React components in `src/components/`.

The six pages are listed in `src/pages/content.js`. Each view's existing long-form page markup lives in its own file under `src/content/`. Vite imports those trusted, local HTML fragments as text; React places them in the matching view. Keeping the narrative page content in separate fragments avoids a very large JSX component while letting the existing content be edited without touching the application logic.

The content fragments are static UI content, not a way to load user-provided HTML. Do not put untrusted or externally supplied HTML into these files or into `dangerouslySetInnerHTML`.

### Styles

All page styles are in `src/styles.css`, including the color variables, shared controls, view-specific layouts, and mobile breakpoints. The file is imported once from `src/main.jsx`.

Useful starting points:

- Colors and font choices: the `:root` custom properties at the top.
- Shared layout and controls: `.wrap`, `.btn`, `.band`, `.panel`, and `.reg`.
- Page-specific styles: sections labelled by comments, such as `/* home */`, `/* journey */`, and `/* workspace */`.
- Responsive rules: the `@media` blocks at the end of the file.

Prefer adding a class to a content fragment and styling it in `styles.css` over adding new inline styles.

### Sample data and interactions

The `useMockupBehavior` hook in `src/hooks/useMockupBehavior.js` initializes the interactive areas after the page fragments are mounted. It contains:

- The sample establishment/certificate register and certificate status calculation.
- Certificate verification by number and sample-number buttons.
- Search, destination/status filtering, and establishment profile display.
- Destination/product requirement selection.
- The sample CAPA register and its due-date-derived status.

All records are local sample data. The app does not connect to a live registry, API, database, authentication provider, or email service. The fixed date text shown in the static mockup is illustrative, while calculated validity and CAPA states use the viewer's current local date.

`SiteChrome.jsx` implements the language button as a simple text swap for elements with a `data-id` attribute. This is a demo behavior, not a complete localization system: translations should be reviewed and moved to managed translation resources before launch.

## Common editing tasks

### Change text on a page

Edit the relevant file in `src/content/`. For example, update the welcome text in `src/content/home.html` or the requirements discussion in `src/content/analysis.html`. The files contain HTML fragments, so keep tags balanced and use the existing CSS classes where possible.

### Change sample records or business rules

Edit `ESTABLISHMENTS`, `REQUIREMENTS`, `PRODUCTS`, or `CAPA_ITEMS` in `src/hooks/useMockupBehavior.js`. The `getStatus` function determines establishment status: a record is expired after its end date, expiring when 60 or fewer days remain, and otherwise valid. A manually flagged record (such as the suspended example) takes precedence.

### Add a page

1. Add a content fragment such as `src/content/about.html`.
2. Import it in `src/pages/content.js`.
3. Add its entry to `VIEWS` and `VIEW_CONTENT` there.
4. Add a navigation entry in `src/components/MockupBar.jsx`, and add it to the public navigation in `src/components/SiteChrome.jsx` if appropriate.
5. If it is a public page, include its id in the public-view list in `src/App.jsx` so the right public chrome is displayed.
6. Add styles to `src/styles.css` if needed.

### Add or change behavior

Keep behavior that spans page fragments in `src/hooks/useMockupBehavior.js`. Scope queries to the `contentRef` passed by `App.jsx`, and add event listeners with matching cleanup in the effect. For new UI that requires more state or frequent updates, prefer a dedicated React page/component with controlled props and state rather than growing the DOM-manipulation hook.

## Notes before production use

- Replace all sample data and fixed sample dates with approved, verified data sources.
- Confirm every market requirement against the relevant authority's current publication.
- Add error, loading, and unavailable-source states when connecting APIs.
- Implement real routing, server-side data validation, access controls, and authentication before using this for internal operations.
- Review accessibility, privacy, security, and Indonesian/English translations before publication.
- The public and internal workspace views share one frontend in this mockup; the analysis content itself recommends separating them in a real system.
