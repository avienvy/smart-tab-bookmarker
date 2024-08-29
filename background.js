const animals = [
  'cat', 'dog', 'wolf', 'bear', 'tiger', 'lion', 'elephant', 'giraffe', 'zebra', 'monkey',
  'penguin', 'koala', 'kangaroo', 'hippo', 'rhino', 'panda', 'owl', 'fox', 'rabbit', 'deer'
];

const adjectives = [
  'funny', 'dark', 'busy', 'lazy', 'clever', 'brave', 'shy', 'happy', 'sad', 'angry',
  'calm', 'wild', 'gentle', 'fierce', 'quiet', 'loud', 'big', 'small', 'fast', 'slow'
];

function generateRandomCombination() {
  const isFirstWordAnimal = Math.random() < 0.5;
  const firstWord = isFirstWordAnimal 
    ? animals[Math.floor(Math.random() * animals.length)]
    : adjectives[Math.floor(Math.random() * adjectives.length)];

  const secondWord = isFirstWordAnimal
    ? adjectives[Math.floor(Math.random() * adjectives.length)]
    : animals[Math.floor(Math.random() * animals.length)];

  return `${firstWord} ${secondWord}`;
}

function getCurrentDateTime(context = '', useRandomContext = false) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mm = monthNames[now.getMonth()];
  const yyyy = String(now.getFullYear());
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  const dateTimeString = `${dd}-${mm}-${yyyy} (${hour}:${minute})`;

  if (useRandomContext) {
    const randomContext = generateRandomCombination();
    return `${dateTimeString} ${randomContext}`;
  } else {
    return context ? `${dateTimeString} ${context}` : dateTimeString;
  }
}

function bookmarkTabs(folderName, closeTabsAfter) {
  return browser.bookmarks.create({ title: folderName })
    .then((folder) => {
      return browser.tabs.query({ currentWindow: true })
        .then((tabs) => {
          const bookmarkPromises = tabs.map(tab => 
            browser.bookmarks.create({
              parentId: folder.id,
              title: tab.title,
              url: tab.url
            })
          );

          return Promise.all(bookmarkPromises)
            .then(() => {
              if (closeTabsAfter) {
                return browser.tabs.query({ currentWindow: true, active: true })
                  .then((activeTabs) => {
                    const activeTabId = activeTabs.length > 0 ? activeTabs[0].id : null;

                    return browser.tabs.query({ currentWindow: true })
                      .then((allTabs) => {
                        const tabIdsToClose = allTabs
                          .filter(tab => tab.id !== activeTabId)  // Exclude the active tab
                          .map(tab => tab.id);

                        // Close the tabs
                        return browser.tabs.remove(tabIdsToClose);
                      });
                  });
              }
            })
            .then(() => folder.title);  // Return the folder name
        });
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "bookmarkTabs") {
    let folderName = getCurrentDateTime(request.context, request.useRandomContext);

    bookmarkTabs(folderName, request.closeTabs)
      .then((folderTitle) => sendResponse({ success: true, folderName: folderTitle }))
      .catch(error => sendResponse({ success: false, error: error.message }));

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});