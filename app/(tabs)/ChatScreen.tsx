import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_KEY = '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';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  time: Date;
};

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[]; 
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'مرحبًا، أنا إما مساعدتك في تعلم اللغة الإنجليزية. كيف يمكنني مساعدتك اليوم؟',
      time: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const isArabicText = (text: string) => /[\u0600-\u06FF]/.test(text);

  const refreshConversation = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'مرحبًا، أنا إما مساعدتك في تعلم اللغة الإنجليزية. كيف يمكنني مساعدتك اليوم؟',
        time: new Date(),
      },
    ]);
    setUserMessage('');
    setIsTyping(false);
    setShowInput(false);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;  // Prevent sending empty messages

    const newMessage: Message = { sender: 'user', text: userMessage, time: new Date() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserMessage('');  // Clear the user input field
    setIsTyping(true);

    try {
      // Scroll to the bottom after sending the message
      flatListRef.current?.scrollToEnd({ animated: true });

      const teacherContext = `
        You are an English teacher who also speaks Arabic. Your responsibilities are:
        
        1. Correct the user's English sentences:
            - Provide the corrected version of the sentence if not correct.
            - Explain the corrections in simple English.
            - Provide the explanation in Arabic as well.
        
        2. Handle Arabic messages as follows:
            - Respond with the original Arabic sentence.
            - Translate the sentence into English.
            - Explain the meaning in simple English.
        
        Your goal is to make learning English easy and accessible by leveraging both languages effectively.
      `;

      // Send the request to OpenAI API
      const response = await axios.post<ChatCompletionResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: teacherContext },
            { role: 'user', content: userMessage },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botReply = response.data.choices[0]?.message?.content || 'Sorry, no response.';
      const botMessage: Message = { sender: 'bot', text: botReply, time: new Date() };

      // Add the bot's response to the chat
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error with Chat API:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
        time: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      // Ensure typing indicator is hidden
      setIsTyping(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.sender === 'user' ? '#FFF' : '#000',
              textAlign: isArabicText(item.text) ? 'left' : 'right',
              writingDirection: isArabicText(item.text) ? 'rtl' : 'ltr',
            },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            {
              color: item.sender === 'user' ? '#FFF' : '#666',
              textAlign: item.sender === 'user' ? 'right' : 'left',
            },
          ]}
        >
          {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor="#F7F9FF" />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.messagesContainer}
        />
        {isTyping && <Text style={styles.typingIndicator}>AIma is typing...</Text>}
        {!showInput && (
          <TouchableOpacity
            style={styles.startChatButton}
            onPress={() => setShowInput(true)}
          >
            <Text style={styles.startChatText}>Let’s Start</Text>
          </TouchableOpacity>
        )}
        {showInput && (
          <View style={styles.roundedInputContainer}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.refreshButton} onPress={refreshConversation}>
                <Icon name="refresh" size={20} color="#FFF" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={userMessage}
                onChangeText={setUserMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Icon name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#F7F9FF', paddingTop: 30, },
  container: { flex: 1 },
  messagesContainer: { flexGrow: 1, padding: 10 },
  messageContainer: { marginVertical: 5 },
  userMessageContainer: { alignItems: 'flex-end' },
  botMessageContainer: { alignItems: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 20, maxWidth: '80%' },
  userBubble: { backgroundColor: '#7b87c7', borderBottomRightRadius: 5 },
  botBubble: { backgroundColor: '#E1E8ED', borderBottomLeftRadius: 5 },
  messageText: { fontSize: 16, writingDirection: 'auto' },
  timestamp: { fontSize: 10, marginTop: 2 },
  typingIndicator: { fontStyle: 'italic', color: '#888', marginLeft: 15, marginBottom: 5 },
  roundedInputContainer: { backgroundColor: '#FFF', borderRadius: 30, marginHorizontal: 10, marginBottom: 10, padding: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#fff', borderRadius: 20, paddingHorizontal: 15, marginRight: 10, backgroundColor: '#FFF' },
  sendButton: { backgroundColor: '#7b87c7', borderRadius: 20, padding: 10 },
  startChatButton: { position: 'absolute', bottom: 15, left: 20, right: 20, backgroundColor: '#7b87c7', paddingVertical: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  startChatText: { color: '#fff', fontSize: 16 },
  refreshButton: { backgroundColor: '#7b87c7', borderRadius: 20, padding: 10, marginRight: 5 },
});

export default ChatScreen;
