import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Button } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import from the package

type RootStackParamList = {
  LessonScreen: { category?: string }; // category is optional
};

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'LessonScreen'>;

const API_KEY_LESSON = process.env.EXPO_PUBLIC_API_KEY_LESSON;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const CATEGORIES = ["Grammar", "Vocabulary", "Pronunciation", "Sentence Structure", "Idioms", "+"];

const LessonScreen: React.FC = () => {
  const route = useRoute<LessonScreenRouteProp>();
  const { category } = route.params || {}; // Safely access route.params

  const [selectedCategory, setSelectedCategory] = useState<string>(category || ""); // Start with an empty string
  const [lessonCache, setLessonCache] = useState<{ [key: string]: string[] }>({});
  const [lessonMessages, setLessonMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newLesson, setNewLesson] = useState<string>("");

  // Fetching lesson details (for the selected category)
  const fetchLessonDetails = useCallback(async (category: string) => {
    if (lessonCache[category]) {
      setLessonMessages(lessonCache[category]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY_LESSON}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You provide English lessons with Arabic translations." },
            { role: "user", content: `Provide a lesson for the category "${category}" in English with Arabic translations. Include examples as individual points.` },
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch lesson.");

      const newLessonMessages = data.choices?.[0]?.message?.content?.split("\n").filter(Boolean) || ["No content available."];
      setLessonCache((prevCache) => ({ ...prevCache, [category]: newLessonMessages }));
      setLessonMessages(newLessonMessages);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load the lesson. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [lessonCache]);

  // Fetching advanced lesson details
  const fetchAdvancedLessonDetails = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY_LESSON}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You provide advanced English lessons with Arabic translations." },
            { role: "user", content: `Provide an advanced lesson for the category "${category}" in English with Arabic translations. Include examples as individual points.` },
          ],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch advanced lesson.");

      const advancedLessonMessages = data.choices?.[0]?.message?.content?.split("\n").filter(Boolean) || ["No content available."];
      setLessonMessages(advancedLessonMessages);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load the advanced lesson. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchLessonDetails(selectedCategory);
    }
  }, [selectedCategory, fetchLessonDetails]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddNewLesson = () => {
    if (newLesson.trim() === "") {
      Alert.alert("Error", "Please provide a lesson content.");
      return;
    }

    // Add new lesson content to the lessonMessages
    setLessonMessages([newLesson, ...lessonMessages]);
    setSelectedCategory(`${newLesson}`); // Update the category title with the new lesson title
    setNewLesson(""); // Clear input after adding
    Alert.alert("Success", "New lesson added!");
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            {selectedCategory}
          </Text>
          <Text style={styles.subtitle}>
            Learn with Aima assistance:
          </Text>
        </View>

        <View style={styles.categoryButtons}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, selectedCategory === cat && styles.selectedCategoryButton]}
              onPress={() => handleCategoryChange(cat)}
            >
              <Text
                style={[styles.categoryButtonText, selectedCategory === cat && { color: '#fff' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCategory === "+" ? (
          <View style={styles.addLessonWrapper}>
            <TextInput
              style={styles.lessonInput}
              placeholder="Enter your new lesson here..."
              value={newLesson}
              onChangeText={setNewLesson}
            />
            <View style={styles.buttonTextLesson}>
              <Button title="Add Lesson" onPress={handleAddNewLesson} color="#7b87c7" />
            </View>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#7b87c7" style={styles.loader} />
        ) : (
          <View style={styles.lessonWrapper}>
            {lessonMessages.map((line: string, index: number) => (
              <View key={index} style={styles.messageBox}>
                <Text style={styles.lessonContent}>{line}</Text>
              </View>
            ))}
            <View style={styles.buttonContainer}>
              {lessonMessages.length > 0 && (
                <Button title="Advanced" onPress={() => fetchAdvancedLessonDetails(selectedCategory)} color="#7b87c7" />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F8FAFD',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#7b87c7',
  },
  categoryButtonText: {
    color: '#1A202C',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 30,
    alignSelf: 'center',
  },
  lessonWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
  },
  messageBox: {
    marginBottom: 15,
  },
  lessonContent: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  addLessonWrapper: {
    padding: 20,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
  },
  lessonInput: {
    height: 60,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  buttonTextLesson: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LessonScreen;
