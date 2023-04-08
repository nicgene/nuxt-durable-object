import { DurableObjectNamespace } from "@cloudflare/workers-types";

export default defineEventHandler(async (event) => {
  const { env } = event.context as { env: { CHAT: DurableObjectNamespace } };
  const id = env.CHAT.idFromName(new URL(getRequestURL(event)).pathname);
  const chat = env.CHAT.get(id);
  const newRequest = new Request(getRequestURL(event));
  // @ts-ignore https://github.com/cloudflare/workers-sdk/issues/2787
  const response = await chat.fetch(newRequest);

  return await response.text()
});
