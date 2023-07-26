"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [Loading, setLoading] = useState(false);
  const [query, setquery] = useState("");
  const [text, settext] = useState([]);

  // Custom Search Function
  const fetchApi = () => {
    const API_KEY = "AIzaSyBkpZ2nISyZDOkhypXS6_fzUeMDZcykASc";
    const ENGINE_ID = "974d1a7878bdd449f";
    const SEARCH_URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${ENGINE_ID}&q=${encodeURIComponent(
      query
    )}`;
    if (query.trim() == "") {
      alert("Please enter a valid Query");
      return;
    }

    setLoading((pre) => true);
    fetch(SEARCH_URL)
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          const top5Url = res.items.map((item) => item.link).slice(0, 5);
          ScrapUrls(top5Url);
        }
      })
      .catch((err) => {
        console.error("Error while fetching search results:", err);
        alert(
          "An error occurred while fetching search results. Please try again later."
        );
      });
    setquery("");
  };

  // Scrap Top 5 URLS which comes from Custom Search Function
  const ScrapUrls = (urls) => {
    const scrapKEY =
      "B82H10YJLBTM6DIEJP9D2ESS4WFCJ6S3STSKKEW9BNWOOSBUGUQC9MEJ0DJB7N50BG1QBFDOMUERP31M";
    Promise.all(
      urls.map((item) =>
        axios
          .get(
            `https://app.scrapingbee.com/api/v1?api_key=${scrapKEY}&url=${encodeURIComponent(
              item
            )}`
          )
          .then((res) => {
            return res;
          })
          .catch((err) => err)
      )
    )
      .then((res) => {
        res.forEach((eachtext) => {
          const htmlContent = eachtext.data;
          const textContent = extractTextFromHtml(htmlContent);
          settext((pre) => [...pre, textContent]);
        });
      })
      .finally(() => {
        setLoading((pre) => false);
      });
  };

  const extractTextFromHtml = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;
    return tempElement.textContent || tempElement.innerText || "";
  };

  return (
    <main>
      <h1 className="text-center text-4xl p-2 font-semibold">Custom Search</h1>
      <div className="flex  justify-around py-5 w-4/5 m-auto">
        {" "}
        <input
          className="w-full rounded text-black border border-blue-500 px-3 text-lg  focus:border-2 focus:border-blue-500 focus:outline-0"
          type="text"
          value={query}
          onChange={(e) => setquery((pre) => e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded ml-5"
          onClick={fetchApi}>
          Search
        </button>
      </div>
      <div className="w-4/5 m-auto border p-5 overflow-hidden">
        {Loading ? (
          <div className="flex justify-center text-lg font-semibold">
            <h1>Loading....</h1>
          </div>
        ) : (
          text.map((item) => {
            return (
              <>
                <p>{item}</p>
              </>
            );
          })
        )}
      </div>
    </main>
  );
}
