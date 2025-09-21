'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { VoiceService } from '@/services/api';
import 'highlight.js/styles/github.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface VoiceChatProps {
  onMessageSent?: (message: string) => void;
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ 
  onMessageSent,
  onVoiceCommand,
  className 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Welcome to your AI Travel Assistant! ✈️ 

I'm here to help you with:
• Flight bookings and searches
• Hotel reservations
• Travel planning and tips
• Best deals and pricing
• Trip management

What can I help you with today? Just ask me about flights, hotels, or travel planning!`,
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      // Method 1: Direct scroll to element
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
      
      // Method 2: ScrollArea viewport scroll
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };
    
    // Multiple scroll attempts to ensure it works
    const timer1 = setTimeout(scrollToBottom, 50);
    const timer2 = setTimeout(scrollToBottom, 200);
    const timer3 = setTimeout(scrollToBottom, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [messages]);  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Update messages and clear input immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Call the callback if provided
    onMessageSent?.(content.trim());

    try {
      // Build conversation history for OpenAI
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call OpenAI API
      const aiResponseData = await VoiceService.chat(content.trim(), conversationHistory);
      
      const aiResponse: Message = {
        id: generateId(),
        content: aiResponseData.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Enhanced auto-scroll with multiple attempts
      const scrollToBottom = () => {
        // Attempt 1: Immediate scroll
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'end'
            });
          }
        }, 50);

        // Attempt 2: After slight delay
        setTimeout(() => {
          if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
            }
          }
        }, 200);

        // Attempt 3: Final fallback
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: 'smooth',
              block: 'end'
            });
          }
        }, 500);
      };

      scrollToBottom();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to static response on error
      const fallbackResponse: Message = {
        id: generateId(),
        content: `I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment.

In the meantime, I can still help you with:
• **Flight Booking** - Visit our Flight Booking page
• **Hotel Reservations** - Check our Hotel Search
• **Travel Planning** - Browse our travel guides
• **Customer Support** - Contact our 24/7 support team

Is there anything specific I can help you with using our platform features?`,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode. Full AI features will return shortly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(inputMessage);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (inputMessage.trim() && !isLoading) {
      handleSendMessage(inputMessage);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    toast({
      title: isVoiceMode ? "Text Mode" : "Voice Mode",
      description: isVoiceMode ? "Switched to text input" : "Switched to voice input",
    });
  };

  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-green-50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-500 text-white">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm text-gray-800">Travel Assistant</h3>
            <p className="text-xs text-gray-600">
              {isLoading ? 'Thinking...' : 'Online • Ready to help'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={isVoiceMode ? "default" : "secondary"} className="text-xs">
            {isVoiceMode ? "Voice" : "Text"}
          </Badge>
          <Button
            onClick={toggleVoiceMode}
            size="sm"
            variant="outline"
            className="h-8 w-8"
          >
            {isVoiceMode ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full w-full">
          <div className="p-4 space-y-4 min-h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3 mb-4",
                  message.sender === 'user' ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarFallback className={cn(
                    message.sender === 'user' 
                      ? "bg-green-500 text-white" 
                      : "bg-blue-500 text-white"
                  )}>
                    {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={cn(
                  "flex-1 space-y-2 min-w-0",
                  message.sender === 'user' ? "items-end flex flex-col" : "items-start flex flex-col"
                )}>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm shadow-sm max-w-full break-words leading-relaxed",
                      message.sender === 'user'
                        ? "bg-green-500 text-white self-end max-w-[85%]"
                        : "bg-white text-gray-800 border self-start max-w-[90%]"
                    )}
                  >
                    {message.sender === 'ai' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // Custom styling for markdown elements
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-gray-800">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold mb-1 text-gray-800">{children}</h3>,
                            p: ({children}) => <p className="mb-2 text-gray-800 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="mb-2 pl-4 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="mb-2 pl-4 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-gray-800">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">{children}</code>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-300 pl-3 py-1 bg-blue-50 text-gray-700 my-2">{children}</blockquote>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 px-3 self-start">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3 mb-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-lg px-3 py-3 text-sm border shadow-sm max-w-[90%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                    <span className="text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll target - ensures proper spacing at bottom */}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white space-y-3 flex-shrink-0">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage("Help me book a flight")}
            className="text-xs"
          >
            ✈️ Book Flight
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage("Find me a hotel")}
            className="text-xs"
          >
            🏨 Find Hotel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendMessage("Show me travel deals")}
            className="text-xs"
          >
            💰 Best Deals
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your travel question..."
            disabled={isLoading}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            autoComplete="off"
          />
          
          <Button
            onClick={handleSendClick}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Ask about flights, hotels, or travel plans</span>
          <span>{messages.length} messages</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
