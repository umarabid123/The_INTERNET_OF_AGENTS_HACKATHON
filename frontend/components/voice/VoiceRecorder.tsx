'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscriptionReceived?: (text: string) => void;
  maxDuration?: number;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onTranscriptionReceived,
  maxDuration = 60,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Initialize audio context and check permissions
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        handleTranscription(audioBlob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev: number) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [maxDuration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Mock transcription for now
      setTimeout(() => {
        const mockText = "This is a mock transcription. Replace with actual API call.";
        setTranscription(mockText);
        onTranscriptionReceived?.(mockText);
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Transcription error:', error);
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-6 space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Voice Assistant</h3>
        <p className="text-sm text-gray-600">
          {isRecording ? 'Recording...' : 'Click to start voice interaction'}
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center items-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            size="lg"
            className="rounded-full h-16 w-16"
            disabled={isProcessing}
          >
            🎤
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600"
          >
            ⏹️
          </Button>
        )}
      </div>

      {/* Recording Progress */}
      {isRecording && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Recording: {formatTime(recordingTime)}</span>
            <span>Max: {formatTime(maxDuration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(recordingTime / maxDuration) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Processing audio...</p>
        </div>
      )}

      {/* Transcription Display */}
      {transcription && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Transcription:</h4>
          <p className="text-sm">{transcription}</p>
        </div>
      )}
    </Card>
  );
};

export default VoiceRecorder;