// soundboard.js

(function() {
  const FREESOUND_TOKEN = '1NYiCNWuT4vUBDQ0LbgGJa39CgeHlhpiZ8egzFaF';
  const SEARCH_TERMS      = ['cheer','boing','drum','laugh'];
  const BASE              = 'https://SGGregory76.github.io/Comics-Json/comics/';

  async function fetchSounds(term) {
    const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(term)}&fields=id,name,previews&token=${FREESOUND_TOKEN}&page_size=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Freesound API error: ${res.status}`);
    const data = await res.json();
    if (!data.results.length) return null;
    const r = data.results[0];
    return {
      id:      r.id,
      label:   r.name.replace(/_/g,' ').replace(/\.wav|\.mp3/gi,''),
      preview: r.previews['preview-hq-mp3']
    };
  }

  async function initSoundboard() {
    const board = document.getElementById('soundboard');
    board.textContent = '';  
    try {
      const clips = (await Promise.all(SEARCH_TERMS.map(fetchSounds))).filter(x=>x);
      if (!clips.length) {
        board.textContent = '⚠️ No clips found.';
        return;
      }
      clips.forEach(item=>{
        const btn=document.createElement('button');
        btn.textContent=item.label;
        btn.onclick=()=>showComicPage(item);
        board.appendChild(btn);
      });
    } catch(e) {
      console.error(e);
      board.textContent = '⚠️ Error loading sounds.';
    }
  }

  function showComicPage({ preview }) {
  const grid = document.getElementById('grid-container');
  grid.innerHTML = '';

  // **exact same URL** used in the static test, no extra quotes
  const FRAME_URLS = [
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0ZqlwoqCTIPjAvfP60dY9N_h-e9lWCd3VD18ahzNsxp9KQ-R1MpYMVrTT05kA6fTNagU2VmCfAMOZmk9NBEZWhZJ-yhpUotibh6Z5VIouMN2xuQUjFsHKd45vERgDztTFflPsQBek1GuRD728CpGM6E-kHEFQ498eAsABkMHRgE5O_Z7mb3I2fd9uQqw/s1024/1000001539.png'
  ];

  FRAME_URLS.forEach(src => {
    console.log('Loading panel:', src);
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Comic panel';
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    img.onerror = () => console.error('❌ panel load failed:', src);
    img.onload  = () => console.log('✅ panel loaded:', src);
    grid.appendChild(img);
  });

  if (preview) new Audio(preview).play();
}


  FRAME_URLS.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = label;
    img.style.display = 'block';
    img.style.maxWidth = '100%';
    grid.appendChild(img);
  });

  if (preview) new Audio(preview).play();
}


  document.addEventListener('DOMContentLoaded', initSoundboard);
})();

function showComicPage({ id, label, preview }) {
  const grid = document.getElementById('grid-container');
  grid.innerHTML = '';  

  // ➤ TEMP TEST: use a placeholder so we know the code-path works
  // const FRAME_URLS = [
  //   `https://picsum.photos/seed/${Date.now()}/300/200`
  // ];

  // ➤ REAL: your hosted comic.png (or list multiple: comic1.png, comic2.png…)
  const BASE = 'https://SGGregory76.github.io/Comics-Json/comics/';
  const FRAME_URLS = [
    `${BASE}comic.png`
  ];

  FRAME_URLS.forEach(src => {
    console.log('➤ attempting to load image:', src);
    const img = document.createElement('img');
    img.src = src;
    img.alt = label;
    img.style.display = 'block';      // force it visible
    img.style.maxWidth = '100%';      // responsive
    img.onload =  () => console.log('✅ loaded image:', src);
    img.onerror = () => console.error('❌ failed to load image:', src);
    grid.appendChild(img);
  });

  if (preview) new Audio(preview).play();
}
