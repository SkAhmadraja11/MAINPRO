import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SongManagement.css";

const SongManagement = () => {
  const [songs, setSongs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("Title");
  const [genreFilter, setGenreFilter] = useState("All");

  // Fetch songs
  useEffect(() => {
    axios
      .get("http://localhost:2057/api/songs")
      .then((res) => {
        setSongs(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError("⚠️ Unable to load songs from the server."))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters dynamically
  useEffect(() => {
    const q = query.trim().toLowerCase();
    let result = songs;

    if (genreFilter !== "All") {
      result = result.filter(
        (song) => (song.genre || "").toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (q) {
      result = result.filter((song) => {
        const title = (song.title || "").toLowerCase();
        const artist = (song.artist || "").toLowerCase();
        const genre = (song.genre || "").toLowerCase();

        switch (searchBy) {
          case "Artist":
            return artist.includes(q);
          case "Genre":
            return genre.includes(q);
          default:
            return title.includes(q);
        }
      });
    }

    setFiltered(result);
  }, [query, searchBy, genreFilter, songs]);

  // Extract unique genres
  const getGenres = () => ["All", ...new Set(songs.map((s) => s.genre).filter(Boolean))];

  // Spotify helpers
  const isSpotifyUrl = (url) =>
    url?.includes("open.spotify.com") || url?.startsWith("spotify:");

  const getSpotifyEmbedUrl = (url) => {
    if (url.startsWith("spotify:")) {
      const id = url.split(":")[2];
      return `https://open.spotify.com/embed/track/${id}`;
    }
    const match = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    return match ? `https://open.spotify.com/embed/track/${match[1]}` : null;
  };

  if (loading) return <p className="loading">Loading songs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="song-page-wrapper">
      <div className="song-page-content">
        <div className="song-header">
          <input
            type="text"
            className="search-input"
            placeholder={`Search by ${searchBy.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="search-select"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option>Title</option>
            <option>Artist</option>
            <option>Genre</option>
          </select>

          <select
            className="genre-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {getGenres().map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <table className="song-table">
          <thead>
            <tr>
              <th className="img-td">Cover</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Genre</th>
              <th>Album</th>
              <th className="play-td">Play</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No songs found 🎵
                </td>
              </tr>
            ) : (
              filtered.map((song, i) => (
                <tr key={i}>
                  <td data-label="Cover">
                    {song.imageUrl ? (
                      <img src={song.imageUrl} alt={song.title} className="song-img" />
                    ) : (
                      <div className="no-img">No Image</div>
                    )}
                  </td>
                  <td data-label="Title">{song.title}</td>
                  <td data-label="Artist">{song.artist}</td>
                  <td data-label="Genre">{song.genre}</td>
                  <td data-label="Album">{song.album}</td>
                  <td data-label="Play">
                    {isSpotifyUrl(song.url) ? (
                      getSpotifyEmbedUrl(song.url) ? (
                        <iframe
                          src={getSpotifyEmbedUrl(song.url)}
                          title={`spotify-${i}`}
                          width="200"
                          height="80"
                          frameBorder="0"
                          allow="encrypted-media"
                        />
                      ) : (
                        <a href={song.url} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      )
                    ) : (
                      <audio controls>
                        <source src={song.url} />
                        Your browser does not support audio.
                      </audio>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongManagement;
