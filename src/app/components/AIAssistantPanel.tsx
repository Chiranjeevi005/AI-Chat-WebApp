'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Define types for our data
interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  self: boolean;
  isAI?: boolean;
}

interface AIState {
  listening: boolean;
  analyzing: boolean;
  context: string;
  participants: string[];
}

interface Insight {
  id: number;
  title: string;
  content: string;
  type: string;
}

interface Action {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface UpdateAIParams {
  listening?: boolean;
  analyzing?: boolean;
  context?: string;
  participants?: string[];
}

export default function AIAssistantPanel({ 
  messages,
  aiState,
  updateAI
}: { 
  messages: Message[]; 
  aiState: AIState;
  updateAI: (state: UpdateAIParams) => void;
}) {
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [askInput, setAskInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Mock actions data
  const mockActions: Action[] = [
    { id: 1, title: 'Summarize Chat', description: 'Create a summary of the entire conversation', icon: '📝' },
    { id: 2, title: 'Draft Response', description: 'Generate a professional response to the latest message', icon: '✉️' },
    { id: 3, title: 'Convert to Task', description: 'Turn discussion points into actionable tasks', icon: '✅' },
    { id: 4, title: 'Extract Keywords', description: 'Identify key terms and concepts from the chat', icon: '🔍' }
  ];
  
  useEffect(() => {
    // Animate panel on load
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { x: 400, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: 'power3.out'
        }
      );
    }
    
    // Set mock actions
    setActions(mockActions);
    
    // Analyze messages when they change
    if (messages.length > 0) {
      analyzeConversation(messages);
    }
  }, [messages]);
  
  const analyzeConversation = (messages: Message[]) => {
    // Simulate AI analysis
    updateAI({ analyzing: true });
    
    setTimeout(() => {
      // Generate insights based on messages
      const userMessages = messages.filter(m => !m.isAI);
      const aiMessages = messages.filter(m => m.isAI);
      
      const newInsights: Insight[] = [];
      
      // Topic analysis
      if (userMessages.length > 0) {
        newInsights.push({
          id: 1,
          title: 'Topic Analysis',
          content: `AI detected ${Math.min(5, Math.floor(userMessages.length / 3))} recurring topics in the conversation.`,
          type: 'insight'
        });
      }
      
      // Sentiment analysis
      newInsights.push({
        id: 2,
        title: 'Sentiment Summary',
        content: 'Overall sentiment is positive with focus on collaboration.',
        type: 'insight'
      });
      
      // Activity analysis
      newInsights.push({
        id: 3,
        title: 'Activity Report',
        content: `Conversation has ${userMessages.length} user messages and ${aiMessages.length} AI responses.`,
        type: 'insight'
      });
      
      // Participants analysis
      if (aiState.participants.length > 1) {
        newInsights.push({
          id: 4,
          title: 'Participant Analysis',
          content: `${aiState.participants.length} participants actively engaged in the conversation.`,
          type: 'insight'
        });
      }
      
      setInsights(newInsights);
      updateAI({ analyzing: false, listening: true });
    }, 1500);
  };
  
  const handleActionClick = (action: Action) => {
    // Simulate action processing
    updateAI({ analyzing: true });
    
    setTimeout(() => {
      updateAI({ analyzing: false });
      
      // Add AI response
      const responses: Record<number, string> = {
        1: "Here's a summary of the conversation so far: Team is discussing various topics with focus on collaboration and problem-solving.",
        2: "Here's a professional response: 'Thanks for the update. I've reviewed the discussion and have a few suggestions.'",
        3: "I've created the following tasks from our discussion: 1) Review key points, 2) Follow up on action items, 3) Schedule next meeting.",
        4: "Key terms identified: collaboration, discussion, problem-solving, team, project."
      };
      
      const aiMessage: Message = {
        id: Date.now(),
        user: 'AI Assistant',
        text: `AI: ${responses[action.id]}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false,
        isAI: true
      };
      
      // In a real app, we would pass this to the parent component
      console.log('AI Action Result:', aiMessage);
    }, 1500);
  };
  
  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    
    // Simulate AI response
    updateAI({ analyzing: true });
    
    setTimeout(() => {
      updateAI({ analyzing: false });
      setAskInput('');
      
      const responses = [
        "That's an interesting question. Based on our conversation, I'd suggest focusing on the key discussion points.",
        "I've analyzed the discussion and found that the team is most engaged with collaborative problem-solving.",
        "Great point! I noticed several important themes in the conversation that we should explore further."
      ];
      
      const aiMessage: Message = {
        id: Date.now(),
        user: 'AI Assistant',
        text: `AI: ${responses[Math.floor(Math.random() * responses.length)]}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false,
        isAI: true
      };
      
      // In a real app, we would pass this to the parent component
      console.log('AI Ask Response:', aiMessage);
    }, 2000);
  };
  
  return (
    <div ref={panelRef} className="h-full flex flex-col bg-gray-800 bg-opacity-50 glass ai-panel">
      {/* Panel Header */}
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold flex items-center">
            <span className="mr-1 sm:mr-2 text-base sm:text-lg">🤖</span>
            <span className="truncate">AI Assistant</span>
          </h2>
          <div className="flex space-x-1 sm:space-x-2">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${aiState.listening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${aiState.analyzing ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-3 sm:mt-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium relative truncate ${
              activeTab === 'insights' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden xs:inline">🧠 Insights</span>
            <span className="xs:hidden">🧠</span>
            {activeTab === 'insights' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium relative truncate ${
              activeTab === 'actions' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden xs:inline">⚙️ Actions</span>
            <span className="xs:hidden">⚙️</span>
            {activeTab === 'actions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium relative truncate ${
              activeTab === 'ask' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden xs:inline">💬 Ask AI</span>
            <span className="xs:hidden">💬</span>
            {activeTab === 'ask' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-xs sm:text-sm text-gray-400">
              Real-time analysis of your conversation
            </div>
            
            {insights.map((insight, index) => (
              <div 
                key={insight.id}
                className="bg-gray-700/50 rounded-xl p-3 sm:p-4 border border-gray-600 hover:border-cyan-500/30 transition-all duration-300"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <h3 className="font-bold text-cyan-300 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                  <span className="mr-1 sm:mr-2 text-xs sm:text-base">✨</span>
                  {insight.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">{insight.content}</p>
              </div>
            ))}
            
            {insights.length === 0 && (
              <div className="text-center py-4 sm:py-8 text-gray-500">
                <div className="mb-2 sm:mb-4 text-lg sm:text-2xl">🧠</div>
                <p className="text-xs sm:text-sm">AI is analyzing the conversation...</p>
                <p className="text-xs mt-1 sm:mt-2">Insights will appear here shortly</p>
              </div>
            )}
            
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-500/20">
              <h3 className="font-bold text-purple-300 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                <span className="mr-1 sm:mr-2 text-xs sm:text-base">📊</span>
                Conversation Summary
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Team is discussing various topics with focus on collaboration and problem-solving. 
                Overall sentiment is positive with emphasis on teamwork.
              </p>
            </div>
          </div>
        )}
        
        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-xs sm:text-sm text-gray-400">
              One-click AI tools to enhance your workflow
            </div>
            
            {actions.map((action, index) => (
              <div 
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="bg-gray-700/50 rounded-xl p-3 sm:p-4 border border-gray-600 hover:border-cyan-500/30 hover:bg-gray-700/70 cursor-pointer transition-all duration-300"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-start">
                  <span className="text-base sm:text-2xl mr-2 sm:mr-3">{action.icon}</span>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-sm sm:text-base">{action.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Ask AI Tab */}
        {activeTab === 'ask' && (
          <div className="h-full flex flex-col">
            <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
              Ask the AI assistant anything about this conversation
            </div>
            
            <form onSubmit={handleAskSubmit} className="mb-3 sm:mb-4">
              <div className="relative">
                <textarea
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder="Ask anything about the conversation..."
                  className="w-full bg-gray-700 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base"
                  rows={2}
                />
                <button 
                  type="submit"
                  disabled={!askInput.trim() || aiState.analyzing}
                  className={`absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-1 rounded-full ${
                    askInput.trim() && !aiState.analyzing
                      ? 'text-cyan-400 hover:bg-cyan-500 hover:text-white glow-cyan' 
                      : 'text-gray-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
            
            {aiState.analyzing && (
              <div className="flex items-center text-cyan-400 mb-3 sm:mb-4">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-xs sm:text-sm">AI is thinking...</span>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
              <div className="text-xs text-gray-500 mb-1 sm:mb-2">Example questions:</div>
              <div className="space-y-2">
                <div className="text-xs sm:text-sm p-2 sm:p-3 bg-gray-700/50 rounded-lg">
                  &quot;What are the main topics discussed so far?&quot;
                </div>
                <div className="text-xs sm:text-sm p-2 sm:p-3 bg-gray-700/50 rounded-lg">
                  &quot;Can you summarize the key decisions made?&quot;
                </div>
                <div className="text-xs sm:text-sm p-2 sm:p-3 bg-gray-700/50 rounded-lg">
                  &quot;What are the next steps based on this conversation?&quot;
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Panel Footer */}
      <div className="p-2 sm:p-4 border-t border-gray-700 text-xs text-gray-500">
        AI Assistant v1.0 • Context-aware
      </div>
    </div>
  );
}