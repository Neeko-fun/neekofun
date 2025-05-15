import { Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { CONNECTION } from "./constants";

export interface EventFormData {
  name: string;
  description: string;
  time: string;
  odds: string;
  category: string;
}

export interface Event extends EventFormData {
  id: string;
  creator: string;
  createdAt: string;
  signature: string;
}

// Function to create a new event
export const createEvent = async (
  formData: EventFormData,
  publicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<Event> => {
  // Create an event ID
  const eventId = Keypair.generate().publicKey.toBase58();
  
  // Create transaction for signature verification
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey, // Sending to self (0 SOL)
      lamports: 0,
    })
  );
  
  // Set recent blockhash and sign transaction
  transaction.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;
  transaction.feePayer = publicKey;
  
  const signedTransaction = await signTransaction(transaction);
  const signature = signedTransaction.signatures.find(
    (sig) => sig.publicKey.equals(publicKey)
  );

  // Create new event object
  const newEvent: Event = {
    id: eventId,
    ...formData,
    creator: publicKey.toBase58(),
    createdAt: new Date().toISOString(),
    signature: signature?.signature?.toString('base64') || '',
  };

  return newEvent;
};

// Function to save event to local storage
export const saveEvent = (event: Event): void => {
  const existingEvents = getEvents();
  localStorage.setItem("events", JSON.stringify([...existingEvents, event]));
};

// Function to get all events from local storage
export const getEvents = (): Event[] => {
  try {
    return JSON.parse(localStorage.getItem("events") || "[]");
  } catch (error) {
    console.error("Error parsing events from localStorage:", error);
    return [];
  }
};

// Function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  const events = getEvents();
  return events.find(event => event.id === id);
};

// Function to get events created by a specific user
export const getEventsByCreator = (creatorPublicKey: string): Event[] => {
  const events = getEvents();
  return events.filter(event => event.creator === creatorPublicKey);
};

// Function to get events by category
export const getEventsByCategory = (category: string): Event[] => {
  const events = getEvents();
  return events.filter(event => event.category === category);
};

// Function to verify event signature
export const verifyEventSignature = (event: Event, creatorPublicKey: string): boolean => {
  // In a real application, this would perform cryptographic verification
  // For this example, we just check if signature exists and creator matches
  return !!event.signature && event.creator === creatorPublicKey;
}; 