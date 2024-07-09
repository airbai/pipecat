import React, { useState, useEffect } from "react";
import { useAppMessage } from "@daily-co/daily-react";
import { DailyEventObjectAppMessage } from "@daily-co/daily-js";
import styles from "./ChatTranscript.module.css";
import { IconMicrophone } from "@tabler/icons-react";
import { TypewriterEffect } from "../ui/typewriter";
import AudioIndicator from "../AudioIndicator";

interface Message {
  text: string;
  isUser: boolean;
}

interface Props {
  active: boolean;
}

export default function ChatTranscript({ active }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partialText, setPartialText] = useState<string>("");

  useAppMessage({
    onAppMessage: (e: DailyEventObjectAppMessage<any>) => {
      if (e.fromId && e.fromId === "transcription") {
        const isUser = e.data.user_id !== "";
        if (e.data.is_final) {
          setMessages(prev => [...prev, { text: e.data.text, isUser }]);
          setPartialText("");
        } else {
          setPartialText(e.data.text);
        }
      }
    },
  });

  useEffect(() => {
    if (active) return;
    const t = setTimeout(() => {
      setMessages([]);
      setPartialText("");
    }, 4000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className={`${styles.panel} ${active ? styles.active : ""}`}>
      <div className="relative z-20 flex flex-col">

        <div className={styles.chatContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.isUser ? styles.userMessage : styles.llmMessage
              }`}
            >
              <TypewriterEffect words={message.text.split(" ")} />
            </div>
          ))}
          {partialText && (
            <div
              className={`${styles.message} ${
                messages.length % 2 === 0 ? styles.userMessage : styles.llmMessage
              }`}
            >
              <TypewriterEffect words={partialText.split(" ")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}