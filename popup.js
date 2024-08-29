document.addEventListener('DOMContentLoaded', function() {
  const bookmarkOnlyBtn = document.getElementById('bookmarkOnly');
  const bookmarkAndCloseBtn = document.getElementById('bookmarkAndClose');
  const messageDiv = document.getElementById('message');
  const randomContextCheckbox = document.getElementById('randomContextCheckbox');
  const contextInput = document.getElementById('contextInput');

  function showMessage(msg) {
    messageDiv.textContent = msg;
    setTimeout(() => { messageDiv.textContent = ''; }, 10000);
  }

  function handleBookmarkAction(closeTabs) {
    const useRandomContext = randomContextCheckbox.checked;
    const context = useRandomContext ? '' : contextInput.value;

    browser.runtime.sendMessage({
      action: "bookmarkTabs",
      closeTabs: closeTabs,
      context: context,
      useRandomContext: useRandomContext
    }).then((response) => {
      if (response.success) {
        showMessage(`Bookmarks saved to folder: "${response.folderName}"`);
      } else {
        showMessage('Error bookmarking tabs: ' + response.error);
      }
    }).catch((error) => {
      showMessage('Error bookmarking tabs: ' + error.message);
    });
  }

  randomContextCheckbox.addEventListener('change', function() {
    contextInput.disabled = this.checked;
    if (this.checked) {
      contextInput.value = '';
    }
  });

  bookmarkOnlyBtn.addEventListener('click', function() {
    handleBookmarkAction(false);
  });

  bookmarkAndCloseBtn.addEventListener('click', function() {
    handleBookmarkAction(true);
  });
});