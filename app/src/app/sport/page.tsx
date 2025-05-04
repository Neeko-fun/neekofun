import React from "react";
import Link from "next/link";

const sports = [
  "Football",
  "Tennis",
  "Basketball",
  "Ice Hockey",
  "Baseball",
  "Cricket",
  "eSports",
];

const matches = [
  {
    league: "England. Premier League",
    games: [
      {
        id: "1",
        teams: ["Aston Villa", "Fulham"],
        time: "May 3 · 19:30",
        odds: [1.80, 3.83, 4.43],
      },
      {
        id: "2",
        teams: ["Leicester", "Southampton"],
        time: "May 3 · 22:00",
        odds: [2.46, 3.56, 2.83],
      },
    ],
  },
  {
    league: "Championship of Japan. J-League 1",
    games: [
      {
        teams: ["Sanfrece Hiroshima", "Avispa Fukuoka"],
        time: "Half 2 · 64' LIVE",
        odds: [2.50, 2.00, 5.92],
      },
    ],
  },
];

export default function SportPage() {
  return (
    <div className="min-h-screen bg-[#181B23] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-[#23263A] flex flex-col gap-4">
        <div className="text-lg font-bold mb-2">Sports</div>
        <ul className="flex flex-col gap-2">
          {sports.map((sport) => (
            <li
              key={sport}
              className="pixel-border bg-[#23263A] px-4 py-2 cursor-pointer hover:bg-[#2C2F3A] transition-colors"
            >
              {sport}
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-auto">
        {matches.map((match) => (
          <section key={match.league} className="mb-8">
            <div className="text-md font-bold mb-4">{match.league}</div>
            <div className="flex flex-col gap-4">
              {match.games.map((game, idx) => (
                <div
                  key={idx}
                  className="pixel-border-white bg-[#9b87f5] text-white flex items-center justify-between px-6 py-4 shadow-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-minecraft text-lg mb-1">
                      {game.teams[0]} <span className="text-pixel-gray-medium">vs</span> {game.teams[1]}
                    </span>
                    <span className="text-xs text-pixel-gray-light">{game.time}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    {game.odds.map((odd, i) => (
                      <div
                        key={i}
                        className="bg-[#222] px-4 py-2 rounded font-minecraft text-lg pixel-border"
                      >
                        {odd}
                      </div>
                    ))}
                    <Link href={`/bet/${game.id ?? idx}`}>
                      <button className="ml-4 pixel-border bg-green-600 hover:bg-green-700 text-white font-minecraft px-4 py-2 transition">
                        Select Bet
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}