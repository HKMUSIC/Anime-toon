// admin/admin.js (module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authMsg = document.getElementById('authMsg');
const adminUI = document.getElementById('admin-ui');
const addBtn = document.getElementById('addBtn');

loginBtn.addEventListener('click', async () => {
  try {
    const usercred = await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
    authMsg.textContent = 'Logged in';
  } catch (err) {
    authMsg.textContent = 'Login failed: ' + err.message;
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Optionally: check user.uid against allowed admin UIDs
    adminUI.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
    loginBtn.style.display = 'none';
    emailEl.style.display = 'none';
    passEl.style.display = 'none';
    setupList();
  } else {
    adminUI.style.display = 'none';
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    emailEl.style.display = 'block';
    passEl.style.display = 'block';
  }
});

addBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const episodes = Number(document.getElementById('episodes').value) || 0;
  const img = document.getElementById('img').value.trim();
  const video = document.getElementById('video').value.trim();

  if (!title || !video) {
    alert('Title and video are required');
    return;
  }

  try {
    await addDoc(collection(db, 'anime'), {
      title, episodes, img, video, createdAt: serverTimestamp()
    });
    alert('Added');
    document.getElementById('title').value='';
    document.getElementById('episodes').value='';
    document.getElementById('img').value='';
    document.getElementById('video').value='';
  } catch (err) {
    alert('Error: '+err.message);
  }
});

function setupList() {
  const listEl = document.getElementById('list');
  onSnapshot(collection(db, 'anime'), (snap) => {
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `<strong>${d.title}</strong> <div>${d.episodes || ''} eps</div>
        <div style="margin-top:8px"><button data-id="${docSnap.id}" class="del">Delete</button></div>`;
      listEl.appendChild(div);
    });

    // attach delete handlers
    document.querySelectorAll('.del').forEach(btn => {
      btn.onclick = async (e) => {
        const id = e.target.dataset.id;
        if (!confirm('Delete?')) return;
        await deleteDoc(doc(db, 'anime', id));
      };
    });
  });
}
