import { DurableObjectNamespace } from "@cloudflare/workers-types";

export default defineEventHandler(async (event) => {
  const { env } = event.context as { env: { CHAT: DurableObjectNamespace } };
  let id = env.CHAT.idFromName(new URL(getRequestURL(event)).pathname);
  let chat = env.CHAT.get(id);
  return await chat.fetch("/chat");
});
