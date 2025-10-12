'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AIAssistantPanel({ 
  messages,
  aiState,
  updateAI
}: { 
  messages: any[]; 
  aiState: any;
  updateAI: (state: any) => void;
}) {
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [askInput, setAskInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Mock insights data
  const mockInsights = [
    { id: 1, title: 'Topic Analysis', content: 'AI detected 3 recurring topics: design, deployment, and user feedback.', type: 'insight' },
    { id: 2, title: 'Sentiment Summary', content: 'Overall sentiment is positive with focus on collaboration.', type: 'insight' },
    { id: 3, title: 'Action Items', content: '2 potential action items identified from conversation.', type: 'insight' }
  ];
  
  // Mock actions data
  const mockActions = [
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
    
    // Set mock data
    setInsights(mockInsights);
    setActions(mockActions);
  }, []);
  
  const handleActionClick = (action: any) => {
    // Simulate action processing
    updateAI({ analyzing: true });
    
    setTimeout(() => {
      updateAI({ analyzing: false });
      
      // Add AI response
      const responses: any = {
        1: "Here's a summary of the conversation so far: Team is discussing the new UI design with focus on color consistency and deployment schedule.",
        2: "Here's a professional response: 'Thanks for the update. I've reviewed the prototype and have a few suggestions for the color scheme.'",
        3: "I've created the following tasks from our discussion: 1) Review color consistency, 2) Finalize deployment schedule, 3) Schedule user feedback session.",
        4: "Key terms identified: UI design, color consistency, deployment, user feedback, prototype, schedule."
      };
      
      const aiMessage = {
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
        "That's an interesting question. Based on our conversation, I'd suggest focusing on the design consistency first.",
        "I've analyzed the discussion and found that the team is most concerned about the deployment timeline.",
        "Great point! I noticed that color consistency was mentioned multiple times, which might be a priority."
      ];
      
      const aiMessage = {
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
    <div ref={panelRef} className="h-full flex flex-col bg-gray-800 bg-opacity-50 glass">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">🤖</span> AI Assistant
          </h2>
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${aiState.listening ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <div className={`w-3 h-3 rounded-full ${aiState.analyzing ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-sm font-medium relative ${
              activeTab === 'insights' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧠 Insights
            {activeTab === 'insights' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 text-sm font-medium relative ${
              activeTab === 'actions' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚙️ Actions
            {activeTab === 'actions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 text-sm font-medium relative ${
              activeTab === 'ask' 
                ? 'text-cyan-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Ask AI
            {activeTab === 'ask' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
            )}
          </button>
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-2">
              Real-time analysis of your conversation
            </div>
            
            {insights.map((insight, index) => (
              <div 
                key={insight.id}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-cyan-500/30 transition-all duration-300"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <h3 className="font-bold text-cyan-300 mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  {insight.title}
                </h3>
                <p className="text-gray-300 text-sm">{insight.content}</p>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl border border-purple-500/20">
              <h3 className="font-bold text-purple-300 mb-2 flex items-center">
                <span className="mr-2">📊</span>
                Conversation Summary
              </h3>
              <p className="text-gray-300 text-sm">
                Team is discussing the new UI design with focus on color consistency and deployment schedule. 
                Overall sentiment is positive with emphasis on collaboration.
              </p>
            </div>
          </div>
        )}
        
        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-2">
              One-click AI tools to enhance your workflow
            </div>
            
            {actions.map((action, index) => (
              <div 
                key={action.id}
                onClick={() => handleActionClick(action)}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-cyan-500/30 hover:bg-gray-700/70 cursor-pointer transition-all duration-300"
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{action.icon}</span>
                  <div>
                    <h3 className="font-bold text-white mb-1">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Ask AI Tab */}
        {activeTab === 'ask' && (
          <div className="h-full flex flex-col">
            <div className="text-sm text-gray-400 mb-4">
              Ask the AI assistant anything about this conversation
            </div>
            
            <form onSubmit={handleAskSubmit} className="mb-4">
              <div className="relative">
                <textarea
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder="Ask anything about the conversation..."
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  rows={3}
                />
                <button 
                  type="submit"
                  disabled={!askInput.trim() || aiState.analyzing}
                  className={`absolute right-3 bottom-3 p-1 rounded-full ${
                    askInput.trim() && !aiState.analyzing
                      ? 'text-cyan-400 hover:bg-cyan-500 hover:text-white glow-cyan' 
                      : 'text-gray-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
            
            {aiState.analyzing && (
              <div className="flex items-center text-cyan-400 mb-4">
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                AI is thinking...
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
              <div className="text-xs text-gray-500 mb-2">Example questions:</div>
              <div className="space-y-2">
                <div className="text-sm p-3 bg-gray-700/50 rounded-lg">
                  "What are the main topics discussed so far?"
                </div>
                <div className="text-sm p-3 bg-gray-700/50 rounded-lg">
                  "Can you summarize the key decisions made?"
                </div>
                <div className="text-sm p-3 bg-gray-700/50 rounded-lg">
                  "What are the next steps based on this conversation?"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Panel Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        AI Assistant v1.0 • Context-aware
      </div>
    </div>
  );
}