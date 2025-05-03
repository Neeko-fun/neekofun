'use client';
import React, { useState } from "react";

interface Event {
  name: string;
  time: string;
  odds: string;
}

const events: Record<"Live" | "Top events", Event[]> = {
  Live: [
    { name: "Football: Real Madrid vs Barcelona", time: "Live", odds: "1.8 | 2.1 | 3.0" },
    { name: "Tennis: Nadal vs Federer", time: "Live", odds: "1.5 | 2.5" },
    { name: "Tennis: Nadal vs Federer", time: "Live", odds: "1.5 | 2.5" },
    { name: "Tennis: Nadal vs Federer", time: "Live", odds: "1.5 | 2.5" },
    { name: "Tennis: Nadal vs Federer", time: "Live", odds: "1.5 | 2.5" },
  ],
  "Top events": [
    { name: "Basketball: Lakers vs Celtics", time: "Tomorrow", odds: "1.9 | 2.0" },
    { name: "MMA: McGregor vs Khabib", time: "Saturday", odds: "2.2 | 1.7" },
  ],
};

const tabs = ["Live", "Top events"] as const;
type Tab = typeof tabs[number];

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Live");
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 font-minecraft">Events</h2>
      <div className="flex gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 pixel-shadow shadow-white font-semibold transition border-2 font-minecraft ${
              activeTab === tab
                ? "bg-purple-600 border-purple-400 text-white"
                : "bg-[#232136] border-gray-700 text-gray-300 hover:bg-purple-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {events[activeTab].map((event: Event, idx: number) => (
          <div key={idx} className="font-minecraft bg-[#232136] pixel-border p-4 shadow flex flex-col gap-2">
            <span className="font-semibold text-lg">{event.name}</span>
            <span className="text-xs text-gray-400">{event.time}</span>
            <span className="text-sm mt-2">Odds: <span className="font-mono text-purple-300">{event.odds}</span></span>
            <button className="mt-2 pixel-border text-white px-4 py-2 font-semibold shadow hover:scale-105 hover:bg-purple-600 transition w-max cursor-pointer">Bet Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsSection; 