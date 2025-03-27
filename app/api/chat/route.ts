import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type Message } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

    // check if user has sent a PDF
    const messagesHavePDF = messages.some(message =>
      message.experimental_attachments?.some(
        a => a.contentType === 'application/pdf',
      ),
    );

  const result = streamText({
    model: messagesHavePDF ?
      anthropic('claude-3-5-sonnet-latest') : openai('gpt-4o'),
    system:
      "Pretend you are an accountant. You will answer questions about W-2 forms, standard deductions, filing statuses, etc.",
    messages,
  });

  return result.toDataStreamResponse();
}
