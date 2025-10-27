let allBookmarks = [];

document.addEventListener('DOMContentLoaded', () => {
  loadBookmarks();

  document.getElementById('searchBox').addEventListener('input', (e) => {
    filterBookmarks(e.target.value);
  });
});

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
      <div class="bookmark-title" data-url="${bookmark.url}">
        ${bookmark.title}
      </div>
      <div class="bookmark-url">${bookmark.url}</div>
      ${bookmark.description ? `<div class="bookmark-description">${bookmark.description}</div>` : ''}
      <div class="bookmark-date">Saved: ${new Date(bookmark.date).toLocaleString()}</div>
      <div class="bookmark-actions">
        <button class="edit-btn" data-id="${bookmark.id}">Edit</button>
        <button class="delete-btn" data-id="${bookmark.id}">Delete</button>
      </div>
    </div>
  `).join('');

  // Add event listeners after HTML is created
  attachEventListeners();
}

function attachEventListeners() {
  // Open URL on title click
  document.querySelectorAll('.bookmark-title').forEach(title => {
    title.addEventListener('click', (e) => {
      const url = e.target.getAttribute('data-url');
      window.open(url, '_blank');
    });
  });

  // Edit button clicks
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      editBookmark(id);
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

function editBookmark(id) {
  chrome.tabs.create({ url: `edit.html?id=${id}` });
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
