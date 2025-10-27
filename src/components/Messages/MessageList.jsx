import React, { useState, useEffect } from 'react';
import { messageAPI } from '../../services/api';
import ChatBox from './ChatBox';
import Loader from '../shared/Loader';

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading messages..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md border-b border-gray-200 px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600">Chat with your healthcare providers</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${selectedUser && mobileView ? 'hidden' : 'block'} w-full md:w-1/3 bg-white border-r border-gray-200 overflow-y-auto`}>
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.user._id}
                    onClick={() => {
                      setSelectedUser(conversation.user);
                      setMobileView(true);
                    }}
                    className={`w-full p-4 hover:bg-sky-50 transition text-left ${
                      selectedUser?._id === conversation.user._id ? 'bg-sky-50 border-l-4 border-sky-600' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-white">
                          {conversation.user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.user.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Box */}
          <div className={`${!selectedUser || !mobileView ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}>
            {selectedUser ? (
              <ChatBox 
                user={selectedUser} 
                onBack={() => {
                  setSelectedUser(null);
                  setMobileView(false);
                }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                  <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
