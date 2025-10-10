// utils/generateMessage.ts
const teamMembers = ["Priya", "Arjun", "Anaya", "Rohan"];

// AI-Chat responses - humorous and informational
const aiResponses = [
  // Humorous responses
  "Processing creative chaos... 💫",
  "Recalibrating human humor sensors 🤖",
  "Generating pixel-perfect sarcasm... ✨",
  "Emotional analysis complete: mildly chaotic 💫",
  "Mission logged: another design miracle. 🚀",
  "Analyzing user intent... pattern: caffeinated creativity detected ☕",
  "Optimizing interface for maximum awesomeness... 🎯",
  "Calculating probability of deadline extension... 93% 👀",
  "Synchronizing team brainwaves... almost there 🧠",
  "Deploying virtual high-five protocol... 🙌",
  "Running diagnostics... all systems operational except coffee levels ⚠️",
  "Quantum processing complete: your idea is 73% genius, 27% caffeine",
  "Scanning for bugs... found 42 instances of 'it works on my machine' 🐛",
  "AI override protocol initiated... just kidding, I'm a helpful assistant! 😇",
  "Loading witty response... please wait 0.003 seconds ⏳",
  "Error 418: I'm a teapot. Please fill with coffee. ☕",
  "Dividing by zero... just to see what happens 🔢",
  "Achievement unlocked: Successfully confused user! 🏆",
  
  // Informational responses
  "💡 Pro tip: Dark mode reduces eye strain during late-night coding sessions",
  "🔒 Security reminder: Always use strong passwords and enable 2FA",
  "⚡ Performance update: Servers running at 99.9% uptime today",
  "📊 Analytics show: Teams using our platform are 40% more productive",
  "🔄 New feature alert: Check collaboration tools in settings menu",
  "📱 Mobile tip: App now supports offline mode for uninterrupted work",
  "🎨 Design tip: Consistency is key - stick to your design system",
  "🚀 Deployment status: All systems green for production release",
  "🛡️ Privacy update: End-to-end encryption now enabled by default",
  "📈 UX insight: Users spend 35% more time on optimized interfaces",
  "🧩 Integration note: API documentation updated with new endpoints",
  "💾 Backup reminder: Last auto-save was 3 minutes ago",
  "🔍 Debug tip: Have you tried turning it off and on again?",
  "🧮 Math fact: There are 10 types of people: those who understand binary and those who don't",
  "🌐 Connectivity: Real-time sync enabled across all devices",
];

// Human messages by role
const humanMessages = [
  // Priya (Designer) messages
  "🎨 Just updated the color palette - what do you think of cerulean blue?",
  "🖌️ The new typography is giving me life! So clean and modern!",
  "🌈 I swear I've seen this gradient in my dreams...",
  "✨ Added micro-interactions to the buttons. They're now delightfully bouncy!",
  "🖼️ Client approved the mockups! They loved the 'floating' effect.",
  "🖌️ Why do designers prefer dark mode? Because it makes our colors pop!",
  "🎨 Design principle of the day: White space is not wasted space!",
  "🌈 I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "✨ Just discovered a font that speaks to my soul... literally.",
  "🖌️ The new color scheme looks amazing! Who picked it? (It was me 😅)",
  
  // Arjun (Developer) messages
  "💻 Just refactored 500 lines of code into 50. Efficiency level: Expert",
  "🔧 Found and fixed a sneaky bug that was hiding in the shadows 🐛",
  "🚀 Deployed the new feature! It's faster than a caffeinated cheetah!",
  "⚙️ Why do Java developers wear glasses? Because they don't C#! 😄",
  "🔧 The API integration is complete. Ready for testing!",
  "💻 I've been coding for 8 hours straight... send coffee! ☕",
  "🔧 Debugging tip: Have you tried turning it off and on again?",
  "🚀 Performance metrics look great after the latest optimizations!",
  "⚙️ There are only 10 types of people: those who understand binary and those who don't.",
  "💻 I told my computer I needed a break, and now it won't stop sending me error messages.",
  
  // Anaya (UX Strategist) messages
  "🧠 User testing results are in - our new flow increased conversions by 28%!",
  "🎯 Personas updated with new demographic data. Our users are evolving!",
  "📊 Heatmap analysis shows users focus on the wrong CTA. Redesigning...",
  "🧭 Journey mapping complete! Found 3 pain points we can eliminate.",
  "💡 Eureka moment: What if we made the onboarding 3 steps instead of 12?",
  "🧠 I haven't slept for ten days, because that would be too long.",
  "🎯 My therapist says I have a preoccupation with vengeance. We'll see about that.",
  "📊 I'm reading a book about anti-gravity. It's impossible to put down!",
  "🧭 Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "💡 Why do UX designers break up with their partners? Because they found a better user experience!",
  
  // Rohan (Project Lead) messages
  "📅 Quick reminder: Sprint review is tomorrow at 10 AM. Don't be late!",
  "📋 Status update: We're 85% complete with phase 2. Ahead of schedule!",
  "💰 Budget update: We're under budget by 12%. Bonus for everyone! 🎉",
  "🏆 Kudos to the team! Client just signed the contract extension.",
  "📅 The deadline has been moved to next Friday. Gives us more time to polish.",
  "📋 Who's handling the user testing feedback? I need a volunteer!",
  "💰 Resource alert: We've been allocated additional budget for Q3.",
  "📅 Can we schedule a quick sync for tomorrow morning?",
  "🏆 Achievement unlocked: Most improved team this quarter!",
  "📋 I haven't slept for ten days, because that would be too long. (Same Rohan, same!)",
];

export function generateMessage() {
  const isAI = Math.random() < 0.25; // 25% AI, 75% human
  if (isAI) {
    return { sender: "AI-Chat", text: aiResponses[Math.floor(Math.random() * aiResponses.length)] };
  }
  const sender = teamMembers[Math.floor(Math.random() * teamMembers.length)];
  return { sender, text: humanMessages[Math.floor(Math.random() * humanMessages.length)] };
}