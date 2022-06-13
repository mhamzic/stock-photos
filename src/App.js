import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./components/Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;

const mainUrl = "https://api.unsplash.com/photos/";

const searchUrl = "https://api.unsplash.com/search/photos/";

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((prevState) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...prevState, ...data.results];
        } else {
          return [...prevState, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      // console.log("inner height", window.innerHeight);
      // console.log("scroll top", window.scrollY);
      // console.log("body height", document.body.scrollHeight);

      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((prevState) => prevState + 1);
      }
    });

    return () => {
      window.removeEventListener("scroll", event);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };

  return (
    <main>
      <section className="search">
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h2>Pexels Photo Search App</h2>
        </div>
        <form className="search-form">
          <input
            type="text"
            placeholder="search..."
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => (
            <Photo key={index} {...photo} />
          ))}
        </div>
        {loading ? <h2 className="loading">Loading...</h2> : null}
      </section>
    </main>
  );
}
export default App;
