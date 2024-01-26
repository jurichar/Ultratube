// Loading.tsx

export default function Loading() {
    return (
        <div className="absolute w-full h-full bg-quaternary bg-opacity-50 flex justify-center items-center z-10 rounded">
            <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
        </div>
    );
}