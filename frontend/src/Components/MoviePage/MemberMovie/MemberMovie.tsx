import { useTranslation } from "react-i18next";
import { crewUser } from "../../../types";
import CardCrew from "./CardCrew/CardCrew";

interface memberMovie {
  crew: crewUser[] | undefined;
  cast: crewUser[] | undefined;
}
export default function MemberMovie(memberMovie: memberMovie) {
  const { t } = useTranslation();
  const { crew, cast } = memberMovie;
  return (
    <div className="w-10/12 md:w-10/12">
      {cast && cast?.length > 0 && (
        <div className=" w-full ">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">{t("cast")}</h1>
          <ul className="flex w-full overflow-scroll flex-row gap-4 ">
            {cast?.map((elem, index) => (
              <CardCrew key={index} {...elem} />
            ))}
          </ul>
        </div>
      )}
      {crew && crew?.length > 0 && (
        <div className=" w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">{t("crew")}</h1>
          <ul className="flex w-full overflow-scroll flex-row gap-4 ">
            {crew?.map((elem: crewUser, index: number) => (
              <CardCrew key={index} {...elem} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
