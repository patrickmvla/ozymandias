import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { QualityType, VideoFormats, VideoInputSettings } from "@/lib/types";

import { motion } from "framer-motion";

interface Props {
  videoSettings: VideoInputSettings;
  onVideoSettingsChange: (value: VideoInputSettings) => void;
  disable: boolean;
}

export const VideoInputControl = ({
  disable,
  onVideoSettingsChange,
  videoSettings,
}: Props) => {
  <motion.div
    layout
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ type: "tween" }}
    key="input"
    className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 h-fit"
  >
    <div className="text-sm">
      <div className="flex justify-between items-center border-b mb-2 pb-2">
        <p>Remove Audio</p>
        <Switch
          disabled={disable}
          onCheckedChange={(value: boolean) =>
            onVideoSettingsChange({ ...videoSettings, removeAudio: value })
          }
          checked={videoSettings.removeAudio}
        />
      </div>
      <div
        className={`flex justify-between items-center ${
          videoSettings.twitterCompressionCommand ? " " : "border-b mb-2 pb-2"
        }`}
      >
        <p>Compress for X.com</p>
        <Switch
          disabled={disable}
          onCheckedChange={(value: boolean) =>
            onVideoSettingsChange({
              ...videoSettings,
              twitterCompressionCommand: value,
            })
          }
          checked={videoSettings.twitterCompressionCommand}
        />
      </div>
      {!videoSettings.twitterCompressionCommand && (
        <>
          <div className="flex items-center justify-between border-b mb-2 pb-2">
            <p>Quality</p>
            <Select
              disabled={disable}
              value={videoSettings.quality}
              onValueChange={(value: string) => {
                const quality = value as QualityType;
                onVideoSettingsChange({ ...videoSettings, quality });
              }}
            >
              <SelectTrigger className="w-[100px] text-sm">
                <SelectValue placeholder="select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {quality.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <p>Formate</p>
            <Select
              disabled={disable}
              value={videoSettings.videoType}
              onValueChange={(value: string) => {
                const videoType = value as VideoFormats;
                onVideoSettingsChange({ ...videoSettings, videoType });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {formate.map(({ label, value }) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  </motion.div>;
};

const quality: { label: string; value: QualityType }[] = [
  { label: "High", value: QualityType.High },
  { label: "Medium", value: QualityType.Medium },
  { label: "Low", value: QualityType.Low },
];

const formate: { label: string; value: VideoFormats }[] = [
  { label: "MP4 (.mp4)", value: VideoFormats.MP4 },
  { label: "MKV (.mkv)", value: VideoFormats.MKV },
  { label: "AVI (.avi)", value: VideoFormats.AVI },
  { label: "MOV (.mov)", value: VideoFormats.MOV },
  { label: "FLV (.flv)", value: VideoFormats.FLV },
  { label: "WEBM (.webm)", value: VideoFormats.WEBM },
];
