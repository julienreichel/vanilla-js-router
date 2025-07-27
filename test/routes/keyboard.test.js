import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import keyboard from '../../src/routes/keyboard.js';

// Helper to mock DOM
function setupDOM() {
  document.body.innerHTML = keyboard.html;
}

describe('keyboard module', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    // Clean up any listeners
    if (keyboard.cleanup) keyboard.cleanup();
  });

  it('renders correct HTML', () => {
    setupDOM();

    expect(document.body.innerHTML).toContain('<h1>Keyboard Listener</h1>');
    expect(document.getElementById('keyOutput')).not.toBeNull();
  });

  it('onLoad adds keydown event listener', () => {
    keyboard.onLoad();
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('keydown event updates output', () => {
    setupDOM();
    const output = document.getElementById('keyOutput');

    keyboard.onLoad();
    const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    window.dispatchEvent(event);

    expect(output.textContent).toBe('Key: a, Code: KeyA');
  });

  it('cleanup removes keydown event listener', () => {
    keyboard.onLoad();
    
    keyboard.cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('cleanup does not throw if called before onLoad', () => {
    expect(() => keyboard.cleanup()).not.toThrow();
  });
});
