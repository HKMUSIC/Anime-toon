// frontend/app.js (type="module")
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM refs
const animeListEl = document.getElementById('anime-list');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let allAnimes = [];

// Listen real-time to "anime" collection
const q = query(collection(db, 'anime'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snapshot) => {
  allAnimes = [];
  snapshot.forEach(doc => allAnimes.push({ id: doc.id, ...doc.data() }));
  renderList(allAnimes);
});

// Render cards
function renderList(list) {
  animeListEl.innerHTML = '';
  list.forEach(a => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${a.img || ''}" alt="${a.title}">
      <h4>${a.title}</h4>
      <p>${a.episodes ? a.episodes + ' Episodes' : ''}</p>
    `;
    div.addEventListener('click', () => {
      // go to player page (we pass video and title)
      const url = `player.html?title=${encodeURIComponent(a.title)}&video=${encodeURIComponent(a.video)}&img=${encodeURIComponent(a.img||'')}`;
      window.location.href = url;
    });
    animeListEl.appendChild(div);
  });
}

// Search box (client side)
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.style.display = 'none'; return; }
  const filtered = allAnimes.filter(a => a.title.toLowerCase().includes(q));
  searchResults.innerHTML = '';
  if (filtered.length === 0) {
    searchResults.innerHTML = `<div class="item">No results</div>`;
  } else {
    filtered.forEach(a => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<img src="${a.img||''}"><div><strong>${a.title}</strong><div style="color:#bbb;font-size:12px">${a.episodes? a.episodes+' eps':''}</div></div>`;
      item.addEventListener('click', () => {
        window.location.href = `player.html?title=${encodeURIComponent(a.title)}&video=${encodeURIComponent(a.video)}&img=${encodeURIComponent(a.img||'')}`;
      });
      searchResults.appendChild(item);
    });
  }
  searchResults.style.display = 'block';
});

// hide results when click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) searchResults.style.display = 'none';
});
