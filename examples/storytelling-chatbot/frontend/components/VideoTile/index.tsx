import React from "react";
import styles from "./VideoTile.module.css";
import { DailyVideo } from "@daily-co/daily-react";
import StoryTranscript from "@/components/StoryTranscript";
import ChatTranscript from "@/components/ChatTranscript";

interface Props {
  sessionId: string;
  inactive: boolean;
}

const VideoTile = ({ sessionId, inactive }: Props) => {
  return (
    <div className={`${styles.container} ${inactive ? styles.inactive : ""} `}>
      <ChatTranscript active={true}/>

      <div className={styles.videoTile}>
        <DailyVideo
          sessionId={sessionId}
          type={"video"}
          className="aspect-square"
        />
      </div>
    </div>
  );
};

export default VideoTile;
