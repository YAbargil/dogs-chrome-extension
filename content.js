const catChoice = document.getElementById("catChoice");
const dogChoice = document.getElementById("dogChoice");
const imageUrlInput = document.getElementById("imageUrlInput");
const changeButton = document.getElementById("changeButton");
const clearButton = document.getElementById("clearButton");

function saveFavoritePet() {
  const favoritePet = catChoice.checked ? "cat" : "dog";
  console.log(favoritePet);
  chrome.runtime.sendMessage(
    { type: "SAVE_FAVORITE_PET", favoritePet }
    // ,
    // function () {
    //   console.log("Favorite pet saved:", favoritePet);
    // }
  );
}

function addImageUrl() {
  try {
    const imageUrl = imageUrlInput.value;
    //validate URL string
    const isValidUrl = new URL(imageUrl);
    chrome.storage.local.set({ imageUrl }, function () {
      console.log("Image URL added:", imageUrl);
    });
  } catch (err) {
    console.error(err, "recieved invalid URL");
    //URL is not valid
    return;
  }
}

catChoice.addEventListener("change", saveFavoritePet);
dogChoice.addEventListener("change", saveFavoritePet);

clearButton.addEventListener("click", deleteImageUrl);
changeButton.addEventListener("click", addImageUrl);

//deletes popup input box upon clicking Clear button
function deleteImageUrl() {
  chrome.storage.local.remove("imageUrl", function () {
    console.log("Image URL deleted");
    imageUrlInput.value = ""; // Clear the input field
  });
}

//setting the input value based on chrome's storage
chrome.storage.local.get("imageUrl", function (data) {
  const { imageUrl } = data;
  imageUrlInput.value = imageUrl || "";
});

//Checking the current favoritePet's radio based on chrome's storage
chrome.storage.local.get("favoritePet", function (data) {
  const { favoritePet } = data;
  if (favoritePet && favoritePet === "cat") {
    catChoice.checked = true;
  } else if (favoritePet && favoritePet === "dog") {
    dogChoice.checked = true;
  }
});
