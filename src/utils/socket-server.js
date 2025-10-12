import { Server } from 'socket.io';

let io;
const rooms = new Map(); // Store room information
const users = new Map(); // Store user information

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Socket connected with ID:', socket.id);

      // Handle user joining with username
      socket.on('join', (data) => {
        const { username, room } = data;
        
        // Check if username is already taken in this room
        const roomUsers = rooms.get(room) ? rooms.get(room).users : new Set();
        if (roomUsers.has(username)) {
          socket.emit('usernameTaken', username);
          return;
        }
        
        // Store user info
        users.set(socket.id, { username, room });
        
        // Join the room
        socket.join(room);
        
        // Add user to room
        if (!rooms.has(room)) {
          rooms.set(room, { users: new Set(), messages: [] });
        }
        rooms.get(room).users.add(username);
        
        // Notify others in the room
        socket.to(room).emit('userJoined', { username });
        
        // Send room data to the new user
        const roomData = rooms.get(room);
        socket.emit('roomData', {
          room,
          users: Array.from(roomData.users),
          messages: roomData.messages
        });
        
        // Broadcast updated room list
        io.emit('roomsUpdate', Array.from(rooms.keys()));
        
        console.log(`User ${username} joined room: ${room}`);
      });

      // Handle message sending
      socket.on('sendMessage', (data) => {
        const user = users.get(socket.id);
        if (!user) return;
        
        const { room, message } = data;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageData = {
          id: Date.now(),
          user: user.username,
          text: message,
          time: timestamp,
          self: false
        };
        
        // Store message
        if (rooms.has(room)) {
          rooms.get(room).messages.push(messageData);
          // Keep only last 100 messages
          if (rooms.get(room).messages.length > 100) {
            rooms.get(room).messages.shift();
          }
        }
        
        // Broadcast message to room
        io.to(room).emit('message', messageData);
        console.log(`Message from ${user.username} in room ${room}: ${message}`);
      });

      // Handle room creation
      socket.on('createRoom', (roomName) => {
        if (!rooms.has(roomName)) {
          rooms.set(roomName, { users: new Set(), messages: [] });
          io.emit('roomsUpdate', Array.from(rooms.keys()));
          socket.emit('roomCreated', roomName);
          console.log(`Room created: ${roomName}`);
        } else {
          socket.emit('roomExists', roomName);
        }
      });

      // Handle typing indicator
      socket.on('typing', (data) => {
        const user = users.get(socket.id);
        if (!user) return;
        
        const { room, isTyping } = data;
        socket.to(room).emit('typing', { username: user.username, isTyping });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
          const { username, room } = user;
          
          // Remove user from room
          if (rooms.has(room)) {
            rooms.get(room).users.delete(username);
            
            // If room is empty, delete it
            if (rooms.get(room).users.size === 0) {
              rooms.delete(room);
            }
          }
          
          // Notify others in the room
          socket.to(room).emit('userLeft', { username });
          
          // Broadcast updated room list
          io.emit('roomsUpdate', Array.from(rooms.keys()));
          
          console.log(`User ${username} left room: ${room}`);
        }
        
        users.delete(socket.id);
        console.log('Socket disconnected with ID:', socket.id);
      });
    });
  }
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};