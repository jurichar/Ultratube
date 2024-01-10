// frontend/src/Components/Home/Home.tsx

function MovieCard() {
  return (
    <div className="flex flex-col">
      <div className="flex-shrink-0 mb-2 w-40 h-28 bg-white rounded">image</div>
      <div className="flex flex-row items-center gap-2">
        <span className="text-quinary text-xs">YYYY</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path opacity="0.75" fill-rule="evenodd" clip-rule="evenodd" d="M8.47778 0H1.52222C0.681522 0 0 0.681522 0 1.52222V8.47778C0 9.31848 0.681522 10 1.52222 10H8.47778C8.8815 10 9.26868 9.83962 9.55415 9.55415C9.83962 9.26868 10 8.8815 10 8.47778V1.52222C10 1.1185 9.83962 0.731321 9.55415 0.445849C9.26868 0.160377 8.8815 0 8.47778 0ZM2 4.5H1V3.5H2V4.5ZM2 5.5H1V6.5H2V5.5ZM9 4.5H8V3.5H9V4.5ZM9 5.5H8V6.5H9V5.5ZM9 1.37V2H8V1H8.63C8.72813 1 8.82224 1.03898 8.89163 1.10837C8.96102 1.17776 9 1.27187 9 1.37ZM2 1H1.37C1.27187 1 1.17776 1.03898 1.10837 1.10837C1.03898 1.17776 1 1.27187 1 1.37V2H2V1ZM1 8.63V8H2V9H1.37C1.27187 9 1.17776 8.96102 1.10837 8.89163C1.03898 8.82224 1 8.72813 1 8.63ZM8.63 9C8.83435 9 9 8.83435 9 8.63V8H8V9H8.63Z" fill="white" />
        </svg>
        <span className="text-quaternary text-xs ">Movie</span>
      </div>
      <span className="text-quinary">Movie Title</span>
    </div>
  );
}

function MovieCardTrending() {
  return (
    <div className="flex-shrink-0 w-60 h-32 bg-secondary rounded flex flex-col-reverse p-4">
      <span className="text-quinary">Movie Title</span>
      <div className="flex flex-row items-center gap-2">
        <span className="text-quinary text-xs">YYYY</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path opacity="0.75" fill-rule="evenodd" clip-rule="evenodd" d="M8.47778 0H1.52222C0.681522 0 0 0.681522 0 1.52222V8.47778C0 9.31848 0.681522 10 1.52222 10H8.47778C8.8815 10 9.26868 9.83962 9.55415 9.55415C9.83962 9.26868 10 8.8815 10 8.47778V1.52222C10 1.1185 9.83962 0.731321 9.55415 0.445849C9.26868 0.160377 8.8815 0 8.47778 0ZM2 4.5H1V3.5H2V4.5ZM2 5.5H1V6.5H2V5.5ZM9 4.5H8V3.5H9V4.5ZM9 5.5H8V6.5H9V5.5ZM9 1.37V2H8V1H8.63C8.72813 1 8.82224 1.03898 8.89163 1.10837C8.96102 1.17776 9 1.27187 9 1.37ZM2 1H1.37C1.27187 1 1.17776 1.03898 1.10837 1.10837C1.03898 1.17776 1 1.27187 1 1.37V2H2V1ZM1 8.63V8H2V9H1.37C1.27187 9 1.17776 8.96102 1.10837 8.89163C1.03898 8.82224 1 8.72813 1 8.63ZM8.63 9C8.83435 9 9 8.83435 9 8.63V8H8V9H8.63Z" fill="white" />
        </svg>
        <span className="text-quaternary text-xs ">Movie</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full h-max text-quinary p-4 flex flex-col items-center justify-around gap-6">
      <div className="flex flex-row items-center w-full gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.31 12.9L17.71 16.29C17.8993 16.4778 18.0058 16.7334 18.0058 17C18.0058 17.2666 17.8993 17.5222 17.71 17.71C17.5222 17.8993 17.2666 18.0058 17 18.0058C16.7334 18.0058 16.4778 17.8993 16.29 17.71L12.9 14.31C11.5025 15.407 9.77666 16.0022 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16.0022 9.77666 15.407 11.5025 14.31 12.9ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" fill="white" />
        </svg>
        <span className="text-quaternary">
          Search for movies or TV series
        </span>
      </div>
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Trending</span>
        <div className="overflow-x-auto w-full flex flex-row gap-4">
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
          <MovieCardTrending />
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-4 ">
        <span>Recommended for you</span>
        <div className="flex flex-row flex-wrap gap-5">
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
          <MovieCard />
        </div>
      </div>
    </div>
  );
}
