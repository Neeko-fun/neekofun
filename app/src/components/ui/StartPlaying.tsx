import React from "react";

const cards = [
  {
    title: "Sports",
    img: "/sports-placeholder.png",
    alt: "Sports",
  },
  {
    title: "Trending",
    img: "/nba-placeholder.png",
    alt: "NBA Trending",
  },
  {
    title: "Casino",
    img: "/casino-placeholder.png",
    alt: "Casino",
  },
];

const StartPlaying = () => (
  <section>
    <h2 className="text-2xl font-bold mb-4">Start playing</h2>
    <p className="mb-6 text-gray-300">Choose what you want to play from products below powered by Dexsport. Explore and join Web3 sport betting and fast crypto games.</p>
    <div className="flex gap-6 flex-wrap justify-center">
      {cards.map((card) => (
        <div key={card.title} className="bg-[#232136] rounded-xl shadow-lg p-6 flex flex-col items-center w-64 hover:scale-105 transition cursor-pointer">
          <div className="w-32 h-20 bg-gray-700 rounded mb-4 flex items-center justify-center">
            {/* Replace with <Image /> if you have real images */}
            <span className="text-lg text-gray-400">{card.title} Img</span>
          </div>
          <span className="text-xl font-semibold">{card.title}</span>
        </div>
      ))}
    </div>
  </section>
);

export default StartPlaying; 