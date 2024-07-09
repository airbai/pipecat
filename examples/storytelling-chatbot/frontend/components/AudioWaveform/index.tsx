import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  active: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      animationRef.current = requestAnimationFrame(drawWaveform);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // 使用 bg-green-500 的基础颜色，稍微调整亮度
        const brightness = 0.7 + (barHeight / height) * 0.3; // 0.7 到 1 之间变化
        const r = Math.floor(16 * brightness);
        const g = Math.floor(185 * brightness);
        const b = Math.floor(129 * brightness);
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        // 绘制矩形
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        
        // 添加边框
        ctx.strokeStyle = 'rgba(24, 187, 84, 0.5)';
        ctx.strokeRect(x, height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    if (active) {
      drawWaveform();
    } else {
      ctx.clearRect(0, 0, width, height);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, analyser]);

  return <canvas ref={canvasRef} width={400} height={50} className="w-full" />;
};

export default AudioWaveform;