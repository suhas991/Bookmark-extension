let allBookmarks = [];
let currentView = 'save';

document.addEventListener('DOMContentLoaded', async () => {
  // Load current tab info for save view
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById('title').value = tab.title;
  document.getElementById('url').value = tab.url;

  // Navigation between views
  document.getElementById('saveTab').addEventListener('click', () => {
    switchView('save');
  });

  document.getElementById('viewTab').addEventListener('click', () => {
    switchView('list');
    loadBookmarks();
  });

  // Save bookmark
  document.getElementById('saveBtn').addEventListener('click', saveBookmark);

  // Search functionality
  document.getElementById('searchBox').addEventListener('input', (e) => {
    filterBookmarks(e.target.value);
  });
});

function switchView(view) {
  currentView = view;
  
  // Update nav buttons
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (view === 'save') {
    document.getElementById('saveTab').classList.add('active');
    document.getElementById('saveView').classList.add('active');
    document.getElementById('listView').classList.remove('active');
  } else {
    document.getElementById('viewTab').classList.add('active');
    document.getElementById('listView').classList.add('active');
    document.getElementById('saveView').classList.remove('active');
  }
}

function saveBookmark() {
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !url) {
    showStatus("Title and URL required!", "red");
    return;
  }

  const bookmark = { 
    id: Date.now(), 
    title, 
    url, 
    description, 
    date: new Date().toISOString() 
  };

  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks;
    bookmarks.unshift(bookmark);
    chrome.storage.local.set({ bookmarks }, () => {
      showStatus("Bookmark saved!", "green");
      document.getElementById('description').value = "";
      setTimeout(() => {
        document.getElementById('status').textContent = "";
      }, 2000);
    });
  });
}

function showStatus(message, color) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = color;
}

function loadBookmarks() {
  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    allBookmarks = result.bookmarks;
    displayBookmarks(allBookmarks);
  });
}

function displayBookmarks(bookmarks) {
  const container = document.getElementById('bookmarksList');
  const emptyState = document.getElementById('emptyState');

  if (bookmarks.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = bookmarks.map(bookmark => `
    <div class="bookmark-card" data-id="${bookmark.id}">
      <div class="bookmark-title">${bookmark.title}</div>
      <div class="bookmark-url">${bookmark.url}</div>
      ${bookmark.description ? `<div class="bookmark-description">${bookmark.description}</div>` : ''}
      <div class="bookmark-date">Saved: ${new Date(bookmark.date).toLocaleString()}</div>
      <div class="bookmark-actions">
        <button class="open-btn" data-id="${bookmark.id}" data-url="${bookmark.url}">Open</button>
        <button class="edit-btn" data-id="${bookmark.id}">Edit</button>
        <button class="delete-btn" data-id="${bookmark.id}">Delete</button>
      </div>
    </div>
  `).join('');

  attachEventListeners();
}

function attachEventListeners() {
  // Open button clicks
  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = e.target.getAttribute('data-url');
      chrome.tabs.create({ url: url });
    });
  });

  // Edit button clicks
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      showEditForm(id);
    });
  });

  // Delete button clicks
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      deleteBookmark(id);
    });
  });
}

function filterBookmarks(query) {
  const filtered = allBookmarks.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.url.toLowerCase().includes(query.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(query.toLowerCase()))
  );
  displayBookmarks(filtered);
}

function showEditForm(id) {
  const bookmark = allBookmarks.find(b => b.id === id);
  if (!bookmark) return;

  const container = document.getElementById('bookmarksList');
  container.innerHTML = `
    <div class="edit-form">
      <h3>Edit Bookmark</h3>
      <input id="editTitle" placeholder="Title" value="${bookmark.title}" />
      <input id="editUrl" placeholder="URL" value="${bookmark.url}" />
      <textarea id="editDescription" placeholder="Description">${bookmark.description || ''}</textarea>
      <div class="edit-actions">
        <button id="updateBtn">Update</button>
        <button id="cancelBtn">Cancel</button>
      </div>
      <p id="editStatus"></p>
    </div>
  `;

  document.getElementById('updateBtn').addEventListener('click', () => {
    updateBookmark(id);
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    loadBookmarks();
  });
}

function updateBookmark(id) {
  const title = document.getElementById('editTitle').value.trim();
  const url = document.getElementById('editUrl').value.trim();
  const description = document.getElementById('editDescription').value.trim();

  if (!title || !url) {
    const status = document.getElementById('editStatus');
    status.textContent = "Title and URL required!";
    status.style.color = "red";
    return;
  }

  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks.map(b => 
      b.id === id 
        ? { ...b, title, url, description, updatedAt: new Date().toISOString() }
        : b
    );

    chrome.storage.local.set({ bookmarks }, () => {
      allBookmarks = bookmarks;
      loadBookmarks();
    });
  });
}

function deleteBookmark(id) {
  if (!confirm('Delete this bookmark?')) return;

  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks.filter(b => b.id !== id);
    chrome.storage.local.set({ bookmarks }, () => {
      allBookmarks = bookmarks;
      displayBookmarks(bookmarks);
    });
  });
}
