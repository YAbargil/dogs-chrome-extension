import React, { useState } from "react";
import "./Search.css";

export default function Search() {
  const [search, setSearch] = useState("");
  const [searchParam, setSearchParam] = useState("Web");

  const handleKeypress = (e: { keyCode: number }) => {
    //triggers by pressing the ENTER key
    if (e.keyCode === 13) {
      searchHandler();
    }
  };

  const searchHandler = () => {
    if (!search || search.length === 0) {
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.id) {
        let url = "";
        switch (searchParam) {
          case "Web":
            url = "https://www.google.com/search?q=" + search;
            break;
          case "Images":
            url = "https://www.google.com/search?tbm=isch&q=" + search;
            break;
          case "Videos":
            url = "https://www.google.com/search?tbm=vid&q=" + search;
            break;
        }
        //changing the current tab's url
        chrome.tabs.update(tabs[0].id, {
          url,
        });
      }
    });
  };
  const onOptionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchParam(event.target.value);
  };

  return (
    <>
      <div className="search">
        <input
          type="text"
          placeholder="Search ... "
          minLength={1}
          onKeyUp={handleKeypress}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <button onClick={searchHandler}>Search</button>
      </div>
      <div className="searchradio">
        <input
          type="radio"
          value="Web"
          name="type"
          id="webChoice"
          onChange={onOptionChange}
          checked={searchParam === "Web"}
        />
        <label htmlFor="webChoice">Web</label>
        <input
          type="radio"
          value="Images"
          name="type"
          id="imagesChoice"
          onChange={onOptionChange}
          checked={searchParam === "Images"}
        />
        <label htmlFor="imagesChoice">Images</label>
        <input
          type="radio"
          value="Videos"
          name="type"
          id="videosChoice"
          onChange={onOptionChange}
          checked={searchParam === "Videos"}
        />
        <label htmlFor="videosChoice">Videos</label>
      </div>
    </>
  );
}
