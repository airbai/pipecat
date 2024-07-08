import React from "react";
import { Button } from "@/components/ui/button";
import DevicePicker from "@/components/DevicePicker";
import { IconEar, IconLoader2 } from "@tabler/icons-react";

type SetupProps = {
  handleStart: () => void;
};

const buttonLabel = {
  intro: "Next",
  setup: "Let's begin!",
  loading: "Joining...",
};

const Setup: React.FC<SetupProps> = ({ handleStart }) => {
  const [state, setState] = React.useState<"intro" | "setup" | "loading">(
    "intro"
  );

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-center text-white mb-8">
        <h1 className="text-5xl font-bold text-pink-500">Her</h1>
        <p className="text-lg">An voice interactive AI experience</p>
      </div>
      <div className="bg-white rounded-3xl cardAnim cardShadow p-9 max-w-screen-sm mx-auto outline outline-[5px] outline-gray-600/10">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-pretty tracking-tighter mb-4">
            Talk to <span className="text-sky-500">Me</span>
          </h1>

          {state === "intro" ? (
            <>
              <p className="text-gray-600 leading-relaxed text-pretty">
                This features a voice-controlled AI sweetheart who charms you from the very start. She begins by asking what kind of girlfriend you&apos;d love to talk to (e.g., age, nationality, MBTI, looks, hair. etc). After each scene, your sweet AI will pause and eagerly wait for your input. Let your imagination run wild and direct the story any way you choose, with her lovingly guiding you along the way!
              </p>
              <p className="flex flex-row gap-2 text-gray-600 font-medium">
                <IconEar size={24} /> For best results, try in a quiet environment!
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 leading-relaxed text-pretty">
                Since you&apos;ll be talking to Storybot, we need to make sure it can hear you! Please configure your microphone and speakers below.
              </p>
              <DevicePicker />
            </>
          )}

          <hr className="border-gray-150 my-2" />

          <Button
            size="lg"
            disabled={state === "loading"}
            onClick={() => {
              if (state === "intro") {
                setState("setup");
              } else {
                setState("loading");
                handleStart();
              }
            }}
          >
            {state === "loading" && (
              <IconLoader2
                size={21}
                stroke={2}
                className="mr-2 h-4 w-4 animate-spin"
              />
            )}
            {buttonLabel[state]}
          </Button>
        </div>
      </div>
      <footer className="text-center font-mono text-sm text-gray-100 py-6">
        <span className="bg-gray-800/70 px-3 py-1 rounded-md">
          Created by{" "}
          <a
            href="https://her.fiit.ai"
            className="text-violet-300 underline decoration-violet-400 hover:text-violet-100"
          >
            her.fiit.ai
          </a>
        </span>
      </footer>
    </div>
  );
};

export default Setup;
