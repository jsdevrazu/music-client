import Image from "next/image";
import React, { FC } from "react";
import { IMusic } from "../../utils";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setPlaySong, setSong } from "../../slices/musicSlice";

interface IProps {
  music: IMusic;
  index?: number;
}

const Card: FC<IProps> = ({ music, index }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const addToPlay = (index: number) => {
    dispatch(setSong({ song: index } as any));
    dispatch(setPlaySong({ isSongPlaying: true } as any));
  };

  return (
    <div
      onClick={() => addToPlay(index!) }
      className="bg-white shadow-lg mt-4 rounded-lg p-4 w-[100%] sm:w-[50%] md:w-[25%] lg:w-[15%] text-center relative"
    >
      <Image
        src={music.imageUrl}
        width={120}
        height={120}
        className="object-cover"
        alt="Razu islam"
      />
      <h3 className="text-gray-800 font-semibold text-lg">{music.name}</h3>
      <span className="text">{music?.artist?.name}</span>
      {user && user.role === "admin" && (
        <motion.div
          whileTap={{ scale: 0.75 }}
          className="absolute cursor-pointer left-4 bottom-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-200"
        >
          <MdDelete className="text-xl text-red-400 hover:text-red-500" />
        </motion.div>
      )}
    </div>
  )
};

export default Card;
