"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { serverURL } from "@/utils/utils";
import { ToastContainer, toast } from "react-toastify";
import {
  FiUser,
  FiLogOut,
  FiShoppingCart,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";
import Footer from "./Footer";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { quantum } from "ldrs";
import { jelly } from "ldrs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "./Header";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

// Register the ScrollToPlugin with GSAP
gsap.registerPlugin(ScrollToPlugin);

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  originalInput?: string;
  variants?: { text: string; score: number }[];
  variantIndex: number;
}

const loadingStates = [
  { text: "Buying a condo" },
  { text: "Travelling in a flight" },
  { text: "Meeting Tyler Durden" },
  { text: "He makes soap" },
  { text: "We goto a bar" },
  { text: "Start a fight" },
  { text: "We like it" },
  { text: "Welcome to F**** C***" },
];

const TypewriterEffect: React.FC<{ messages: string[] }> = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) {
      setIsTyping(false);
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    if (currentText.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        setCurrentText(currentMessage.slice(0, currentText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedMessages((prev) => [...prev, currentMessage]);
        setCurrentMessageIndex(currentMessageIndex + 1);
        setCurrentText("");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentMessageIndex, messages]);

  return (
    <div className="text-gray-400">
      {displayedMessages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
      <p>{currentText}</p>
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
};

export default function Home() {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>({});
  const [wordCount, setWordCount] = useState<number>(0);
  const [rewriteCount, setRewriteCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const outputContainerRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (inputContainerRef.current && outputContainerRef.current) {
      gsap.to(inputContainerRef.current, {
        duration: 0.5,
        scrollTo: { y: "max" },
        ease: "power3.out",
      });
      outputContainerRef.current.scrollTop =
        outputContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      const savedMessages = localStorage.getItem("messageHistory");
      const existingMessages = savedMessages ? JSON.parse(savedMessages) : [];
      const combinedMessages = [...existingMessages, ...messages];
      localStorage.setItem("messageHistory", JSON.stringify(combinedMessages));
    }
  }, [messages, loading]);

  const getRewrites = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/bypass/rewrites`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      setRewriteCount(response.data.rewrites);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const getUser = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/users`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      setUser(response.data.user);
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
      toast.error("Something went wrong!");
    }
  };

  const rewrite = async () => {
    if (text.length < 3 || loading) return;

    setLoading(true);
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text,
      variantIndex: 0,
    };
    setMessages((prev) => [...prev, newMessage]);
    setText("");

    if (inputContainerRef.current) {
      const messageElement = inputContainerRef.current.lastElementChild;
      if (messageElement) {
        gsap.fromTo(
          messageElement,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    }

    const config = {
      method: "POST",
      url: `${serverURL}/bypass/rewrite`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": `application/json`,
      },
      data: {
        text,
        tone: 0,
      },
    };

    try {
      const response = await axios(config);

      console.log(response.data);

      const variants = response.data.variants.map((variant: any) => ({
        text: variant.text,
        score: variant.score,
      }));

      const botMessage: Message = {
        id: response.data.messageId,
        sender: "bot",
        text: variants.length > 0 ? variants[0].text : response.data.output,
        variants,
        variantIndex: 0,
        originalInput: text,
      };

      setMessages((prev) => [...prev, botMessage]);

      getRewrites();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    getRewrites();
  }, []);

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setText(event.target.value);
    setWordCount(event.target.value.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      rewrite();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy text.");
      }
    );
  };

  const redoMessage = (originalInput: string) => {
    setText(originalInput);
    textareaRef.current?.focus();
  };

  const welcomeMessages = [
    "Hello, Welcome to NoaiGPT!",
    "Paste the text and Start Humanizing Content",
    "Bypass Turnitin, Zerogpt, GptZero etc",
    "Stay Unique, Stay Undetectable.",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      quantum.register();
      jelly.register();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header isLoggedIn={isLoggedIn} user={user} rewriteCount={rewriteCount} />

      <main className="flex-grow flex px-4 py-2 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto flex space-x-4">
          {/* Left side - Input messages */}
          <div className="flex flex-col w-[45%] rounded-lg bg-gray-900 shadow-md border border-gray-800">
            <div
              ref={inputContainerRef}
              className="flex-grow overflow-y-auto p-4"
            >
              {messages.length === 0 && text.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <l-jelly size="40" speed="0.9" color="#4B5563"></l-jelly>
                  <p className="mt-4 text-gray-400">Waiting for input...</p>
                </div>
              ) : (
                messages
                  .filter((m) => m.sender === "user")
                  .map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg bg-gray-800 shadow-sm mb-3"
                    >
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                  ))
              )}
            </div>
            <div className="p-4 border-t border-gray-800">
              <Footer
                text={text}
                setText={setText}
                wordCount={wordCount}
                loading={loading}
                sendMessage={rewrite}
                handleTextAreaChange={handleTextAreaChange}
                handleKeyDown={handleKeyDown}
                textareaRef={textareaRef}
              />
            </div>
          </div>

          {/* Right side - Output messages */}
          <div className="w-[55%] bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div className="h-full flex flex-col">
              <div className="flex-grow p-4 overflow-y-auto">
                {loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="w-full max-w-md">
                      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <TypewriterEffect messages={welcomeMessages} />
                  </div>
                ) : (
                  <textarea
                    ref={outputContainerRef}
                    className="w-full h-full resize-none text-sm text-gray-300 leading-relaxed focus:outline-none bg-gray-900"
                    value={messages[messages.length - 1].text}
                    readOnly
                  />
                )}
              </div>
              {messages.length > 0 &&
                messages[messages.length - 1].variants && (
                  <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-400">Human</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
                        onClick={() => {
                          const lastMessage = messages[messages.length - 1];
                          const newIndex =
                            (lastMessage.variantIndex -
                              1 +
                              lastMessage.variants!.length) %
                            lastMessage.variants!.length;
                          setMessages((prev) => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                              ...lastMessage,
                              text: lastMessage.variants![newIndex].text,
                              variantIndex: newIndex,
                            };
                            return newMessages;
                          });
                        }}
                        disabled={
                          messages[messages.length - 1].variantIndex === 0
                        }
                      >
                        &lt;
                      </button>
                      <span className="text-gray-400">
                        Variant {messages[messages.length - 1].variantIndex + 1}{" "}
                        / {messages[messages.length - 1].variants!.length}
                      </span>
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
                        onClick={() => {
                          const lastMessage = messages[messages.length - 1];
                          const newIndex =
                            (lastMessage.variantIndex + 1) %
                            lastMessage.variants!.length;
                          setMessages((prev) => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                              ...lastMessage,
                              text: lastMessage.variants![newIndex].text,
                              variantIndex: newIndex,
                            };
                            return newMessages;
                          });
                        }}
                        disabled={
                          messages[messages.length - 1].variantIndex ===
                          messages[messages.length - 1].variants!.length - 1
                        }
                      >
                        &gt;
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
                        onClick={() =>
                          copyToClipboard(messages[messages.                          length - 1].text)
                        }
                      >
                        Copy
                        <FiCopy className="inline ml-2" />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}