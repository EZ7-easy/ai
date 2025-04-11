// utils/sendPrompt.ts

interface SendPromptProps {
  prompt: string;
  allowedTopics: string[];
}

export const sendPrompt = async ({
  prompt,
  allowedTopics,
}: SendPromptProps) => {
  const isEducational = (text: string) => {
    return allowedTopics.some((topic) => text.toLowerCase().includes(topic));
  };

  if (!isEducational(prompt)) {
    return { error: "Only educational questions are allowed." };
  }

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const message = data.choices?.[0]?.message?.content;
    return { response: message || "No response" };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong" };
  }
};
