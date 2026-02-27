import React from 'react';

export default function Banner({ text }) {
  return (
    <div className="bg-gradient-to-r from-[#260d51] via-[#1e1558] to-[#183aa2] py-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
          {text}
        </h1>
      </div>
    </div>
  );
}
