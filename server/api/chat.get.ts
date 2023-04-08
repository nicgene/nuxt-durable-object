import { DurableObjectNamespace } from "@cloudflare/workers-types";

export default defineEventHandler(async (event) => {
  const { env } = event.context as { env: { CHAT: DurableObjectNamespace } };
  const id = env.CHAT.idFromName(new URL(getRequestURL(event)).pathname);
  const chat = env.CHAT.get(id);
});
