document.addEventListener('DOMContentLoaded', function() {
  const bookmarkOnlyBtn = document.getElementById('bookmarkOnly');
  const bookmarkAndCloseBtn = document.getElementById('bookmarkAndClose');
  const messageDiv = document.getElementById('message');

  function showMessage(msg) {
    messageDiv.textContent = msg;
    setTimeout(() => { messageDiv.textContent = ''; }, 3000);
  }

  bookmarkOnlyBtn.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: "bookmarkTabs" })
      .then(() => {
        showMessage('Tabs bookmarked successfully!');
      });
  });

  bookmarkAndCloseBtn.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: "bookmarkTabs", closeTabs: true })
      .then(() => {
        window.close(); // Close the popup after operation
      });
  });
});
