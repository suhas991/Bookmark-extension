let bookmarkId = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  bookmarkId = parseInt(params.get('id'));

  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmark = result.bookmarks.find(b => b.id === bookmarkId);
    
    if (bookmark) {
      document.getElementById('title').value = bookmark.title;
      document.getElementById('url').value = bookmark.url;
      document.getElementById('description').value = bookmark.description || '';
    }
  });

  document.getElementById('updateBtn').addEventListener('click', updateBookmark);
  document.getElementById('cancelBtn').addEventListener('click', () => {
    window.close();
  });
});

function updateBookmark() {
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !url) {
    document.getElementById('status').textContent = "Title and URL required!";
    document.getElementById('status').style.color = "red";
    return;
  }

  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks.map(b => 
      b.id === bookmarkId 
        ? { ...b, title, url, description, updatedAt: new Date().toISOString() }
        : b
    );

    chrome.storage.local.set({ bookmarks }, () => {
      document.getElementById('status').textContent = "Bookmark updated!";
      document.getElementById('status').style.color = "green";
      setTimeout(() => window.close(), 1500);
    });
  });
}
