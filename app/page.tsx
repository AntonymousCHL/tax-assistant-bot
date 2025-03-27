"use client";

import {
  AttachmentIcon,
  BotIcon,
  UserIcon,
} from "@/components/icons";
import { useChat } from "@ai-sdk/react";
import { DragEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import QuickReplyButton from "@/components/QuickReplyButton";


const suggestedReplies = [
  "How do tax brackets work?",
  "Tell me about deductions",
  "What is a W-2 form?",
  "What is the standard deduction?"
];

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

export default function Home() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("An error has occured. Please try again later."),
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever the messages array is updated
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Call scrollToBottom every time the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickReply = (replyText: string) => {
    // Create a synthetic ChangeEvent to pass to handleInputChange
    const syntheticEvent = {
      target: { value: replyText },
    } as React.ChangeEvent<HTMLInputElement>;
  
    // Update the input field with the quick reply text
    handleInputChange(syntheticEvent);
  
    // Submit the message
    handleSubmit(new Event('submit'));
  };

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for the hidden file input
  const [isDragging, setIsDragging] = useState(false);

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/") || file.type.startsWith("pdf/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Please only submit text, image, or a pdf");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  // Function to handle file selection via the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle files selected from the file dialog
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-900">
      <div className="flex flex-col gap-2 w-dvw items-center overflow-y-scroll mt-4 px-4 md:px-0"style={{ height: "calc(100vh - 80px)" }}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex flex-col gap-2 w-full md:w-[500px] px-4 md:px-0 ${
                message.role === "assistant" ? "items-start" : "items-end"
              }`}
            >
              {/* Message Bubble for Assistant or User */}
              <div
                className={`flex flex-col gap-2 max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-gray-300 text-black rounded-tr-lg p-3"
                    : "bg-indigo-900 text-white rounded-tl-lg p-3"
                }`}
              >
                <div className="text-sm">{message.content}</div>
              </div>

              {/* Quick reply buttons (only for assistant's messages) */}
              {message.role === "assistant" && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedReplies.map((replyText) => (
                    <QuickReplyButton
                      key={replyText}
                      text={replyText}
                      onClick={handleQuickReply}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <motion.div className="h-[300px] px-14 w-full md:w-[500px] md:px-0 pt-16">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-lg dark:text-zinc-300 dark:border-pink-950">
              <p>
                This chatbot is designed to answer all of your tax-related questions.
                Get started by typing in the field below, or attach an image or a PDF.
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && messages[messages.length - 1].role !== "assistant" && (
          <div className="flex flex-col gap-2 w-full md:w-[500px] px-4 md:px-0 items-start">
            <div className="bg-gray-300 text-black rounded-tr-lg p-3 max-w-[80%]">
              <div className="text-sm">Thinking...</div>
            </div>
          </div>
        )}

        {/* End of messages (for auto-scrolling) */}
        <div ref={messagesEndRef}>
        </div>

        {/* Input Form */}
        <div className="fixed bottom-0 items-center w-full md:w-[500px] px-6 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-t-2xl">
        <form
          className="flex flex-end gap-2 relative items-center"
          onSubmit={(event) => {
            const options = files ? { experimental_attachments: files } : {};
            handleSubmit(event, options);
            setFiles(null);
          }}
        >
          <div className="flex flex-end items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] bg-zinc-100 dark:bg-zinc-700 rounded-full px-4 py-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100 focus:outline-none mr-3"
              aria-label="Upload Files"
            >
              <span className="w-5 h-5">
                <AttachmentIcon aria-hidden="true" />
              </span>
            </button>

            {/* Message Input */}
            <input
              ref={inputRef}
              className="bg-transparent flex-end outline-none text-zinc-800 dark:text-zinc-300 placeholder-zinc-400"
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
              onPaste={handlePaste}
            />
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}