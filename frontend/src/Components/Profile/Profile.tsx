export default function Profile() {
  return (
    <div className="w-full p-14 gap-10 overflow-y-auto flex flex-col items-center justify-around">
      <h1 className="text-quinary text-heading-lg">Profile</h1>
      <div className="w-60 h-60 bg-quinary rounded-full"></div>
      <div className="w-full h-14 rounded bg-quinary"></div>
      <div className="w-full h-14 rounded bg-secondary"></div>
      <div className="w-full h-96 rounded p-4 flex flex-col items-center justify-around bg-tertiary">
        <div className="w-full pl-2 h-7 border-b border-quaternary">
          <span className="text-quaternary">username</span>
        </div>
        <div className="w-full pl-2 h-7 border-b border-quaternary">
          <span className="text-quaternary">last name</span>
        </div>
        <div className="w-full pl-2 h-7 border-b border-quaternary">
          <span className="text-quaternary">first name</span>
        </div>
        <div className="w-full pl-2 h-7 border-b border-quaternary">
          <span className="text-quaternary">mail address</span>
        </div>
        <div className="w-full pl-2 h-7 border-b border-quaternary">
          <span className="text-quaternary">favorite language</span>
        </div>
        <div className="w-full h-10 rounded bg-quinary"></div>
      </div>
    </div >
  );
}
