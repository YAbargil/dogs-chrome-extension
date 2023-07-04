console.log("[animal lover extension] background script running");

//adding event listener to oninstall event
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    console.log("[animal lover extension] Installed");
    console.log("[animal lover extension] dog has been set as a favorite pet");
    await chrome.storage.local.set({ favoritePet: "dog" });
  }
  setInterval(() => {
    console.log("[animal lover extension] 3 Hours has passed.");
  }, 1000 * 60 * 60 * 3);
});

//getting the favoritePet from content and setting it in local storage
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "SAVE_FAVORITE_PET") {
    console.log("[animal lover extension] favorite pet has been modified");
    chrome.storage.local.set({ favoritePet: message.favoritePet }, function () {
      sendResponse(); // Acknowledge the saving of favorite pet
    });
  }
});

export default {};
