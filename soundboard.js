// soundboard.js
(function() {
  const FREESOUND_TOKEN = '1NYiCNWuT4vUBDQ0LbgGJa39CgeHlhpiZ8egzFaF';
  const SEARCH_TERMS    = ['cheer','boing','drum','laugh'];

  // Map each term to an array of panel URLs
  const PANEL_MAP = {
    cheer: [
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmeYJ-WCNEBfgI1_QY0N0YtPtzsCzl3ud0nvZbX4cj31hz9XOQwSOPQwLfdcidlOCKFKr4zzeFJfVaJwADdsnTOkhb7pTwSzgFlBrKPpAteZxng8EThgNcdcWT9KlLaOdCYELPZQe46-yq2_eweTYZoB5rwUP2NolEc0YDZM-Sstmk1WODzX-dybwT3hQW/s1536/1000001060.png',
      'https://blogger.googleusercontent.com/img/b/.../cheer2.png',
      'https://blogger.googleusercontent.com/img/b/.../cheer3.png'
    ],
    boing: [
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0ZqlwoqCTIPjAvfP60dY9N_h-e9lWCd3VD18ahzNsxp9KQ-R1MpYMVrTT05kA6fTNagU2VmCfAMOZmk9NBEZWhZJ-yhpUotibh6Z5VIouMN2xuQUjFsHKd45vERgDztTFflPsQBek1GuRD728CpGM6E-kHEFQ498eAsABkMHRgE5O_Z7mb3I2fd9uQqw/s1024/1000001539.png',
      'https://blogger.googleusercontent.com/img/b/.../boing2.png'
    ],
    drum: [
      'https://blogger.googleusercontent.com/img/b/.../drum1.png',
      'https://blogger.googleusercontent.com/img/b/.../drum2.png'
    ],
    laugh: [
      'https://blogger.googleusercontent.com/img/b/.../laugh1.png',
      'https://blogger.googleusercontent.com/img/b/.../laugh2.png',
      'https://blogger.googleusercontent.com/img/b/.../laugh3.png'
    ]
  };

  async function fetchSounds(term) {
    // … unchanged …
  }

  async function initSoundboard() {
    // … unchanged …
  }

  function showPanel(term, preview) {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';

    // get the array; if someone accidentally set a string, wrap it
    let urls = PANEL_MAP[term] || [];
    if (!Array.isArray(urls)) urls = [urls];

    urls.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = term;
      img.style.maxWidth = '100%';
      img.style.display = 'block';
      grid.appendChild(img);
    });

    if (preview) new Audio(preview).play();
  }

  document.addEventListener('DOMContentLoaded', initSoundboard);
})();
