import "./styles.css";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

type Song = {
  name: String;
  singer: String;
  likes: Number;
};
type Songs = {
  songs: Song[];
};
type ServerError = {
  errorMessage: String;
  errorCode: Number;
};
async function getSongs() {
  try {
    const response = await axios.get<Songs>(
      "https://axios-typescript.prithvibytes.repl.co/songss"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<ServerError>;
      if (serverError && serverError.response) {
        return serverError.response.data;
      }
    }
    return { errorMessage: "Something went wrong!", errorCode: 404 };
  }
}
export default function App() {
  const [songs, setSongs] = useState<Songs | null>(null);
  const [error, setError] = useState<ServerError | null>(null);
  useEffect(() => {
    (async function () {
      const songs = await getSongs();
      if ("songs" in songs) {
        return setSongs(songs);
      }
      setError(songs);
    })();
  }, []);
  return (
    <div className="App">
      <h2>Songs</h2>
      {error && <h3>{error.errorMessage}</h3>}
      {songs?.songs.map((song) => (
        <h5>{`Name: ${song.name} |  Singer ${song.singer} | Likes: ${song.likes}`}</h5>
      ))}
    </div>
  );
}
