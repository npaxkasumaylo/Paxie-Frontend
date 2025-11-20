import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minus, ArrowBigDown, ChevronDown, ChevronUp, Mic, Paperclip, Maximize2, User, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import BotIcon from './BotIcon';
import { api } from '../api/api';
import pdfToText from 'react-pdftotext';
import { toast } from 'react-toastify';
import Toast from './Toast';

export default function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const convoId = useState(crypto.randomUUID());

  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const chatButtonRef = useRef(null); // <-- new ref for button
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

 useEffect(() => {
  const handleBeforeUnload = () => {
    localStorage.removeItem("npax-ref");
    deleteSession();
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

  const deleteSession = async () => {
     await api.deleteSession(convoId);
  }


  useEffect(() => {
    if (localStorage.getItem("npax-ref") == null ) {
      const greeting = {
        id: 1,
        text: t('chatbotGreeting'),
        sender: 'bot',
        convoId: convoId
      };
      localStorage.setItem("npax-ref", JSON.stringify([greeting]))
    } else {
       const chatHistory = JSON.parse(localStorage.getItem("npax-ref"));
        setMessages(chatHistory)
    }
   
  }, [setMessages])

  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        id: 1,
        text: t('chatbotGreeting'),
        sender: 'bot',
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    if (!isOpen && showHelp) {
      const fullMessage = t('chatbotHelpMessage');
      let index = 0;

      setHelpText("");

      const interval = setInterval(() => {
        if (index < fullMessage.length) {
          setHelpText(fullMessage.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowHelp(false), 1000);
        }
      }, 100);

      return () => clearInterval(interval);
    } else if (!isOpen && !showHelp) {
      setHelpText(t('chatbotHelpMessage'));
    }
  }, [isOpen, showHelp, t]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setMessages(prevMessages =>
        prevMessages.map(message => {
          if (message.sender === 'bot' && message.translationKey) {
            return {
              ...message,
              text: t(message.translationKey)
            };
          }
          return message;
        })
      );
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [t]);

  

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target) &&
        chatButtonRef.current &&
        !chatButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    const currentFile = attachedFile;
    const userId = crypto.randomUUID();

    const userMessage = {
      id: userId,
      text: inputMessage,
      sender: 'user',
      attachedFile: currentFile,
      convoId: convoId
    };

    setMessages(prev => {
      const updated = [...prev, userMessage]
      localStorage.setItem("npax-ref", JSON.stringify(updated));
      return updated;
    });
    setInputMessage('');
    setAttachedFile(null);
    setIsTyping(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    var text = "";
    if (currentFile) {
      await pdfToText(currentFile)
        .then((txt) => text = txt)
        .catch((error) => console.error("Failed to extract text from pdf"));
    }

    try {
      var res = "";
      if(currentFile) {
        // console.log(userId)
        var query = inputMessage + " || Uploaded File: " + text;
         res = await api.getAIResponse(query, convoId);
      } else {
        res = await api.getAIResponse(inputMessage, convoId);
      }
      
      const botMessage = {
          id: crypto.randomUUID(),
          text: res.data,
          sender: 'bot',
          userId: userId,
          convoId: convoId

        };
        setMessages(prev => {
          const updated = [...prev, botMessage]
          localStorage.setItem("npax-ref", JSON.stringify(updated));
          return updated;
        });
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        text: t('chatbotError'),
        sender: 'bot',
      };
      setMessages(prev => {
        const updated = [...prev, errorMessage];
        localStorage.setItem("npax-ref", JSON.stringify(updated));
        return updated;
      });
      
    } finally {
      setIsTyping(false); 
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language === 'ja' ? 'ja-JP' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev + transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setAttachedFile(file);
      } else {
        notify("Wrong file type.", "warning");
      }
    }
  };

    const notify = (msg, status) => {
        if (status === "success") {
          toast.success(msg);
        } else if (status === "error") {
          toast.error(msg);
        } else if (status === "warning") {
          toast.info(msg);
        }
      };

  const handleFileClick = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (['pdf'].includes(ext)) {
        setAttachedFile(file);
      }
    }
  };
  return (
    <>
      {/* Floating Help Message */}
      {!isOpen && showHelp && (
        <div className="fixed bottom-24 right-8 px-4 py-2 rounded-lg shadow-lg transition-all bg-blue-500 text-white z-40">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{helpText}</span>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button
        ref={chatButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 p-1 bg-gray-700 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 border-2 border-blue-600 z-40 ${
          isOpen ? 'scale-110' : ''}`}
      >
        <div className={`transition-all duration-500 ease-in-out transform ${
            isOpen ? 'rotate-180 opacity-100 scale-100' : 'rotate-0 opacity-90 scale-95'}`}
        >
          {!isOpen ? (
            <BotIcon w={45} h={45} />
          ) : (
            <ChevronUp className="text-white h-11 w-11" />
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bg-white shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 animate-chatPopIn ${
            isMaximized
              ? 'inset-0 rounded-none'
              : 'bottom-24 right-8 w-[380px] h-[450px] rounded-3xl'
          }`}
        >
            <div className={`w-full  bg-white shadow-2xl flex flex-col overflow-hidden`}>
              {/* Chat Header */}
              <div className=" bg-blue-500 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Bot Icon */}
                  <div className="w-10 h-10 bg-white ml-1.5 rounded-full flex items-center justify-center">
                    <BotIcon w={30} h={30} />
                  </div>
                  <h3 className="font-semibold text-white text-lg">Chat With Paxie</h3>
                </div>
                <div className="flex items-center gap-1">
                  {/* Maximize Button */}
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="text-white hover:bg-blue-600 rounded-lg p-1 transition-colors"
                    title={isMaximized ? "Restore" : "Maximize"}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  {/* Minimize Button */}
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:bg-blue-600 rounded-lg p-1 transition-colors"
                    title="Minimize"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                </div>
              </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {(isMaximized && message.sender != 'user') && 
                  <div className="w-10 h-10 mt-auto mr-2 bg-white rounded-full flex items-center justify-center">
                  <BotIcon w={30} h={30} />
                </div>}

                <div className={`max-w-[85%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>

                  {message.attachedFile && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleFileClick(message.attachedFile)}
                        className={`text-xs ${message.sender === 'user' ? 'text-blue-100 hover:text-blue-200' : 'text-gray-600 hover:text-gray-800'} flex items-center gap-1 cursor-pointer underline`}
                      >
                        <Paperclip className="w-3 h-3" />
                        {message.attachedFile.name}
                      </button>
                    </div>
                  )}
                </div>
                {(isMaximized && message.sender === 'user') &&
                    <div className="w-10 h-10 mt-auto ml-2 text-gray-400 bg-white rounded-full flex items-center justify-center">
                    <User w={30} h={30} />
                  </div>}
              </div>
              
            ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  {isMaximized && <div className="w-10 h-10 mt-auto mr-2 bg-white rounded-full flex items-center justify-center">
                    <BotIcon w={30} h={30} />
                  </div>}
                  <div className="min-w-16 h-10 mt-auto mr-2 bg-white rounded-full flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached File */}
            {attachedFile && <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Attached file:</div>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {attachedFile.name}
                   <button onClick={() => setAttachedFile(null)} className=" ml-2 transition-all ease-in-out hover:scale-110">
                      <XCircle className='text-gray-400'/>
                    </button>
                </div>
            </div>}

          {/* Input */}
          <div
            className={`p-4 bg-white border-t border-gray-200 ${isDragOver ? 'bg-blue-50 border-blue-300' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2">
              {/* File Upload Button */}
              <button
                onClick={handleAttachClick}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                disabled={isTyping}
              >
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              {/* Message Text Box */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbotPlaceholder')}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                disabled={isTyping}
              />
              {(inputMessage.trim() || attachedFile) ? (
                <button
                  onClick={handleSendMessage}
                  disabled={((!inputMessage.trim() && !attachedFile) || isTyping)}
                  className={`p-2 rounded-full transition-colors ${
                    ((!inputMessage.trim() && !attachedFile) || isTyping)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  onClick={handleVoiceClick}
                  disabled={isTyping}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : isTyping
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <Mic className={`w-4 h-4 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: 'none' }}
            />
          </div>

          <Toast />
          
        </div>
      )}
    </>
  );
}