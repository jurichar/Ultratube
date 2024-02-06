// src/Components/Profile/ImagePopup.tsx

import { User } from "../../types";
import { useTranslation } from "react-i18next";

// all images in assets/images/*.svg
const ImagesUrl = [
  "./src/assets/profiles/1.svg",
  "./src/assets/profiles/2.svg",
  "./src/assets/profiles/3.svg",
  "./src/assets/profiles/4.svg",
  "./src/assets/profiles/5.svg",
  "./src/assets/profiles/6.svg",
  "./src/assets/profiles/7.svg",
  "./src/assets/profiles/8.svg",
  "./src/assets/profiles/9.svg",
  "./src/assets/profiles/10.svg",
  "./src/assets/profiles/11.svg",
  "./src/assets/profiles/12.svg",
];

interface ImagePopupProps {
  user: User;
  setShowImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ setShowImagePopup, setSelectedImage }) => {
  const { t } = useTranslation();
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowImagePopup(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 flex justify-center items-center px-4">
      <div className="w-96 h-96 bg-tertiary rounded flex flex-col justify-center items-center gap-6 p-4">
        <h1 className="text-quinary text-heading-md">{t('chooseAvatar')}</h1>
        <div className="w-full h-80 flex flex-wrap justify-center items-center gap-6 overflow-y-auto p-4">
          {ImagesUrl.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Avatar ${index + 1}`}
              className="w-16 h-16 cursor-pointer hover:scale-105 outline outline-transparent outline-4 hover:outline-white rounded-full transition-all"
              onClick={() => handleImageClick(imageUrl)}
            />
          ))}
        </div>
        <button
          className="w-32 h-12 transition-all bg-quaternary text-quinary rounded-full hover:bg-quinary hover:text-tertiary"
          onClick={() => setShowImagePopup(false)}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;