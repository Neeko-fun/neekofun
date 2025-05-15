"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Event, getEvents, getEventsByCategory, getEventsByCreator } from "@/lib/event-service";

export default function EventsPage() {
  const { publicKey } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load events from local storage
    const loadEvents = () => {
      try {
        setEvents(getEvents());
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Set up storage event listener to update when storage changes
    const handleStorageChange = () => {
      loadEvents();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get filtered events based on selected filter
  const getFilteredEvents = () => {
    if (filter === "all") return events;
    if (filter === "mine" && publicKey) return getEventsByCreator(publicKey.toBase58());
    return getEventsByCategory(filter);
  };

  const filteredEvents = getFilteredEvents();

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        // Handle ISO string
        return new Date(dateString).toLocaleString();
      } else {
        // Handle datetime-local format
        return new Date(dateString).toLocaleString();
      }
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#050817] text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-minecraft">Events</h1>
          <Link href="/events/create">
            <button className="pixel-border bg-purple-600 text-white px-4 py-2 font-semibold shadow hover:bg-purple-700 transition font-minecraft">
              Create Event
            </button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
            {["all", "mine", "sport", "esports", "crypto", "other"].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 pixel-shadow shadow-white font-semibold transition border-2 whitespace-nowrap font-minecraft ${
                  filter === category
                    ? "bg-purple-600 border-purple-400 text-white"
                    : "bg-[#232136] border-gray-700 text-gray-300 hover:bg-purple-900"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-minecraft">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-10 bg-[#232136] pixel-border">
            <p className="text-lg font-minecraft">No events found</p>
            {filter === "mine" && (
              <p className="mt-2 text-gray-400">
                Create your own event to see it here
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="font-minecraft bg-[#232136] pixel-border p-4 shadow flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-lg">{event.name}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-200">
                    {event.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-2">
                  {event.description || "No description provided"}
                </p>
                
                <div className="mt-2 text-xs text-gray-400">
                  {formatDate(event.time)}
                </div>
                
                <div className="mt-1">
                  <span className="text-sm">Odds: <span className="font-mono text-purple-300">{event.odds}</span></span>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Created by: {event.creator.slice(0, 4)}...{event.creator.slice(-4)}
                </div>
                
                <Link href={`/bet/${event.id}`} className="mt-auto">
                  <button className="mt-2 pixel-border bg-purple-600 text-white px-4 py-2 font-semibold shadow hover:bg-purple-700 transition w-full">
                    Bet Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 