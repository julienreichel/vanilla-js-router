
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { router, handleRoute } from '../src/router.js';

describe('router', () => {
  let app, home, pageB, notFoundPage, modules;
  beforeEach(() => {
    // Use a plain object with innerHTML property for app
    app = { innerHTML: '' };

    // Create fresh mocks for each test
    home = { html: '<h1>Home</h1>', onLoad: vi.fn(), cleanup: vi.fn() };
    pageB = { html: '<h1>Page B</h1>', onLoad: vi.fn(), cleanup: vi.fn() };
    notFoundPage = { html: '<h1>404</h1><p>Page not found.</p>' };
    modules = {
      '/': home,
      '/b': pageB,
      '404': notFoundPage,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders home page', () => {
    router(app, '/', modules);

    expect(app.innerHTML).toBe(home.html);
    expect(home.onLoad).toHaveBeenCalled();
  });

  it('renders 404 page for unknown route', () => {
    router(app, '/unknown', modules);

    expect(app.innerHTML).toBe(notFoundPage.html);
  });

  it('calls the onLoad function', () => {
    const onLoad = vi.fn();
    modules['/b'] = { html: '<h1>Page B</h1>', onLoad };

    router(app, '/b', modules);

    expect(app.innerHTML).toBe(modules['/b'].html);
    expect(onLoad).toHaveBeenCalled();
    });


    it('calls the cleanup function on previous module', () => {
    const cleanup = vi.fn();
    modules['/b'] = { html: '<h1>Page B</h1>', cleanup };

    router(app, '/b', modules);
    router(app, '/', modules);

    expect(cleanup).toHaveBeenCalled();
  });
});

describe('handleRoute', () => {
  let originalGetElementById;
  let originalLocation;
  let appObj;

  beforeEach(() => {
    document.body.innerHTML = "<div id='app'></div>";
  });

  it('updates the app innerHTML for root hash', () => {
    window.location.hash = '';
    
    handleRoute();
    // remove event listeners to avoid crash when leaving the tests
    window.removeEventListener('load', handleRoute);
    window.removeEventListener('hashchange', handleRoute);

    expect(document.body.innerHTML).toMatchInlineSnapshot(`
      "<div id="app">
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
      </div>"
    `);
  });
});
