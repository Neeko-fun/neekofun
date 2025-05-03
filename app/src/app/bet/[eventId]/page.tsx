"use client"
import { useParams } from "next/navigation";
import React from "react";

// Mock event data for demo
const events = [
  {
    id: "1",
    name: "Football: Real Madrid vs Barcelona",
    time: "Live",
    odds: [1.8, 2.1, 3.0],
  },
  // ...other events
];

export default function BetDetailsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const event = events.find(e => e.id === eventId) || events[0]; // fallback for demo

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex flex-col items-center py-8">
      <div className="pixel-border bg-[#23263A] p-8 w-full max-w-lg shadow-lg">
        <h1 className="font-minecraft text-2xl mb-4">{event.name}</h1>
        <div className="text-gray-400 mb-2">{event.time}</div>
        <div className="mb-4">
          <span className="font-minecraft">Odds: </span>
          {event.odds.map((odd, idx) => (
            <span key={idx} className="text-purple-200 font-minecraft mx-2">
              {odd}
              {idx < event.odds.length - 1 && " | "}
            </span>
          ))}
        </div>
        {/* Add more betting details, forms, etc. here */}
        <button className="pixel-border bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft px-6 py-3 transition">
          Place Bet
        </button>
      </div>
    </div>
  );
}