import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  BackHandler,
  Alert,
  StyleSheet,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  HomeScreen: undefined;
  ChatScreen: undefined;
  TalkScreen: undefined;
  LessonScreen: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

interface Phrase {
  id: string;
  title: string;
  color: string;
  description: string;
}

interface CardProps {
  title: string;
  description: string;
  image: any; // Replace with ImageSourcePropType if you type-check images
  onPress: () => void;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleExitApp();
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleExitApp = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => BackHandler.exitApp() },
    ]);
  };

  const topPhrases: Phrase[] = [
    { id: '1', title: 'Introducing Yourself', color: '#dee1f8', description: 'Learn basic everyday words.' },
    { id: '2', title: 'Simple Sentences', color: '#dee1f8', description: 'Learn how to form short sentences.' },
    { id: '3', title: 'Common Words', color: '#dee1f8', description: 'Learn to talk about yourself.' },
    { id: '4', title: 'Greetings', color: '#dee1f8', description: 'Learn how to say hello and goodbye.' },
    { id: '5', title: 'Numbers', color: '#dee1f8', description: 'Learn numbers and counting.' },
  ];

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const Card: React.FC<CardProps> = ({ title, description, image, onPress }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image source={image} style={styles.cardImage} resizeMode="contain" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderPhrase = ({ item }: { item: Phrase }) => (
    <TouchableOpacity style={[styles.phraseContainer, { backgroundColor: item.color }]}>
      <Text style={styles.phraseText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleExitApp} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome to Aima</Text>
            <Text style={styles.subtitle}>Your Assistance to Learn English</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('LessonScreen')}>
              <Text style={styles.buttonText}>Let’s Start</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('@/assets/images/h.png')}
            style={styles.robotImage}
            resizeMode="contain"
          />
        </View>

        {/* Favorite AI Section */}
        <Text style={styles.sectionTitle}>Favorite AI</Text>
        <View style={styles.cardRow}>
          <Card
            title="Chat With Aima"
            description="Instant AI help and corrections"
            image={require('@/assets/images/write_robot.png')}
            onPress={() => navigation.navigate('ChatScreen')}
          />
          <Card
            title="Talk With Aima"
            description="Practice and learn conversations"
            image={require('@/assets/images/talk_robot.png')}
            onPress={() => navigation.navigate('TalkScreen')}
          />
        </View>

        {/* Top Phrases Section */}
        <Text style={styles.sectionTitle}>Today's Top 5 Lesson</Text>
        <FlatList
          data={topPhrases}
          renderItem={renderPhrase}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.phraseListContainer}
          showsHorizontalScrollIndicator={false}
        />

        {/* How to Use Aima Section */}
        <Text style={styles.sectionTitle}>How to Use Aima</Text>
        <TouchableOpacity style={styles.getStartedContainer} onPress={openPopup}>
          <Image source={require('@/assets/images/__robot.png')} style={styles.getStartedIcon} />
          <View>
            <Text style={styles.getStartedTitle}>Get Started</Text>
            <Text style={styles.getStartedDescription}>Explore the features of Aima</Text>
          </View>
        </TouchableOpacity>

        {/* Popup Modal */}
        <Modal visible={showPopup} transparent={true} animationType="fade" onRequestClose={closePopup}>
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
              <Image
                source={require('@/assets/images/__robot.png')}
                style={styles.robotImage}
                resizeMode="contain"
              />
              <Text style={styles.popupTitle}>Learn with Aima</Text>
              <Text style={styles.popupText}>
                Aima is your personalized mobile assistant for learning English, designed specifically for Arabic
                users. By combining English learning with Arabic explanations, Aima provides an intuitive and engaging
                experience.
              </Text>
              <TouchableOpacity style={styles.navigateButton} onPress={closePopup}>
                <Text style={styles.navigateButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: { flex: 1, backgroundColor: '#F7F9FF', paddingHorizontal: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exitButton: { padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 30 },
  exitButtonText: { fontSize: 18, color: '#333' },
  container: { borderRadius: 10, paddingHorizontal: 20, backgroundColor: '#d6daf7', flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 10, },
  content: { flex: 3, justifyContent: 'center', paddingVertical: 30 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  subtitle: { fontSize: 14, marginBottom: 15, color: '#000', textAlign: 'left' },
  startButton: { backgroundColor: '#7b87c7', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 50 },
  buttonText: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
  robotImage: { flex: 3.8, width: '100%', height: '100%', marginTop: 0 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 },
  cardContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginVertical: 8, alignItems: 'center', width: '48%', height: 190 },
  cardImage: { width: 90, height: 90 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  cardDescription: { fontSize: 12, color: '#777', textAlign: 'center' },
  phraseContainer: { padding: 10, height: 60, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  phraseText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  phraseListContainer: { marginBottom: 20 },
  getStartedContainer: { flexDirection: 'row', backgroundColor: '#d6daf7', borderRadius: 10, padding: 20, alignItems: 'center', marginBottom: 30 },
  getStartedIcon: { width: 50, height: 50, marginRight: 10 },
  getStartedTitle: { fontSize: 16, fontWeight: 'bold' },
  getStartedDescription: { fontSize: 12, color: '#777' },
  popupContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  popupContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 10, right: 10 },
  closeText: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  popupTitle: { fontSize: 20, fontWeight: '600', marginVertical: 10 },
  popupText: { fontSize: 15, textAlign: 'center', marginVertical: 10 },
  navigateButton: { backgroundColor: '#7b87c7', padding: 10, borderRadius: 10, marginTop: 10 },
  navigateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;
