import Pusher from "pusher-js";

// These should be set in your .env file
const key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

export const pusherClient = new Pusher(key, {
  cluster,
  forceTLS: true,
});

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

export function subscribeToForumTopics(callback: (data: ForumTopic) => void) {
  const channel = pusherClient.subscribe("forum-topics");
  channel.bind("new-topic", callback);
  return () => {
    channel.unbind("new-topic", callback);
    pusherClient.unsubscribe("forum-topics");
  };
}

// Marginalia types
export type Marginalia = {
  id: string;
  content: string;
  timestamp: number;
  pseudonym: string;
  isArtist: boolean;
  createdAt: string;
  parentId: string | null;
};

export function subscribeToMarginalia(
  trackId: string,
  onNew: (data: Marginalia) => void,
  onDeleted: (data: { marginaliaId: string }) => void
) {
  const channel = pusherClient.subscribe(`marginalia-${trackId}`);
  channel.bind("new-marginalia", onNew);
  channel.bind("marginalia-deleted", onDeleted);

  return () => {
    channel.unbind("new-marginalia", onNew);
    channel.unbind("marginalia-deleted", onDeleted);
    pusherClient.unsubscribe(`marginalia-${trackId}`);
  };
}
