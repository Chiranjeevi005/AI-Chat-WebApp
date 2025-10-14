import React from 'react';

export default async function ChatSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removed authentication check to allow direct access
  
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex">
      {children}
    </div>
  );
}