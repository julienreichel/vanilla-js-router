import homeModule from './routes/home.js';
import keyboardModule from './routes/keyboard.js';
import notFoundModule from './routes/notfound.js';

const modules = {
  '/': homeModule,
  '/keyboard': keyboardModule,
  '404': notFoundModule
};
let currentModule = null;

const renderPage = (app, html) => {
  app.innerHTML = html;
}


export function router(app, path, modules) {
  if (typeof currentModule?.cleanup === 'function') {
    currentModule.cleanup();
  }

  currentModule = modules[path] || modules['404'];
  
  renderPage(app, currentModule.html);
  
  if (typeof currentModule.onLoad === 'function') {
    currentModule.onLoad();
  }
}

export function handleRoute() {
  const app = document.getElementById('app');
  const path = location.hash.slice(1) || '/';
  console.log(`Navigating to: ${path}`);
  console.log(`app:`, app);
  router(app, path, modules);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('load', handleRoute);
  window.addEventListener('hashchange', handleRoute);
}