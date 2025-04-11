import { IMessage } from "@/app.types";
import FillLoading from "@/components/shared/fill-loading";
import NoResult from "@/components/shared/no-result";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { prompSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

function Ask() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const form = useForm<z.infer<typeof prompSchema>>({
    resolver: zodResolver(prompSchema),
    defaultValues: { prompt: "" },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof prompSchema>) => {
    try {
      const userMessage = { role: "user", content: values.prompt };
      const response = await axios.post("/api/ask", {
        messages: [...messages, userMessage],
      });
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "system", content: response.data },
      ]);
    } catch {
      toast.error("Error sending message");
    } finally {
      form.reset();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <NoResult
              title={"How Can I Help You?"}
              description={"Ask me anything or request an essay on any topic!"}
            />
          </div>
        ) : (
          messages.map((item, index) => (
            <div
              key={`${index}-${item.content.substring(0, 10)}`}
              className={cn(
                "flex gap-3 rounded-lg",
                item.role === "user"
                  ? "bg-blue-100 justify-end p-1"
                  : "bg-gray-50 p-4"
              )}
            >
              <div
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-full overflow-hidden",
                  item.role === "user" ? "text-right" : "text-left"
                )}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl font-bold mt-2 mb-3" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-semibold mt-2 mb-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base font-medium mt-1 mb-1"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="my-2 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-5 my-2" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600 dark:text-gray-400"
                        {...props}
                      />
                    ),
                    pre: ({ node, ...props }) => (
                      <div className="my-3 w-full overflow-auto rounded-lg bg-gray-200 dark:bg-gray-700 p-3">
                        <pre className="text-sm" {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="rounded-md bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-sm font-mono"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3">
                        <table
                          className="min-w-full border-collapse"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border px-3 py-2 text-left bg-gray-100 dark:bg-gray-700"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border px-3 py-2" {...props} />
                    ),
                  }}
                >
                  {item.content || ""}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isLoading && <FillLoading />}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormControl className="flex-1">
                  <Input
                    className="flex-1 shadow-sm"
                    disabled={isLoading}
                    placeholder="Send a message..."
                    {...field}
                  />
                </FormControl>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              size="icon"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                type="button"
                disabled={isLoading}
                size="icon"
                variant="destructive"
                className="bg-red-500 text-white"
                onClick={() => setMessages([])}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Ask;
