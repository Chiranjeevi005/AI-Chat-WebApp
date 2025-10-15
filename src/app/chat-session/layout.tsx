import React from 'react';
import '@/app/custom-styles.css';

export default function ChatSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}