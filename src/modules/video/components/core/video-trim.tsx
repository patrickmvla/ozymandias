import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { VideoInputSettings } from "@/utils/types";
import { calculateTimeInHoursMinutesSeconds } from "@/utils/time-converter";
import { VideoSlider } from "@/components/ui/video-slider";

interface Props {
  videoSettings: VideoInputSettings;
  onVideoSettingsChange: (value: VideoInputSettings) => void;
  disable: boolean;
}

export const VideoTrim = ({
  disable,
  onVideoSettingsChange,
  videoSettings,
}: Props) => {
  const [videoEndTime, setVideoEndTime] = useState(0);

  const { customEndTime, customStartTime } = videoSettings;
  const startTime = calculateTimeInHoursMinutesSeconds(customStartTime);
  const endTime = calculateTimeInHoursMinutesSeconds(customEndTime);

  useEffect(() => {
    const video = document.getElementById(
      "compress-video-player"
    ) as HTMLVideoElement;

    if (video) {
      const handleLoadedMetadata = () => {
        const durationInSeconds = video.duration;
        onVideoSettingsChange({
          ...videoSettings,
          customEndTime: durationInSeconds,
        });
        setVideoEndTime(durationInSeconds);
      };
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      key="trim"
      transition={{ type: "tween" }}
      className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 h-fit"
    >
      <div className="text-sm">
        <div className="flex justify-between items-center border-b mb-2 pb-2">
          <p className="">Trim Video</p>
        </div>
        <div className="flex justify-between items-center border-b mb-2 pb-2">
          <VideoSlider
            disabled={disable}
            value={[customStartTime, customEndTime]}
            max={videoEndTime}
            step={1}
            className="w-full"
            onValueChange={(value: number[]) => {
              const [startTime, endTime] = value;
              onVideoSettingsChange({
                ...videoSettings,
                customEndTime: endTime,
                customStartTime: startTime,
              });
            }}
          />
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-gray-5oo">Start Time</p>
            <p className="font-semibold">{startTime}</p>
          </div>
          <div>
            <p className="text-gray-500">End Time</p>
            <p className="text-end font-medium">{endTime}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
