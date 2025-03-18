import CompressVideo from "@/modules/video/components/compress";

const VideoPage = () => {
  return (
    <div className="max-w-5xl mx-auto pt-32">
      <div className="lg:grid lg:grid-cols-8 gap-10 lg:h-[calc(100dvh-130px)] pb-10 px-6 lg:px-0 flex flex-col">
        <CompressVideo />
      </div>
    </div>
  );
};

export default VideoPage;
