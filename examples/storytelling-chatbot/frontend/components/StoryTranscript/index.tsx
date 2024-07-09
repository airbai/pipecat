"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppMessage } from "@daily-co/daily-react";
import { DailyEventObjectAppMessage } from "@daily-co/daily-js";
import styles from "./StoryTranscript.module.css";

interface Message {
  text: string;
  isUser: boolean;
}

export default function StoryTranscript() {
  const [partialText, setPartialText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const intervalRef = useRef<any | null>(null);
/*
  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (messages.length > 10) {
        setMessages((m) => m.slice(1));
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [messages]);*/

  useAppMessage({
    onAppMessage: (e: DailyEventObjectAppMessage<any>) => {
      if (e.fromId && e.fromId === "transcription") {
        if (e.data.user_id !== "") {
          // User message
          setPartialText(e.data.text);
          if (e.data.is_final) {
            setPartialText("");
            setMessages((m) => [...m, { text: e.data.text, isUser: true }]);
          }
        } else {
          // LLM message
          setPartialText(e.data.text);
          if (e.data.is_final) {
            setPartialText("");
            setMessages((m) => [...m, { text: e.data.text, isUser: false }]);
          }
        }
      }
    },
  });

  return (
    <div className={styles.container}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${styles.message} ${
            message.isUser ? styles.userMessage : styles.llmMessage
          }`}
        >
          <span>{message.text}</span>
        </div>
      ))}
      {partialText && (
        <div
          className={`${styles.message} ${
            messages.length % 2 === 0 ? styles.userMessage : styles.userMessage
          }`}
        >
          <span>{partialText}</span>
        </div>
      )}
    </div>
  );
}