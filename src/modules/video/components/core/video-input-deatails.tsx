import { bytesToSize } from "@/utils/bytes-to-size";
import { FileAction } from "@/utils/types";
import { motion } from "framer-motion";

interface Props {
  videoFile: FileAction;
  onClear: () => void;
}

export const VideoInputDetails = ({ onClear, videoFile }: Props) => {
  <motion.div
    layout
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ type: "tween" }}
    key="details"
    className="bg-gray-100 border border-gray-200 rounded2xl px-4 py-3 h-fit"
  >
    <div className="text-sm">
      <div className="flex justify-between items-center border-b mb-2 pb-2">
        <p className="">Fill Input</p>
        <button
          onClick={onClear}
          type="button"
          className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 px-2.5 py-1.5 relative text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950"
        >
          Clear
        </button>
      </div>
      <p className="border-b mb-2 pb-2">{videoFile?.fileName}</p>
      <div className="flex justify-between items-center">
        <p>File Size</p>
        <p>{bytesToSize(videoFile.fileSize)}</p>
      </div>
    </div>
  </motion.div>;
};
