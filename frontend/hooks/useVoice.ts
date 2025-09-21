import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceService } from '@/services/api';
import { VoiceRecording, TranscriptionResponse } from '@/types';

interface UseVoiceOptions {
  maxDuration?: number;
  autoTranscribe?: boolean;
  onRecordingComplete?: (recording: VoiceRecording) => void;
  onTranscriptionComplete?: (transcription: TranscriptionResponse) => void;
  onError?: (error: Error) => void;
}

export const useVoice = (options: UseVoiceOptions = {}) => {
  const {
    maxDuration = 60,
    autoTranscribe = true,
    onRecordingComplete,
    onTranscriptionComplete,
    onError,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentRecording, setCurrentRecording] = useState<VoiceRecording | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track: any) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          audioBlob,
          audioUrl,
          duration: recordingTime,
          timestamp: new Date(),
        };

        setCurrentRecording(recording);
        onRecordingComplete?.(recording);

        if (autoTranscribe) {
          await transcribeRecording(audioBlob);
        }
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
      const errorMessage = error instanceof Error ? error.message : 'Recording failed';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [autoTranscribe, maxDuration, onError, onRecordingComplete, recordingTime]);

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

  const transcribeRecording = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError('');

    try {
      const transcriptionResult = await VoiceService.speechToText(audioBlob);
      setTranscription(transcriptionResult.text);
      
      if (currentRecording) {
        const updatedRecording = {
          ...currentRecording,
          transcription: transcriptionResult.text,
        };
        setCurrentRecording(updatedRecording);
      }
      
      onTranscriptionComplete?.(transcriptionResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsTranscribing(false);
    }
  }, [currentRecording, onError, onTranscriptionComplete]);

  const generateSpeech = useCallback(async (text: string, voiceId?: string) => {
    setIsGeneratingSpeech(true);
    setError('');

    try {
      const audioBlob = await VoiceService.generateSpeech(text, voiceId);
      return audioBlob;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Speech generation failed';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsGeneratingSpeech(false);
    }
  }, [onError]);

  const playRecording = useCallback(() => {
    if (currentRecording) {
      const audio = new Audio(currentRecording.audioUrl);
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Playback failed');
      };
      
      audio.play().catch(error => {
        setIsPlaying(false);
        setError('Playback failed');
        onError?.(error);
      });
    }
  }, [currentRecording, onError]);

  const clearRecording = useCallback(() => {
    if (currentRecording) {
      URL.revokeObjectURL(currentRecording.audioUrl);
    }
    setCurrentRecording(null);
    setTranscription('');
    setRecordingTime(0);
    setError('');
  }, [currentRecording]);

  return {
    // State
    isRecording,
    isPlaying,
    isTranscribing,
    isGeneratingSpeech,
    recordingTime,
    currentRecording,
    transcription,
    error,

    // Actions
    startRecording,
    stopRecording,
    playRecording,
    clearRecording,
    transcribeRecording,
    generateSpeech,

    // Utilities
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
  };
};

export default useVoice;