'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeIssue, getAudioForText } from '@/app/actions';
import {
  BotMessageSquare,
  User,
  LoaderCircle,
  Send,
  Mic,
  MicOff,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/hooks/use-translation';

// Check if SpeechRecognition is available in the browser
const SpeechRecognition =
  (typeof window !== 'undefined' && window.SpeechRecognition) ||
  (typeof window !== 'undefined' && window.webkitSpeechRecognition);

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  analysis?: {
    caseType: string;
    section: string;
    explanation: string;
    nextSteps: string;
    escalationPath: string;
  };
  audioUrl?: string;
};

// Helper to render markdown lists
const renderMarkdownList = (text: string) => {
  return text
    .split('\n')
    .map((item, index) => {
      if (item.startsWith('- ') || item.startsWith('* ')) {
        return (
          <li key={index} className="text-sm text-muted-foreground ml-4">
            {item.substring(2)}
          </li>
        );
      }
      return null;
    })
    .filter(Boolean);
};

export default function ChatbotPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: t('chatbot.initialMessage'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSubmit(undefined, transcript); // auto-submit after recognition
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const handleSubmit = async (e?: React.FormEvent, voiceInput?: string) => {
    if(e) e.preventDefault();
    const currentInput = voiceInput || input;
    if (!currentInput.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await analyzeIssue(currentInput);
      let assistantContent = '';
      if (result.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: t('chatbot.analysisHeader'),
          analysis: {
            caseType: result.data.caseType,
            section: result.data.section,
            explanation: result.data.explanation,
            nextSteps: result.data.nextSteps,
            escalationPath: result.data.escalationPath,
          }
        };
        assistantContent = `${t('chatbot.analysisHeader')}. ${t('chatbot.analysis.caseType')}: ${result.data.caseType}. ${t('chatbot.analysis.relevantSection')}: ${result.data.section}. ${result.data.explanation}. ${t('chatbot.analysis.nextSteps')}: ${result.data.nextSteps}. ${t('chatbot.analysis.escalationPath')}: ${result.data.escalationPath}`;
        
        const audioResult = await getAudioForText(assistantContent);
        if (audioResult.data?.media) {
            assistantMessage.audioUrl = audioResult.data.media;
            playAudio(audioResult.data.media);
        }
        setMessages(prev => [...prev, assistantMessage]);

      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: result.error || t('chatbot.unknownError'),
        };
        assistantContent = result.error || t('chatbot.unknownError');

        const audioResult = await getAudioForText(assistantContent);
        if (audioResult.data?.media) {
            errorMessage.audioUrl = audioResult.data.media;
            playAudio(audioResult.data.media);
        }
        setMessages(prev => [...prev, errorMessage]);
      }
    });
  };

  return (
    <Card className="h-[calc(100vh-4rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BotMessageSquare className="h-6 w-6" />
          {t('chatbot.title')}
        </CardTitle>
        <CardDescription>{t('chatbot.disclaimer')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role !== 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>
                      <BotMessageSquare />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xl rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.analysis && (
                    <div className="mt-3 space-y-4 divide-y">
                      <div className="pt-3">
                        <p>
                          <strong>{t('chatbot.analysis.caseType')}:</strong>{' '}
                          {message.analysis.caseType}
                        </p>
                        <p>
                          <strong>
                            {t('chatbot.analysis.relevantSection')}:
                          </strong>{' '}
                          {message.analysis.section}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {message.analysis.explanation}
                        </p>
                      </div>
                      <div className="pt-3">
                        <p>
                          <strong>{t('chatbot.analysis.nextSteps')}:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {renderMarkdownList(message.analysis.nextSteps)}
                        </ul>
                      </div>
                      <div className="pt-3">
                        <p>
                          <strong>{t('chatbot.analysis.escalationPath')}:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {renderMarkdownList(message.analysis.escalationPath)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                {message.role === 'user' && user && (
                  <Avatar className="h-8 w-8 border">
                    {user.photoURL && (
                      <AvatarImage src={user.photoURL} alt="User" />
                    )}
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>
                    <BotMessageSquare />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-secondary">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>{t('chatbot.analyzing')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('chatbot.inputPlaceholder')}
            className="flex-grow"
            disabled={isPending || isRecording}
          />
           <Button type="button" onClick={toggleRecording} variant={isRecording ? 'destructive' : 'outline'} size="icon" disabled={isPending || !SpeechRecognition}>
              {isRecording ? <MicOff className="h-4 w-4"/> : <Mic className="h-4 w-4"/>}
              <span className="sr-only">{isRecording ? t('chatbot.stopRecording') : t('chatbot.startRecording')}</span>
            </Button>
          <Button type="submit" size="icon" disabled={!input.trim() || isPending || isRecording}>
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">{t('chatbot.sendButton')}</span>
          </Button>
        </form>
         <audio ref={audioRef} className="hidden" />
      </CardContent>
    </Card>
  );
}

    