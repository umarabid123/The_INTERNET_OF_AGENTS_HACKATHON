'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl?: string;
  audioBlob?: Blob;
  text?: string;
  onTextToSpeech?: (text: string) => Promise<Blob>;
  className?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioBlob,
  text,
  onTextToSpeech,
  className,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(audioUrl || null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setCurrentAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (audioUrl) {
      setCurrentAudioUrl(audioUrl);
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        playAudio();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentAudioUrl, autoPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  const generateSpeech = async () => {
    if (!text || !onTextToSpeech) return;

    setIsLoading(true);
    try {
      const audioBlob = await onTextToSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      setCurrentAudioUrl(url);
      
      toast({
        title: "Speech generated",
        description: "Text converted to speech successfully",
      });
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech generation failed",
        description: "Could not convert text to speech",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!currentAudioUrl && text && onTextToSpeech) {
      await generateSpeech();
      return;
    }

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const downloadAudio = () => {
    if (currentAudioUrl) {
      const a = document.createElement('a');
      a.href = currentAudioUrl;
      a.download = 'audio.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!currentAudioUrl && !text) {
    return null;
  }

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      {/* Audio Element */}
      {currentAudioUrl && (
        <audio
          ref={audioRef}
          src={currentAudioUrl}
          preload="metadata"
          className="hidden"
        />
      )}

      {/* Text Display */}
      {text && (
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">AI Response:</h4>
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={togglePlayPause}
            size="sm"
            disabled={isLoading}
            className="rounded-full h-10 w-10"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            onClick={resetAudio}
            size="sm"
            variant="outline"
            disabled={!currentAudioUrl || isLoading}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 mx-4">
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="relative">
              <Progress value={progressPercentage} className="h-2" />
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => handleSeek([parseInt(e.target.value)])}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                disabled={!currentAudioUrl || isLoading}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleMute}
              size="sm"
              variant="ghost"
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-3 w-3" />
              ) : (
                <Volume2 className="h-3 w-3" />
              )}
            </Button>
            
            <div className="w-20">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadAudio}
            size="sm"
            variant="ghost"
            disabled={!currentAudioUrl}
            className="h-8 w-8"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Generate Speech Button */}
      {text && onTextToSpeech && !currentAudioUrl && (
        <Button
          onClick={generateSpeech}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating Speech...
            </>
          ) : (
            'Convert to Speech'
          )}
        </Button>
      )}

      {/* Audio Visualizer */}
      {isPlaying && (
        <div className="flex justify-center items-end space-x-1 h-12">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-primary rounded-full w-1 animate-pulse"
              style={{
                height: `${Math.random() * 40 + 10}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${Math.random() * 0.5 + 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default AudioPlayer;