// soundboard.js
(function() {
  console.log('[soundboard.js] script loaded');

  // ←– REPLACE these with your own info:
  const FREESOUND_TOKEN    = 'YOUR_REAL_TOKEN';
  const FREESOUND_USERNAME = 'YOUR_FREESOUND_USERNAME';

  // Map each Freesound sound ID to an array of panel URLs
  // (fill in your own image URLs here)
  const PANEL_MAP = {
    // example:
    // 123456: ['https://…/cheer1.png','https://…/cheer2.png'],
    // 234567: ['https://…/boing1.png','https://…/boing2.png'],
  };

  /** 1. Fetch your own sounds from Freesound */
  async function fetchUserSounds(pageSize = 20) {
    const url = `https://freesound.org/apiv2/users/${FREESOUND_USERNAME}/sounds/`
              + `?fields=id,name,previews&token=${FREESOUND_TOKEN}`
              + `&page_size=${pageSize}`;
    console.log('[soundboard.js] fetching your sounds:', url);
    const res  = await fetch(url);
    if (!res.ok) {
      console.error('[soundboard.js] Freesound user-sounds error:', res.status);
      return [];
    }
    const data = await res.json();
    return data.results.map(r => ({
      id:      r.id,
      label:   r.name.replace(/_/g,' ').replace(/\.wav|\.mp3/gi,''),
      preview: r.previews['preview-hq-mp3']
    }));
  }

  /** 2. Build your soundboard from those sounds */
  async function initSoundboard() {
    console.log('[soundboard.js] initSoundboard');
    const board = document.getElementById('soundboard');
    if (!board) return console.error('No #soundboard element');
    board.textContent = 'Loading your sounds…';

    const clips = await fetchUserSounds(30);
    if (!clips.length) {
      board.textContent = '⚠️ No sounds found in your account.';
      return;
    }
    board.textContent = '';
    clips.forEach(({ id, label, preview }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.margin = '4px';
      btn.onclick = () => showPanel(id, preview);
      board.appendChild(btn);
    });
  }

  /** 3. On click, show the mapped panels and play the preview */
  function showPanel(id, preview) {
    console.log('[soundboard.js] showPanel:', id);
    const grid = document.getElementById('grid-container');
    if (!grid) return console.error('No #grid-container element');
    grid.innerHTML = '';

    // Look up your own PANEL_MAP by sound ID
    let urls = PANEL_MAP[id] || [];
    if (!Array.isArray(urls)) urls = [urls];
    if (!urls.length) {
      console.warn(`No panels defined for sound ID ${id}`);
      return;
    }

    urls.forEach(src => {
      console.log('Loading panel image:', src);
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Panel for ${id}`;
      img.style.display = 'block';
      img.style.maxWidth = '100%';
      img.onerror = () => console.error('Panel failed to load:', src);
      grid.appendChild(img);
    });

    if (preview) {
      console.log('Playing preview:', preview);
      new Audio(preview).play();
    }
  }

  document.addEventListener('DOMContentLoaded', initSoundboard);
})();
