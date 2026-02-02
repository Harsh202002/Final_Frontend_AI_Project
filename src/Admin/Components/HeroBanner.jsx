import React from "react";
import heroImage from "../../assets/Frame.png"; // Ensure you have an appropriate image in this path

export default function HeroBanner() {
  // Static Data
  const user = {
    name: "Seema",
    role: "HR Manager",
  };

  const now = new Date();

  const currentDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div
      className="rounded-2xl p-10 text-white relative overflow-hidden min-h-[320px] bg-cover bg-right md:bg-center flex items-center"
      style={{
        // Replace with your actual path to the uploaded image
        backgroundImage: `url(${heroImage})`,
        backgroundColor: "#b026ff", // Fallback color matching the image
      }}
    >
      {/* Content Container */}
      <div className="relative z-10 max-w-md lg:max-w-xl">
        <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">
          {currentDate}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          {getGreeting()}, <br />
          <span className="text-white">{user.name}!</span>
        </h1>
        <p className="text-lg opacity-95 leading-relaxed">
          Manage your hiring smoothly as a <span className="font-semibold">{user.role}</span> with smarter controls
          and happy workflows.
        </p>
      </div>

      {/* Subtle overlay to ensure text readability if the image is too bright */}
      <div className="absolute inset-0 bg-black opacity-5 md:hidden" />
    </div>
  );
}