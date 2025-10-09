'use client';

import SocketTest from '../components/SocketTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Socket.IO Test</h1>
      <p className="text-lg mb-6">Testing Socket.IO connection on port 3003</p>
      <SocketTest />
      <div className="mt-6 p-4 bg-blue-50 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Instructions</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Check browser console for client-side logs</li>
          <li>Check server terminal for server-side logs</li>
          <li>You should see "Socket connected" messages</li>
        </ul>
      </div>
    </div>
  );
}
