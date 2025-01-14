import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // Import icons for iOS
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Import MaterialIcons for microphone icon

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7a87c7', 
        headerShown: false,
        tabBarButton: HapticTab, 
        tabBarStyle: Platform.select({
          ios: {
            shadowColor: 'rgba(0, 0, 0, 0.1)', 
            shadowOpacity: 0.2,
            shadowRadius: 4,
            paddingTop: 10,
            height: 100, 
            backgroundColor: 'white', 
          },
          android: {
            shadowColor: 'rgba(0, 0, 0, 0.1)', 
            shadowOpacity: 0.2,
            shadowRadius: 4,
            paddingTop: 10,
            height: 80, 
            backgroundColor: 'white', 
          },
          default: {
            height: 100, 
            shadowColor: 'rgba(0, 0, 0, 0.1)', 
            shadowOpacity: 0.2,
            shadowRadius: 4,
            paddingTop: 10,
            backgroundColor: 'white', 
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="house.fill" color={color} />  // iOS version with MaterialCommunityIcons
            ) : (
              <AntDesign name="home" size={28} color={color} />  // Android version with AntDesign
            ),
        }}
      />
      <Tabs.Screen
        name="LessonScreen"
        options={{
          title: 'Lesson',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="book.fill" color={color} />  // iOS version with MaterialCommunityIcons
            ) : (
              <AntDesign name="book" size={28} color={color} />  // Android version with AntDesign
            ),
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          title: 'Write',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="message.fill" color={color} />  // iOS version with MaterialCommunityIcons
            ) : (
              <AntDesign name="message1" size={28} color={color} />  // Android version with AntDesign
            ),
        }}
      />
      <Tabs.Screen
        name="TalkScreen"
        options={{
          title: 'Talk',
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="mic.fill" color={color} />  // iOS version with MaterialCommunityIcons
            ) : (
              <MaterialIcons name="mic" size={28} color={color} />  // Android version with MaterialIcons
            ),
        }}
      />
    </Tabs>
  );
}
