// soundboard.js
(function() {
  const FREESOUND_TOKEN = '1NYiCNWuT4vUBDQ0LbgGJa39CgeHlhpiZ8egzFaF';
  const SEARCH_TERMS    = ['cheer','boing','drum','laugh'];
  const PANEL_URL       = 'https://blogger.googleusercontent.com/.../1000001539.png';

  async function fetchSounds(term) {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(term)}&fields=id,name,previews&token=${FREESOUND_TOKEN}&page_size=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (!data.results.length) return null;
    const r = data.results[0];
    return {
      label:   r.name.replace(/_/g,' ').replace(/\.wav|\.mp3/gi,''),
      preview: r.previews['preview-hq-mp3']
    };
  }

  async function initSoundboard() {
    const board = document.getElementById('soundboard');
    board.textContent = '';  
    const clips = (await Promise.all(SEARCH_TERMS.map(fetchSounds))).filter(x => x);
    if (!clips.length) {
      board.textContent = '⚠️ No sounds found';
      return;
    }
    clips.forEach(({ label, preview }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.onclick = () => showPanel(preview);
      board.appendChild(btn);
    });
  }

  function showPanel(preview) {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    const img = document.createElement('img');
    img.src = PANEL_URL;
    img.style.maxWidth = '100%';
    grid.appendChild(img);
    if (preview) new Audio(preview).play();
  }

  document.addEventListener('DOMContentLoaded', initSoundboard);
})();
