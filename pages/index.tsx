import type { GetServerSideProps, NextPage } from "next";
import Input from "../app/Components/Input/Input";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import Option from "../app/Components/Select/Option";
import Card from "../app/Components/Card/Card";
import { motion } from "framer-motion";
import { IAlbum, IArtis, IMusic } from "../app/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { getAlbums, getArtists, getSongs } from "../app/api";
import { LANGUAGE } from "../app/data";
import MusicPlayer from "../app/Components/MusicPlayer/MusicPlayer";
import { setAllSong, setPlaySong, setSong } from "../app/slices/musicSlice";

const Home: NextPage = () => {
  const [album, setAlbum] = useState("");
  const [songs, setSongs] = useState<IMusic[]>();
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const { isSongPlaying, song } = useSelector(
    (state: RootState) => state.music
  );
  const [artist, setArtist] = useState<IArtis[]>();
  const [albums, setAlbums] = useState<IAlbum[]>();
  const dispatch = useDispatch();

  const getSong = async () => {
    const data = await getSongs(token);
    setLoading(false);
    dispatch(setAllSong({ allSongs: data } as any));
    setSongs(data);
  };

  const getAlbum = async () => {
    const data = await getAlbums(token);
    setLoading(false);
    setAlbums(data);
  };

  const getArtist = async () => {
    const data = await getArtists(token);
    setLoading(false);
    setArtist(data);
  };

  useEffect(() => {
    token && getSong();
    token && getAlbum();
    token && getArtist();
  }, [token]);

  return (
    <>
      {/* Home Section */}
      <section className="sec_p bg-[#f6f2f4]">
        <div className="container mx-auto">
          {/* Search Bar  */}
          <div className="relative shadow-md">
            <Input
              type="text"
              placeholder="Search Here..."
              className="input_search"
            />
            <BiSearch
              size={20}
              className="text-gray-300 absolute top-[12px] left-[15px]"
            />
          </div>
          {/* List of filter */}
          <div className="mt-8 flex items-center justify-around">
            {/* Artist List */}
            <select
              className="selectColor"
              id=""
              onChange={(e) => setAlbum(e.target.value)}
            >
              {artist &&
                artist.map((item) => (
                  <Option key={item.name} value={item.name}>
                    {item.name}
                  </Option>
                ))}
            </select>
            {/* Album List */}
            <div className="flex items-center gap-6">
              <p className="text cursor-pointer font-sm">Jasp</p>
              <p className="text cursor-pointer font-sm">Rock</p>
              <p className="text cursor-pointer font-sm">Melody</p>
              <p className="text cursor-pointer font-sm">Karoke</p>
            </div>
            {/* Main Album List */}
            <select
              className="selectColor"
              onChange={(e) => setAlbum(e.target.value)}
            >
              {albums &&
                albums.map((item) => (
                  <Option key={item.name} value={item.name}>
                    {item.name}
                  </Option>
                ))}
            </select>
            {/* Music Language List */}
            <select
              className="selectColor"
              onChange={(e) => setAlbum(e.target.value)}
            >
              {LANGUAGE.map((item) => (
                <Option key={item.name} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </select>
          </div>
          {/* Render Music List */}
          <motion.div
            className="flex justify-between items-center mt-[3em] flex-wrap"
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {songs &&
              songs?.map((data, index) => (
                <Card
                  music={data}
                  key={data._id}
                  index={index}
                />
              ))}
          </motion.div>
        </div>
      </section>
      {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
        >
          <MusicPlayer />
        </motion.div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (!req.cookies?.token) {
    return {
      redirect: {
        destination: "/login",
      },
      props: { isLogin: false },
    };
  }
  return {
    props: { isLogin: false },
  };
};

export default Home;
