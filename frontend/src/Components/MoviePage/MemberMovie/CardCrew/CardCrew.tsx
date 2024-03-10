import { crewUser } from "../../../../types";

export default function CardCrew(crewUser: crewUser) {
  return (
    <div className=" lg:w-2/12 md:w-4/12 flex-shrink-0 bg-white rounded p-6 text-center">
      <h1 className="font-bold"> {crewUser.name}</h1>
      <h2 className="text-secondary"> {crewUser.character}</h2>
      <h3 className=""> {crewUser.known_for_department}</h3>
      <div className="mt-8 border-zinc-200">{!crewUser.profile_path ? <div className="bg-white "> ? </div> : <img className="m-auto" src={crewUser.profile_path} />}</div>
    </div>
  );
}
