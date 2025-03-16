import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useDropzone } from "react-dropzone";
import { useEffect, useRef, useState } from "react";
import { FileVideo, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VideoSettings, { SettingsButton } from "@/components/video-settings";
import { ConversionSettings, defaultSettings } from "@/lib/types";

const ffmpeg = new FFmpeg();

const Home = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [settings, setSettings] = useState<ConversionSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  

  // load ffmpeg only when needed
  const loadFFmpeg = async () => {
    try {
      setIsLoading(true);
      await ffmpeg.load();
      setIsReady(true);
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    // revoke any existing object URLs to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (outputUrl) {
      URL.revokeObjectURL(outputUrl);
    }

    // reset all state variables
    setVideo(null);
    setProgress(0);
    setOutputUrl("");
    setIsProcessing(false);
    setProcessedSize(null);
    setPreviewUrl("");
    setSettings(defaultSettings);

    // reset video elements
    if (videoRef.current) {
      videoRef.current.src = "";
    }
    if (previewRef.current) {
      previewRef.current.src = "";
    }
  };

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "video/*": [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      resetState(); // reset state before setting new video
      setVideo(acceptedFiles[0]);

      // load FFmpeg if not already loaded
      if (!isReady) {
        await loadFFmpeg();
      }
    },
  });

  // create object URL for preview when video is selected
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  // update preview position based on progress
  useEffect(() => {
    if (previewRef.current && videoRef.current && isProcessing) {
      const duration = videoRef.current.duration;
      if (duration) {
        previewRef.current.currentTime = (progress / 100) * duration;
      }
    }
  }, [progress, isProcessing]);

  const compressVideo = async () => {
    if (!video || !isReady) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedSize(0);

    // write the file to memory
     await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    /**
     *   setup progress tracking
    ffmpeg.on("progress", ({ progress, time }) => {
      messageRef.current.innerHTML = `${progress * 100} % (transcoded time: ${
        time / 1000000
      } s)`;
    });
     */


    // Build FFmpeg command based on settings
    const args = ["-i", "input.mp4", "-c:v", settings.videoCodec];

    // add compression method specific arguments
    switch (settings.compressionMethod) {
      case "bitrate":
        args.push("-b:v", settings.videoBitrate);
        break;
      case "crf":
        args.push("-crf", settings.crfValue || "23");
        break;
      case "percentage":
        {
          const crf = Math.round(
            51 - (parseInt(settings.targetPercentage || "100") / 100) * 33
          );
          args.push("-crf", crf.toString());
        }
        break;
      case "filesize":
        {
          const targetBitrate = Math.round(
            (parseInt(settings.targetFileSize || "100") * 8192) /
              (videoRef.current?.duration || 60)
          );
          args.push("-b:v", `${targetBitrate}`);
        }
        break;
    }

    // add remaining settings
    args.push(
      "-c:a",
      settings.audioCodec,
      "-b:a",
      settings.audioBitrate,
      "-r",
      settings.frameRate,
      "output.mp4"
    );

    try {
      // run the FFmpeg  command
      await ffmpeg.exec([...args]);

      // read the result
      const data = await ffmpeg.readFile("output.mp4");
      const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}))

      setOutputUrl(url);
      setIsProcessing(false);
      setProgress(100);
      setProcessedSize((await data).length);

      // clean up
      await ffmpeg.writeFile("unlink", "input.mp4");
      await ffmpeg.readFile("unlink", "output.mp4");
    } catch (error) {
      console.error("Error during compression:", error);
      setIsProcessing(false);
      setProgress(0);
      setProcessedSize(null);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Video Compression</h1>
            <SettingsButton onClick={() => setShowSettings(true)} />
          </div>
          <p>
            Compress videos in the browser up to 90% for free. No upload needed
          </p>
          {video ? (
            <div
              {...getRootProps}
              className={`bg-gray-100 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative ${
                isDragAccept
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps} />
              {isLoading ? (
                <>
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
                  <p className="text-gray-600">Loading video processor</p>
                </>
              ) : (
                <>
                  <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400 " />
                  <p className="text-gray-800">
                    Drag and drop a video file here, or click select
                  </p>
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileVideo className="w-6 h-6 mr-2" />
                  <span className="font-medium">{video.name}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={resetState}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {!isProcessing && !outputUrl && (
                <Button
                  onClick={compressVideo}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!isReady}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Compress Video
                    </>
                  )}
                </Button>
              )}
              {(isProcessing || outputUrl) && (
                <div className="flex gap-4 pt-6">
                  <div className="bg-gray-50 p-5 rounded-2xl flex-1">
                    <div className="text-[0.7rem] uppercase text-gray-500">
                      Original
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                      {(video.size / (1024 * 1024)).toFixed(1)}{" "}
                      <span className="text-3xl">MB</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl flex-1">
                    <div className="text-[0.7rem] uppercase text-gray-500">
                      Compressed
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                      {processedSize
                        ? (processedSize / (1024 * 1024)).toFixed(1)
                        : "0.0"}{" "}
                      <span className="text-3xl">MB</span>
                    </div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="mt-4">
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      className="absolute inset-0 w-full h-full opacity-50"
                      muted
                    />
                    <video
                      ref={previewRef}
                      src={previewRef}
                      className="absolute inset-0 w-full h-full clip-progress"
                      style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
                      muted
                    />
                  </div>

                  <Progress value={progress} className="mb-2" />
                  <div className="text-center text-sm text-gray-600">
                    Compressing... {progress}%
                  </div>
                </div>
              )}
              {outputUrl && (
                <div className="mt-4">
                  <video
                    src={outputUrl}
                    controls
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Saved{" "}
                      {processedSize &&
                        ((1 - processedSize / video.size) * 100).toFixed(0)}
                      % of original size
                    </div>
                    <a
                      href={outputUrl}
                      download="compressed-video.mp4"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Download Compressed Video
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="text-center text-sm text-gray-600 mb-4 mt-4">
        Built by{" "}
        <a
          href="https://github.com/patrickmvla"
          className="text-gray-600 hover:text-gray-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          mvula
        </a>
      </div>
      <VideoSettings
        settings={settings}
        onSettingsChange={setSettings}
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Home;
