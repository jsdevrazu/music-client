import { useState } from "react";
import { MdDelete } from "react-icons/md";
import Button from "../Button/Button";
import DisabledButton from "../DisableButton/DisableButton";
import ImageUploader from "../ImageUploader/ImageUploader";
import ImageLoader from "../ImgLoader/ImageLoader";
import { motion } from "framer-motion";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebase";
import toast from "react-hot-toast";
import { saveNewAlbum } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useRouter } from "next/router";

const AddNewAlbum = () => {
  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);
  const [artistCoverImage, setArtistCoverImage] = useState("");
  const [artistName, setArtistName] = useState("");
  const { token } = useSelector((state: RootState) => state.auth);
  const router = useRouter()

  const deleteImageObject = (songURL: string, action?: string) => {
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      toast.success("success");
      toast.error("File removed successfully");
      setArtistCoverImage("");
    });
  };

  const saveAlbumSongToDB = async () => {
    if(!artistName || artistName?.length < 5) return toast.error("Album name must be at least 5 characters")
    try {
      await saveNewAlbum(token, {
        name:artistName,
        imageUrl:artistCoverImage,
      });
      toast.success("Created new song");
      router.push("/dashboard/album");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtist && <ImageLoader progress={artistProgress} />}
        {!isArtist && (
          <>
            {!artistCoverImage ? (
              <ImageUploader
                setImageURL={setArtistCoverImage}
                isLoading={setIsArtist}
                setProgress={setArtistProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={artistCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(artistCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 ">
        <input
          type="text"
          placeholder="Album Name"
          className="mt-4 lg:mt-0 w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isArtist ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveAlbumSongToDB}
            >
              Send
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewAlbum;
