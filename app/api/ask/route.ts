import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Get the last user message
    const lastUserMessage = messages.findLast(
      (msg: any) => msg.role === "user"
    );

    // Check if the message is about English
    if (!lastUserMessage?.content.toLowerCase().includes("english")) {
      return new NextResponse(
        "This endpoint only handles English-related requests and questions and essays , texts",
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an English language expert. Only respond to questions about English language, grammar, vocabulary, or related topics.",
        },
        ...messages,
      ],
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (error) {
    console.error("[ENGLISH_API_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
