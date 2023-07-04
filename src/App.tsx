import { useEffect, useState } from "react";
import "./App.css";
import Weather from "./Weather";
import Search from "./Search";

const imgLength = 9;

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [isloading, setIsLoading] = useState(false);
  // const [lastSeenDate, setLastSeenDate] = useState("");
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const [favoritePet, setFavoritePet] = useState("");

  const incImageIndex = (idx: number) => (idx + 1) % imgLength;

  const initChromeStorage = async () => {
    const lastSeenDate = new Date().toDateString();
    await chrome.storage.local.set({
      lastSeenDate,
    });
    await chrome.storage.local.set({
      imageIndex: 0,
    });
    // console.log(lastSeenDate);
    setImageIndex(0);
    // setLastSeenDate(lastSeenDate);
  };

  useEffect(() => {
    //getting favoritePet from local storage
    chrome.storage.local.get("favoritePet").then(async (result) => {
      if (!result["favoritePet"]) {
        //setting if doesnt exist
        await chrome.storage.local.set({ favoritePet: "dog" });
        setFavoritePet("dog");
      } else {
        setFavoritePet(result["favoritePet"]);
      }
    });

    //getting the last time the user used the extension
    chrome.storage.local.get("lastSeenDate").then(async (result) => {
      const res = result["lastSeenDate"];
      //local storage hasnt initialized yet
      if (!res) {
        await initChromeStorage();
      } else {
        const currentDate = new Date().toDateString();
        const currentImageIndex = await chrome.storage.local.get("imageIndex");

        //24h change since last visit
        if (res !== currentDate) {
          const newImageIndex = incImageIndex(currentImageIndex["imageIndex"]);
          await chrome.storage.local.set({ lastSeenDate: currentDate });
          await chrome.storage.local.set({ imageIndex: newImageIndex });
        }
        // setLastSeenDate(currentDate);
        setImageIndex(currentImageIndex["imageIndex"]);
      }
    });

    chrome.storage.local.get("imageUrl", (data) => {
      const { imageUrl } = data;
      //background sets to user custom url
      if (imageUrl) {
        setImageUrl(imageUrl);
      }
    });
  }, []);

  //setting background image according to user preferences
  const getBackgroundImage = () => {
    if (imageUrl) {
      return `url(${imageUrl})`;
    }
    if (imageIndex === null) {
      return "white";
    }

    return favoritePet === "dog"
      ? `url(../wallpapers/dogs/dog-${imageIndex}.jpg)`
      : `url(../wallpapers/cats/cats-${imageIndex}.jpg)`;
  };

  //changing background image
  const nextImageHandler = async () => {
    setIsLoading(true);
    const currentImageIndex = await chrome.storage.local.get("imageIndex");
    const newImageIndex = incImageIndex(currentImageIndex["imageIndex"]);
    await chrome.storage.local.set({ imageIndex: newImageIndex });
    setImageIndex(newImageIndex);
    setIsLoading(false);
  };

  return (
    <>
      {!favoritePet ? (
        <div>Loading..</div>
      ) : (
        <div
          style={{
            backgroundImage: getBackgroundImage(),
            backgroundSize: "cover",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          <Weather />
          <Search />
          <div className="next">
            <button disabled={isloading} onClick={nextImageHandler}>
              Next Image &#8594;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
