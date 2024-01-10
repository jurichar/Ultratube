// frontend/src/Components/Root/Root.tsx

import React, { useEffect } from 'react';
import locomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

export default function Root() {
  useEffect(() => {
    const scroll = new locomotiveScroll({
      el: document.querySelector('#your-scroll-container'), // Replace with your actual scroll container selector
      smooth: true,
    });
    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div id="your-scroll-container" className="bg-primary flex-1 overflow-y-auto pt-16">
        <Outlet />
      </div>
    </div>
  );
}
