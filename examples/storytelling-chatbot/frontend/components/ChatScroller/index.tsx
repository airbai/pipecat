"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppMessage } from "@daily-co/daily-react";
import { DailyEventObjectAppMessage } from "@daily-co/daily-js";

import styles from "./ChatScroller.module.css";

export default function ChatScroller() {
  const [partialText, setPartialText] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const intervalRef = useRef<any | null>(null);

  useEffect(() => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (messages.length > 10) {
        setMessages((msgs) => msgs.slice(1));
      }
    }, 2500);

    return () => clearInterval(intervalRef.current);
  }, [messages]);

  useAppMessage({
    onAppMessage: (e: DailyEventObjectAppMessage<any>) => {
      if (e.fromId && e.fromId === "chat") {
        // Check for chat messages only
        if (e.data.user_id !== "") {
          setPartialText(e.data.text);
          if (e.data.is_final) {
            setPartialText("");
            setMessages((msgs) => [...msgs, e.data.text]);
          }
        }
      }
    },
  });

  return (
    <div className={styles.container}>
      {messages.map((message, index) => (
        <p key={index} className={`${styles.message}`}>
          <span>{message}</span>
        </p>
      ))}
      {partialText && (
        <p className={`${styles.partial}`}>
          <span>{partialText}</span>
        </p>
      )}
    </div>
  );
}
