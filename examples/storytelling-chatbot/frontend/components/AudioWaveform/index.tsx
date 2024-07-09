import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  active: boolean;
  minHeight?: number;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ active, minHeight = 15 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupAudio = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaStreamSource(stream);
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        setAudioContext(context);
        setAnalyser(analyserNode);
      } catch (error) {
        console.error('Error accessing the microphone', error);
      }
    };

    if (active) {
      setupAudio();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [active]);

  const setCanvasSize = () => {
    if (canvasRef.current && containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = 100; // You can adjust this or make it dynamic as well
    }
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      animationRef.current = requestAnimationFrame(drawWaveform);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength / 2; // Adjust this line
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = Math.max(minHeight, (dataArray[i] / 255) * canvas.height);

        const brightness = 0.7 + (barHeight / canvas.height) * 0.3;
        const r = Math.floor(16 * brightness);
        const g = Math.floor(185 * brightness);
        const b = Math.floor(129 * brightness);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth * 2; // Adjust this line
      }
    };

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (active) {
      drawWaveform();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, analyser, minHeight]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AudioWaveform;