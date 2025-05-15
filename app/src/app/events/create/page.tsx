"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomWalletButton } from "@/components/WalletConnect";
import { createEvent, saveEvent, EventFormData } from "@/lib/event-service";

export default function CreateEventPage() {
  const { publicKey, signTransaction, connected } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    time: "",
    odds: "",
    category: "sport",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey || !signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the event service to create and save the event
      const newEvent = await createEvent(formData, publicKey, signTransaction);
      saveEvent(newEvent);

      toast.success("Event created successfully!");
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050817] text-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-minecraft">Create New Event</h1>
          {!connected && <CustomWalletButton />}
        </div>

        {connected ? (
          <form onSubmit={handleCreateEvent} className="bg-[#232136] pixel-border p-6 shadow">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-minecraft">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 font-minecraft">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white resize-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="time" className="block mb-2 font-minecraft">
                Event Time
              </label>
              <input
                type="datetime-local"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="odds" className="block mb-2 font-minecraft">
                Odds (format: "1.8 | 2.1 | 3.0")
              </label>
              <input
                type="text"
                id="odds"
                name="odds"
                value={formData.odds}
                onChange={handleInputChange}
                required
                placeholder="1.8 | 2.1 | 3.0"
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block mb-2 font-minecraft">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white"
              >
                <option value="sport">Sport</option>
                <option value="esports">Esports</option>
                <option value="crypto">Crypto</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 pixel-border bg-purple-600 text-white px-6 py-3 font-semibold shadow hover:bg-purple-700 transition w-full font-minecraft ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create Event"}
            </button>
          </form>
        ) : (
          <div className="bg-[#232136] pixel-border p-6 shadow text-center">
            <p className="text-lg mb-4 font-minecraft">Connect your wallet to create an event</p>
          </div>
        )}
      </main>
    </div>
  );
} 