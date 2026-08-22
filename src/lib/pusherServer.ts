import Pusher from "pusher";

// Realtime is a nicety layered on top of the wall, never a condition of
// it. The server client only exists when every credential is present,
// and a failed broadcast is logged rather than surfaced — otherwise a
// missing PUSHER_APP_ID turns every pinned note into a 500 after the
// row has already been written.
function createPusherServer(): Pusher | null {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!appId || !key || !secret || !cluster) return null;
  return new Pusher({ appId, key, secret, cluster, useTLS: true });
}

export const pusherServer = createPusherServer();

async function broadcast(
  channel: string,
  event: string,
  payload: unknown,
): Promise<void> {
  if (!pusherServer) return;
  try {
    await pusherServer.trigger(channel, event, payload);
  } catch (error) {
    console.warn(`[pusher] ${channel}/${event} not broadcast`, error);
  }
}

export function triggerNewForumTopic(topic: unknown): Promise<void> {
  return broadcast("forum-topics", "new-topic", topic);
}

export function triggerNewForumReply(
  topicId: string,
  reply: unknown,
): Promise<void> {
  return broadcast(`forum-replies-${topicId}`, "new-reply", reply);
}
