"use client";

import Pusher from "pusher-js";

// Realtime is a nicety on the client as on the server: with no key the
// wall simply does not update live, instead of throwing during import
// and taking the whole square down with it.
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

let client: Pusher | null = null;
function getClient(): Pusher | null {
  if (typeof window === "undefined" || !key || !cluster) return null;
  client ??= new Pusher(key, { cluster, forceTLS: true });
  return client;
}

// Define ForumTopic type (should match your backend)
export type ForumTopic = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { name: string | null; username: string | null } | null;
  _count: { replies: number };
};

// Bind one handler to one event on one channel; the returned function
// unbinds and unsubscribes. A no-op when realtime is not configured.
export function subscribe<T>(
  channelName: string,
  event: string,
  callback: (data: T) => void,
): () => void {
  const pusher = getClient();
  if (!pusher) return () => undefined;
  const channel = pusher.subscribe(channelName);
  channel.bind(event, callback);
  return () => {
    channel.unbind(event, callback);
    pusher.unsubscribe(channelName);
  };
}

export function subscribeToForumTopics(callback: (data: ForumTopic) => void) {
  return subscribe<ForumTopic>("forum-topics", "new-topic", callback);
}
