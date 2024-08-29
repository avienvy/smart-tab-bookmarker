function getCurrentDateTime() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yy} ${hour}-${minute}`;
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
                    const activeTabId = activeTabs[0].id;
                    
                    return browser.tabs.query({ currentWindow: true })
                      .then((allTabs) => {
                        const tabIdsToClose = allTabs
                          .filter(tab => tab.id !== activeTabId)  // Exclude the active tab
                          .map(tab => tab.id);
                        
                        if (tabIdsToClose.length > 0) {
                          return browser.tabs.remove(tabIdsToClose)
                            .then(() => {
                              return browser.tabs.create({ url: "about:home" });
                            });
                        }
                      });
                  });
              }
            });
        });
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "bookmarkTabs") {
    let folderName = getCurrentDateTime();
    return bookmarkTabs(folderName, request.closeTabs);
  }
});
