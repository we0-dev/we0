import { Messages } from "./action";
import { hasEnoughTokens } from "@/utils/tokens";
import { handleChatMode } from "./handlers/chatHandler";
import { handleBuilderMode } from "./handlers/builderHandler";

enum ChatMode {
  Chat = 'chat',
  Builder = 'builder'
}

interface ChatRequest {
  messages: Messages;
  model: string;
  mode: ChatMode;
}

export async function POST(request: Request) {
  try {
    const { messages, model, mode = ChatMode.Builder } = (await request.json()) as ChatRequest;
    const userId = request.headers.get("userId");

    if (userId && !(await hasEnoughTokens(userId))) {
      return new Response("tokens not enough", { status: 401 });
    }

    return mode === ChatMode.Chat
      ? await handleChatMode(messages, model, userId)
      : await handleBuilderMode(messages, model, userId);

  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message?.includes("API key")) {
      return new Response("Invalid or missing API key", { status: 401 });
    }
    return new Response(null, { status: 500 });
  }
}
 