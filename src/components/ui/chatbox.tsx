"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import echo from '@/lib/echo';
import chatApiRequest from '@/apiRequests/chat';
import { Message } from '@/schemaValidations/message.schema';



const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // Fetch stored messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatApiRequest.fetch();
        setMessages(response.payload as Message[]);
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();
  }, []);

  // Listen for new chat messages
  useEffect(() => {
    const channel = echo.channel('laravel_database_chatroom');

    channel.listen('MessageSent', (data: Message) => {
      setMessages( (prevMessages) => [...prevMessages, data]);
      console.log('data', data);
    });

    return () => {
      channel.stopListening('MessageSent');
    };
  }, []);

  // Function to send a message
  const sendMessage = async () => {
    if (newMessage.trim() ) {
      try {
        await chatApiRequest.sent({ message: newMessage });
        // Don't add the message here, it will be added when received from the server
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message', error);
      }
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user.name}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
