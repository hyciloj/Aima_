import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import Regenerate from "@/assets/svgs/regenerate";
import Reload from "@/assets/svgs/reload";
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  TalkScreen: undefined; // No parameters for TalkScreen
  ChatScreen: undefined; // No parameters for ChatScreen
};

type TalkScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TalkScreen'>;

export default function TalkScreen() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [AIResponse, setAIResponse] = useState(false);
  const [AISpeaking, setAISpeaking] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // New state for popup
  const lottieRef = useRef<LottieView | null>(null);

  const navigation = useNavigation<TalkScreenNavigationProp>(); // Hook for navigation

  const startRecording = async () => {
    // Commenting out functionality
  };

  const stopRecording = async () => {
    // Commenting out functionality
  };

  const sendAudioToWhisper = async (uri: string) => {
    // Placeholder function
  };

  const sendToGpt = async (text: string) => {
    // Placeholder function
  };

  const speakText = (text: string) => {
    // Placeholder function
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setShowPopup(true); // Show the "Coming Soon" popup after 3 seconds
    }, 2000);
  };

  const handleNavigateToChatScreen = () => {
    // Stop the recording and any ongoing processes
    stopRecording();  // Ensure the recording is stopped if it's ongoing
    setIsRecording(false); // Reset recording state
    setShowPopup(false); // Close the popup
    setAIResponse(false); // Reset AI response state
    setText(""); // Clear the displayed text
    // Navigate to ChatScreen
    navigation.navigate('ChatScreen');
  };

  const handleClosePopup = () => {
    stopRecording();  // Ensure the recording is stopped if it's ongoing
    setIsRecording(false); // Reset recording state
    setShowPopup(false); // Close the popup
  };

  useEffect(() => {
    if (AISpeaking) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [AISpeaking]);

  return (
    <LinearGradient
      colors={["#7b87c7", "#7b87c7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle={"light-content"} />
      {AIResponse && (
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => {
            setAIResponse(false);
            setText("");
          }}
        >
          <AntDesign name="arrowleft" size={scale(20)} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Show popup for "Coming Soon" */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePopup} // Close the popup
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePopup} // Close the popup
            >
              <Text style={styles.closeText}>x</Text>
            </TouchableOpacity>
            <Image
              source={require('@/assets/images/talk_robot.png')}
              style={styles.robotImage}
              resizeMode="contain"
            />
            <Text style={styles.popupTitle}>Coming Soon...</Text>
            <Text style={styles.popupText}>We’re working on something special! Check back soon for new features and updates.</Text>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={handleNavigateToChatScreen} // Navigate to ChatScreen
            >
              <Text style={styles.navigateButtonText}>Go to Write</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        {loading ? (
          <LottieView
            source={require("@/assets/animations/loading.json")}
            autoPlay
            loop
            speed={1.3}
            style={styles.lottie}
          />
        ) : isRecording ? (
          <TouchableOpacity onPress={stopRecording}>
            <LottieView
              source={require("@/assets/animations/animation.json")}
              autoPlay
              loop
              speed={1.3}
              style={styles.lottie}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
          >
            <FontAwesome name="microphone" size={scale(50)} color="#2b3356" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {loading ? "Processing..." : text || "Press the microphone to start!"}
        </Text>
      </View>
      {AIResponse && (
        <View style={styles.responseActions}>
          <TouchableOpacity onPress={() => sendToGpt(text)}>
            <Regenerate />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => speakText(text)}>
            <Reload />
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
  backArrow: {
    position: "absolute",
    top: verticalScale(50),
    left: scale(20),
  },
  content: {
    marginTop: verticalScale(-40),
  },
  lottie: {
    width: scale(250),
    height: scale(250),
  },
  recordButton: {
    width: scale(110),
    height: scale(110),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(100),
  },
  textContainer: {
    alignItems: "center",
    width: scale(350),
    position: "absolute",
    bottom: verticalScale(90),
  },
  text: {
    color: "#fff",
    fontSize: scale(16),
    width: scale(269),
    textAlign: "center",
    lineHeight: 25,
  },
  responseActions: {
    position: "absolute",
    bottom: verticalScale(40),
    left: 0,
    paddingHorizontal: scale(30),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: scale(360),
  },
  // Modern Popup styles
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darkened semi-transparent background
  },
  popupContent: {
    width: "80%", // Set the width to 60% of the screen
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000", // Modern shadow effect
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // For Android shadow effect
  },
  robotImage: {
    width: '100%',
    height: undefined,
    marginBottom: 10,
    aspectRatio: 449 / 296,
  },
  popupTitle: {
    fontSize: scale(20),
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600", // Make the text more bold for modern style
  },
  popupText: {
    fontSize: scale(15),
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "400", // Make the text more bold for modern style
  },
  closeButton: {
    position: "absolute",
    color: "#7b87c7",
    top: 0,
    right: 10,
  },
  closeText: {
    fontSize: scale(24),
    color: "#333",
    fontWeight: "bold", // Bold text for close icon
  },
  navigateButton: {
    backgroundColor: "#7b87c7", // Soft blue for modern feel
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15, // Space between text and button
    alignItems: "center",
    justifyContent: "center",
  },
  navigateButtonText: {
    color: "#fff",
    fontSize: scale(16),
    textAlign: "center",
    fontWeight: "600", // Bold text for modern button
  },
});
