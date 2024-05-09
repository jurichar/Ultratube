import { useTranslation } from "react-i18next";

type TrailerProps = {
  linkEmbed: string;
};
export default function TrailerSection(props: TrailerProps) {
  const { t } = useTranslation();
  const { linkEmbed } = props;

  return (
    <div className=" w-8/12 md:w-6/12 flex flex-col  gap-6 justify-center items-center">
      <h1 className="text-4xl font-bold text-white">{t("Trailer")}</h1>
      <iframe
        className="w-full aspect-video"
        src={`https://www.youtube.com/embed/${linkEmbed}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
