export default function ViewMovieExt() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-white text-center">WATCH BIG BUCK BUCKET IN MKV </h1>
      <div className="m-auto w-fit ">
        <video id="videoPlayer" controls>
          <source src={`http://localhost:8001/big-buck-buck-mkv`} type="video/mp4" />
        </video>
      </div>
      hello
    </div>
  );
}
