
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { router, handleRoute } from '../src/router.js';


let app;
let home;
let pageB;
let notFoundPage;
let modules;


describe('router', () => {
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

  it('renders page B', () => {
    router(app, '/b', modules);

    expect(app.innerHTML).toBe(pageB.html);
    expect(pageB.onLoad).toHaveBeenCalled();
  });

  it('renders 404 page for unknown route', () => {
    router(app, '/unknown', modules);

    expect(app.innerHTML).toBe(notFoundPage.html);
  });

  it('calls cleanup on previous module if defined', () => {
    router(app, '/', modules);
    router(app, '/b', modules);

    expect(home.cleanup).toHaveBeenCalled();
    expect(pageB.onLoad).toHaveBeenCalled();
  });

  it('does not throw if previous module has no cleanup', () => {
    const noCleanupPage = { html: '<h1>No Cleanup</h1>', onLoad: vi.fn() };
    modules['/nocleanup'] = noCleanupPage;

    router(app, '/nocleanup', modules); 
    expect(() => router(app, '/', modules)).not.toThrow();

    expect(app.innerHTML).toBe(home.html);
  });

  it('does not call onLoad if not defined', () => {
    const noOnLoadPage = { html: '<h1>No onLoad</h1>', cleanup: vi.fn() };
    modules['/noonload'] = noOnLoadPage;

    expect(() => router(app, '/noonload', modules)).not.toThrow();

    expect(app.innerHTML).toBe(noOnLoadPage.html);
  });
});

describe('handleRoute', () => {
  let originalGetElementById;
  let originalLocation;
  let appObj;

  beforeEach(() => {
    // Save originals
    originalGetElementById = global.document.getElementById;
    originalLocation = global.window.location;

    // Mock getElementById to return appObj
    appObj = { innerHTML: '' };
    global.document.getElementById = vi.fn(() => appObj);

    // Mock location
    delete global.window.location;
    global.window.location = { hash: '' };
  });

  afterEach(() => {
    // Restore originals
    global.document.getElementById = originalGetElementById;
    global.window.location = originalLocation;
  });

  it('updates the app innerHTML for root hash', () => {
    window.location.hash = '';
    handleRoute();
    expect(global.document.getElementById).toHaveBeenCalledWith('app');
    // Side effect testing: appObj should have been updated
    expect(appObj.innerHTML).toMatch(/<h1/i);
  });
});
