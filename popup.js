document.addEventListener('DOMContentLoaded', function() {
  const bookmarkOnlyBtn = document.getElementById('bookmarkOnly');
  const bookmarkAndCloseBtn = document.getElementById('bookmarkAndClose');
  const messageDiv = document.getElementById('message');
  const randomContextCheckbox = document.getElementById('randomContextCheckbox');
  const contextInput = document.getElementById('contextInput');

  function showMessage(msg) {
    messageDiv.textContent = msg;
    messageDiv.innerHTML = msg;
    messageDiv.classList.remove('hidden');
    messageDiv.classList.add('visible');

    setTimeout(() => {
        messageDiv.classList.remove('visible');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
            messageDiv.textContent = '';
        }, 500);
    }, 3000);
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
        showMessage(`Bookmarks saved to folder: <br>"${response.folderName}"`);
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
