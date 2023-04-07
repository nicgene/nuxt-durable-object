export class Chat {
  constructor(state: any, env: any) {}

  async fetch(request: any) {
    return new Response("Hello World! From: DurableObject");
  }
}
