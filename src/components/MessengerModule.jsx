import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Search, 
  Paperclip, 
  MoreVertical, 
  Smile, 
  Phone, 
  Video,
  CheckCheck
} from 'lucide-react';

const MessengerModule = () => {
  const [activeChat, setActiveChat] = useState(0);

  const contacts = [
    { id: 0, name: 'Principal Office', lastMsg: 'The annual meet planning is...', time: '10:30 AM', unread: 2, online: true },
    { id: 1, name: 'Ram Bahadur (Bus 01)', lastMsg: 'Reached destination safely.', time: '09:15 AM', unread: 0, online: true },
    { id: 2, name: 'Admission Dept', lastMsg: 'New application received.', time: 'Yesterday', unread: 0, online: false },
    { id: 3, name: 'Accounts Section', lastMsg: 'Audit report is ready.', time: 'Yesterday', unread: 0, online: true },
    { id: 4, name: 'Staff Room', lastMsg: 'Meeting at 4 PM today.', time: 'Monday', unread: 0, online: false },
  ];

  const messages = [
    { id: 1, text: 'Hello Shiva, have you checked the new student registrations?', sender: 'Principal Office', time: '10:00 AM', isMe: false },
    { id: 2, text: 'Yes, looking into them right now. Most are for Grade 10.', sender: 'Me', time: '10:05 AM', isMe: true },
    { id: 3, text: 'Great. Let me know if there are any issues with the documents.', sender: 'Principal Office', time: '10:10 AM', isMe: false },
    { id: 4, text: 'The annual meet planning is also starting next week.', sender: 'Principal Office', time: '10:30 AM', isMe: false },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 pb-4">
      {/* Sidebar: Chats List */}
      <div className="w-80 glass rounded-3xl border border-white/5 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/5">
           <h3 className="text-xl font-bold text-white mb-4">Messages</h3>
           <div className="glass-input p-2.5 rounded-xl flex items-center gap-2">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Search chats..." className="bg-transparent border-none outline-none text-white text-sm w-full" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {contacts.map((contact) => (
             <button
               key={contact.id}
               onClick={() => setActiveChat(contact.id)}
               className={`w-full p-4 flex items-center gap-4 transition-all border-l-4 ${
                 activeChat === contact.id ? 'bg-blue-600/10 border-blue-500' : 'border-transparent hover:bg-white/5'
               }`}
             >
               <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                     {contact.name.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a]"></div>
                  )}
               </div>
               <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-bold text-slate-200 text-sm truncate">{contact.name}</p>
                     <p className="text-[10px] text-slate-500">{contact.time}</p>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
               </div>
               {contact.unread > 0 && (
                 <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {contact.unread}
                 </div>
               )}
             </button>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass rounded-3xl border border-white/5 flex flex-col overflow-hidden relative">
         {/* Chat Header */}
         <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                  {contacts[activeChat].name.charAt(0)}
               </div>
               <div>
                  <p className="font-bold text-white">{contacts[activeChat].name}</p>
                  <p className="text-xs text-emerald-400">Online</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Phone size={20} />
               </button>
               <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Video size={20} />
               </button>
               <div className="w-px h-6 bg-white/5 mx-2"></div>
               <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <MoreVertical size={20} />
               </button>
            </div>
         </div>

         {/* Messages area */}
         <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="text-center">
               <span className="px-4 py-1 rounded-full bg-white/5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Today</span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' 
                        : 'bg-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                       {msg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] text-slate-600">{msg.time}</span>
                       {msg.isMe && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                 </div>
              </div>
            ))}
         </div>

         {/* Input Area */}
         <div className="p-6 bg-white/[0.01]">
            <div className="glass-input p-2 rounded-2xl flex items-center gap-2 pr-2">
               <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <Smile size={20} />
               </button>
               <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <Paperclip size={20} />
               </button>
               <input 
                 type="text" 
                 placeholder="Type your message..." 
                 className="flex-1 bg-transparent border-none outline-none text-white text-sm"
               />
               <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  <Send size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MessengerModule;
