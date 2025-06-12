import homeModule from './routes/home.js';
import keyboardModule from './routes/keyboard.js';
import notFoundModule from './routes/notfound.js';


const app = document.getElementById('app');

const modules = {
  '/': homeModule,
  '/keyboard': keyboardModule,
  '404': notFoundModule
};
let currentModule = null;

const renderPage = (html) => {
  app.innerHTML = html;
}

const router = async () => {
  const path = location.hash.slice(1) || '/';

  if (typeof currentModule?.cleanup === 'function') {
    currentModule.cleanup();
  }

  currentModule = modules[path] || modules['404'];
  
  renderPage(currentModule.html);

  if (typeof currentModule.onLoad === 'function') {
    currentModule.onLoad();
  }
}

// Navigation events
window.addEventListener('load', router);
window.addEventListener('hashchange', router);