import { toast } from "sonner";
import { useState } from "react";
import ReactDropzone from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Projector } from "lucide-react";

interface Props {
  handleUpload: (files: File) => void;
  acceptedFIles: { [key: string]: string[] };
  disabled?: boolean;
}

export const CustomDropZone = ({
  acceptedFIles,
  handleUpload,
  disabled,
}: Props) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);

  const onDrop = (file: File[]) => {
    handleUpload(file[0]);
    handleExitHover();
  };
  const onDropRejected = () => {
    handleExitHover();
    toast.error("Error uploading your file(s)", {
      description: "Allowed Files: Audio, Video and Images.",
      duration: 5000,
    });
  };
  const onError = () => {
    handleExitHover();
    toast.error("Error uploading your file(s)", {
      description: "Allowed Files: Audio, Video, Images",
      duration: 5000,
    });
  };

  return (
    <ReactDropzone
      disabled={disabled}
      onDrop={onDrop}
      onDragEnter={handleHover}
      onDragLeave={handleExitHover}
      accept={acceptedFIles}
      onDropRejected={onDropRejected}
      multiple={false}
      onError={onError}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={`${
            isHover ? "border-black bg-gray-100/80" : "border-default-gray"
          } flex justify-center items-center flex-col cursor-pointer w-full py-6 ${
            disabled ? "cursor-not-allowed" : ""
          }`}
        >
          <Input {...getInputProps()} />
          <Projector className="w-24 h-24" />
          <h3 className="text-center mt-5">
            click to select video <br /> or <br /> drag and drop video
          </h3>
        </div>
      )}
    </ReactDropzone>
  );
};
