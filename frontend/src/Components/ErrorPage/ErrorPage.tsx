// src/Components/ErrorPage/ErrorPage.tsx

import React from "react";

const ErrorPage: React.FC<{ errorCode?: number }> = ({ errorCode = 404 }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary">
      <h2 className="text-5xl font-bold text-quaternary mb-4">{`Error ${errorCode}`}</h2>
      <h3 className="text-3xl font-semibold text-secondary">Page not found</h3>
      <button className="mt-4 bg-tertiary text-quaternary px-4 py-2 rounded hover:opacity-50 transition-all"
        onClick={() => window.location.href = "/"}>
        Go back home
      </button>
    </div>
  );
};

export default ErrorPage;
