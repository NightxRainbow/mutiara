import home from '../content/home.html?raw';
import establishments from '../content/est.html?raw';
import requirements from '../content/req.html?raw';
import journey from '../content/journey.html?raw';
import workspace from '../content/work.html?raw';
import analysis from '../content/analysis.html?raw';

export const VIEWS = [
  { id: 'home', title: 'Home' },
  { id: 'est', title: 'Approved establishments' },
  { id: 'req', title: 'Export market requirements' },
  { id: 'journey', title: 'Assurance journey' },
  { id: 'work', title: 'Internal workspace' },
  { id: 'analysis', title: 'Requirements analysis' },
];

export const VIEW_CONTENT = {
  home,
  est: establishments,
  req: requirements,
  journey,
  work: workspace,
  analysis,
};
