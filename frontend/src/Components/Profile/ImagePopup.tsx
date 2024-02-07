// src/Components/Profile/ImagePopup.tsx

import { UserData } from "../../types";

// all images in assets/images/*.svg
const ImagesUrl = [
  "./src/assets/profiles/1.svg",
  "./src/assets/profiles/2.svg",
  "./src/assets/profiles/3.svg",
  "./src/assets/profiles/4.svg",
  "./src/assets/profiles/5.svg",
  "./src/assets/profiles/6.svg",
];

interface ImagePopupProps {
  user: UserData;
  setShowImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ setShowImagePopup, setSelectedImage }) => {
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowImagePopup(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="w-96 h-96 bg-tertiary rounded flex flex-col justify-center items-center gap-6">
        <h1 className="text-quinary text-heading-md">Choose your avatar</h1>
        <div className="w-full h-80 flex flex-wrap justify-center items-center gap-6 overflow-y-auto">
          {ImagesUrl.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Avatar ${index + 1}`} className="w-16 h-16 cursor-pointer" onClick={() => handleImageClick(imageUrl)} />
          ))}
        </div>
        <button className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-quinary hover:text-tertiary" onClick={() => setShowImagePopup(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;
