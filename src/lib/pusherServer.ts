import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export function triggerNewForumTopic(topic: unknown): Promise<unknown> {
  return pusherServer.trigger(
    "forum-topics",
    "new-topic",
    topic,
  ) as Promise<unknown>;
}

export function triggerNewForumReply(
  topicId: string,
  reply: unknown,
): Promise<unknown> {
  return pusherServer.trigger(
    `forum-replies-${topicId}`,
    "new-reply",
    reply,
  ) as Promise<unknown>;
}

// Marginalia events
export function triggerNewMarginalia(
  trackId: string,
  marginalia: unknown,
): Promise<unknown> {
  return pusherServer.trigger(
    `marginalia-${trackId}`,
    "new-marginalia",
    marginalia,
  ) as Promise<unknown>;
}

export function triggerMarginaliaDeleted(
  trackId: string,
  marginaliaId: string,
): Promise<unknown> {
  return pusherServer.trigger(
    `marginalia-${trackId}`,
    "marginalia-deleted",
    { marginaliaId },
  ) as Promise<unknown>;
}
