let keyHandler = null;

const html = `
  <h1>Keyboard Listener</h1>
  <p>Press any key and see the code below.</p>
  <pre id="keyOutput"></pre>
`;

let output = null;
keyHandler = (e) => {
  if (output) {
    output.textContent = `Key: ${e.key}, Code: ${e.code}`;
  }
};

const onLoad = () => {
  output = document.getElementById('keyOutput');
  window.addEventListener('keydown', keyHandler);
}

const cleanup = () => {
  window.removeEventListener('keydown', keyHandler);
}

export default { html, onLoad, cleanup };  