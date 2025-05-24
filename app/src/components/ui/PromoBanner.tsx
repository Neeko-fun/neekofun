"use client";

import React from "react";

const PromoBanner = () => (
  <div className="w-full flex gap-4 overflow-x-auto pb-2">
    <div className="min-w-[340px] bg-gradient-to-r from-purple-700 to-purple-400 rounded-xl p-6 flex flex-col justify-between shadow-lg">
      <h2 className="text-xl font-bold mb-2">
        Join the Dexsport Bonus <span className="text-pink-300">Club</span>
      </h2>
      <p className="text-sm mb-4">
        Get exclusive rewards and bonuses by joining our club!
      </p>
      <button className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-100 transition">
        Join Now
      </button>
    </div>
    <div className="min-w-[340px] bg-gradient-to-r from-green-500 to-blue-400 rounded-xl p-6 flex flex-col justify-between shadow-lg">
      <h2 className="text-xl font-bold mb-2">
        Leave a review on{" "}
        <span className="text-white bg-green-600 px-2 py-1 rounded">
          Trustpilot
        </span>
      </h2>
      <p className="text-sm mb-4">Share your opinion and help us grow!</p>
      <button className="bg-white text-green-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-green-100 transition">
        Read more
      </button>
    </div>
  </div>
);

export default PromoBanner;
