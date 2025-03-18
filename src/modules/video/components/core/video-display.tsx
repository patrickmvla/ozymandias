interface Props {
  videoUrl: string;
}

export const VideoDisplay = ({ videoUrl }: Props) => {
  return (
    <video
      id="compress-video-player"
      className="h-full w-full rounded-3xl"
      controls
    >
      <source src={videoUrl} type="video/mp4" />
      your browser does not support the video tag
    </video>
  );
};
