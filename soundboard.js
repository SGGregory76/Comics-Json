// soundboard.js
(function() {
  console.log('[soundboard.js] script loaded');

  // ←– YOUR Freesound token
  const FREESOUND_TOKEN = '1NYiCNWuT4vUBDQ0LbgGJa39CgeHlhpiZ8egzFaF';

  // ←– The terms you’re querying—and keys into PANEL_MAP
  const SEARCH_TERMS = ['cheer', 'boing', 'drum', 'laugh'];

  // ←– Map each term to either a single URL or an array of URLs
  const PANEL_MAP = {
    cheer: [
      'https://your-cdn.com/comics/cheer1.png',
      'https://your-cdn.com/comics/cheer2.png',
      'https://your-cdn.com/comics/cheer3.png'
    ],
    boing: [
      'https://your-cdn.com/comics/boing1.png',
      'https://your-cdn.com/comics/boing2.png'
    ],
    drum:   'https://your-cdn.com/comics/drum.png',      // single-panel example
    laugh: [
      'https://your-cdn.com/comics/laugh1.png',
      'https://your-cdn.com/comics/laugh2.png',
      'https://your-cdn.com/comics/laugh3.png',
      'https://your-cdn.com/comics/laugh4.png'
    ]
  };

  // Fetch a single clip for a given term
  async function fetchSounds(term) {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(term)}`
              + `&fields=id,name,previews&token=${FREESOUND_TOKEN}&page_size=1`;
    console.log(`[soundboard.js] fetching "${term}":`, url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[soundboard.js] API error for "${term}":`, res.status);
      return null;
    }
    const data = await res.json();
    if (!data.results.length) {
      console.warn(`[soundboard.js] no results for "${term}"`);
      return null;
    }
    const r = data.results[0];
    return {
      term,
      label:   r.name.replace(/_/g, ' ').replace(/\.wav|\.mp3/gi, ''),
      preview: r.previews['preview-hq-mp3']
    };
  }

  // Build the buttons on page load
  async function initSoundboard() {
    console.log('[soundboard.js] initSoundboard');
    const board = document.getElementById('soundboard');
    if (!board) return console.error('No #soundboard element');
    board.textContent = 'Loading sounds…';

    const results = await Promise.all(SEARCH_TERMS.map(fetchSounds));
    const clips   = results.filter(x => x);

    if (!clips.length) {
      board.textContent = '⚠️ No sounds found';
      return;
    }
    board.textContent = '';
    clips.forEach(({ term, label, preview }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.margin = '4px';
      btn.onclick = () => showPanel(term, preview);
      board.appendChild(btn);
    });
  }

  // Show the panel(s) for a given term + play the sound
  function showPanel(term, preview) {
    console.log('[soundboard.js] showPanel:', term);
    const grid = document.getElementById('grid-container');
    if (!grid) return console.error('No #grid-container element');
    grid.innerHTML = '';

    // Normalize PANEL_MAP entry to an array
    let urls = PANEL_MAP[term];
    if (!urls) return console.warn(`No PANEL_MAP entry for "${term}"`);
    if (!Array.isArray(urls)) urls = [urls];

    urls.forEach(src => {
      console.log('Loading image:', src);
      const img = document.createElement('img');
      img.src = src;
      img.alt = term;
      img.style.display = 'block';
      img.style.maxWidth = '100%';
      img.onerror = () => console.error('Failed to load', src);
      img.onload  = () => console.log('Loaded', src);
      grid.appendChild(img);
    });

    if (preview) {
      console.log('Playing sound preview:', preview);
      new Audio(preview).play();
    }
  }

  document.addEventListener('DOMContentLoaded', initSoundboard);
})();
