import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, status } = await req.json();

    const lastUserMessage = messages
      ?.filter((m: { role: string }) => m.role === "user")
      .pop()?.content;

    const applicationStatus = status || "Pending";

    const prompt = `You are an AI assistant helping a student who applied for LIT School.
Their current application status is: ${applicationStatus}.
Be helpful, friendly, and concise. If you don't know something, say so.

Student question: ${lastUserMessage}`;

    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error("Missing OpenAI API key");
      return NextResponse.json(
        {
          reply:
            "Sorry, the AI service is currently unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        {
          reply:
            "Sorry, I'm having trouble connecting to my brain. Please try again later.",
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not understand that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      {
        reply:
          "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
