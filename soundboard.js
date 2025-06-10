// soundboard.js
(function() {
  console.log('[soundboard.js] script loaded');

  // ←– REPLACE this with your actual Freesound OAuth2 token (in quotes)
  const FREESOUND_TOKEN = '1NYiCNWuT4vUBDQ0LbgGJa39CgeHlhpiZ8egzFaF';
  const SEARCH_TERMS    = ['cheer', 'boing', 'drum', 'laugh'];

  // ←– Your exact Blogger-hosted PNG URL
  const PANEL_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0ZqlwoqCTIPjAvfP60dY9N_h-e9lWCd3VD18ahzNsxp9KQ-R1MpYMVrTT05kA6fTNagU2VmCfAMOZmk9NBEZWhZJ-yhpUotibh6Z5VIouMN2xuQUjFsHKd45vERgDztTFflPsQBek1GuRD728CpGM6E-kHEFQ498eAsABkMHRgE5O_Z7mb3I2fd9uQqw/s1024/1000001539.png';

  // Fetch one clip per search term
  async function fetchSounds(term) {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(term)}&fields=id,name,previews&token=${FREESOUND_TOKEN}&page_size=1`;
    console.log(`[soundboard.js] fetching sound for "${term}":`, url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[soundboard.js] Freesound API error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    if (!data.results.length) {
      console.warn(`[soundboard.js] no results for "${term}"`);
      return null;
    }
    const r = data.results[0];
    return {
      label:   r.name.replace(/_/g, ' ').replace(/\.wav|\.mp3/gi, ''),
      preview: r.previews['preview-hq-mp3']
    };
  }

  // Build the buttons
  async function initSoundboard() {
    console.log('[soundboard.js] initSoundboard');
    const board = document.getElementById('soundboard');
    if (!board) {
      console.error('[soundboard.js] No element with id="soundboard"');
      return;
    }
    board.textContent = 'Loading sounds…';
    const clips = (await Promise.all(SEARCH_TERMS.map(fetchSounds))).filter(x => x);
    if (!clips.length) {
      board.textContent = '⚠️ No sounds found';
      return;
    }
    board.textContent = '';
    clips.forEach(({ label, preview }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.margin = '4px';
      btn.onclick = () => showPanel(preview);
      board.appendChild(btn);
    });
  }

  // Display the panel + play the sound
  function showPanel(preview) {
    console.log('[soundboard.js] showPanel');
    const grid = document.getElementById('grid-container');
    if (!grid) {
      console.error('[soundboard.js] No element with id="grid-container"');
      return;
    }
    grid.innerHTML = '';

    const img = document.createElement('img');
    img.src = PANEL_URL;
    img.alt = 'Comic panel';
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.onerror = () => console.error('[soundboard.js] failed to load panel image:', PANEL_URL);
    img.onload  = () => console.log('[soundboard.js] panel image loaded');
    grid.appendChild(img);

    if (preview) {
      console.log('[soundboard.js] playing preview:', preview);
      new Audio(preview).play();
    }
  }

  document.addEventListener('DOMContentLoaded', initSoundboard);
})();
