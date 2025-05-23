import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Define type for chat messages
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};

// Initial greeting message from the assistant
const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hi there! 👋 I\'m your Texas Hill Country travel assistant. I can help you discover attractions, plan your visit, and answer questions about the region. How can I assist you today?',
  timestamp: new Date()
};

const TravelAssistant: React.FC = () => {
  // State for chat messages and user input
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get API response
      const chatHistory = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
      const response = await fetch('/api/travel-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory })
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        throw new Error('Failed to parse response from server');
      }
      
      if (!response.ok) {
        // Handle HTTP error
        throw new Error(responseData?.message || 'Failed to get response from travel assistant');
      }
      
      // Add assistant response to chat
      if (responseData && responseData.content) {
        const assistantMessage: Message = {
          role: responseData.role || 'assistant',
          content: responseData.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Handle empty or invalid response
        throw new Error('Received invalid response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to get a response. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pressing enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Helmet>
        <title>AI Travel Assistant | Texas Hill Country</title>
        <meta 
          name="description" 
          content="Get personalized recommendations and answers about Texas Hill Country attractions, events, and travel planning from our AI travel assistant."
        />
      </Helmet>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Hill Country Travel Assistant</h1>
        <p className="text-lg text-gray-600">
          Get personalized recommendations and answers about Texas Hill Country
        </p>
      </div>
      
      <Card className="shadow-lg rounded-lg overflow-hidden">
        {/* Chat messages area with fixed height to prevent page shifting */}
        <div className="h-[60vh] min-h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 mr-1" />
                  ) : (
                    <User className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-bold">
                    {message.role === 'assistant' ? 'Hill Country Guide' : 'You'}
                  </span>
                  {message.timestamp && (
                    <span className="text-xs ml-2 opacity-75">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-800 rounded-tl-none">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 mr-1" />
                  <span className="text-xs font-bold">Hill Country Guide</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Hill Country attractions, events, or travel tips..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>
              Examples: "What are the best wineries to visit?", "Suggest a weekend itinerary for families", "Where can I see bluebonnets in spring?"
            </p>
          </div>
        </div>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Our AI travel assistant provides recommendations based on available information about Texas Hill Country.
          <br />
          For the most up-to-date information, always verify with official venues or visitor centers.
        </p>
      </div>
    </div>
  );
};

export default TravelAssistant;