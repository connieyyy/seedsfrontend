import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import { useUser } from "../UserContext.js";
import background from "../assets/main.png";
import bowchat from "../assets/accessorysprites/bowfroggy/bowfroggy_chat.gif";
import partychat from "../assets/accessorysprites/partyfroggy/partyfroggy_chat.gif";
import tophatchat from "../assets/accessorysprites/tophatfroggy/tophatfroggy_chat.gif";

const defaultFrogGif = require("../assets/froggy_sprites_anims/froggy_chat.gif");

const accessoryGifs = {
  Bow: bowchat,
  "Party Hat": partychat,
  "Top Hat": tophatchat,
};

const messages = [
  "Hello! I'm your froggy friend! I can provide some feedback on your diet, suggest some recipes, or offer some nutrition tips.",
  "How may I help you?",
  "Keep up the good work!",
];

export default function App({ navigation }) {
  const { user } = useUser();
  const [messageIndex, setMessageIndex] = useState(0);
  const [frogGif, setFrogGif] = useState(defaultFrogGif);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pets/${user.email}/accessory`
        );
        const accessory = response.data.accessory;
        updateFrogGif(accessory);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const updateFrogGif = (accessory) => {
    if (accessory && accessoryGifs[accessory]) {
      setFrogGif(accessoryGifs[accessory]);
    } else {
      setFrogGif(defaultFrogGif);
    }
  };

  const handleBubbleTap = () => {
    if (messageIndex === 1) return;
    setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const handleOptionSelect = async (option) => {
    if (option === "Tips") {
      try {
        const response = await axios.post("http://localhost:3000/chat/ask", {
          prompt: "Give me a nutrition tip.",
        });
        Alert.alert("Nutrition Tip", response.data.reply);
      } catch (error) {
        console.error("Error fetching nutrition tip:", error);
        Alert.alert("Error", "Could not fetch nutrition tip.");
      }
    }
    setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <Image source={frogGif} style={styles.frogEatImage} />
          <TouchableOpacity
            style={styles.speechBubbleContainer}
            onPress={handleBubbleTap}
            disabled={messageIndex === 1} // Disable tap when options are shown
          >
            <Text style={styles.speechBubbleText}>
              {messages[messageIndex]}
            </Text>
          </TouchableOpacity>
          {messageIndex === 1 && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("Feedback")}
              >
                <Text style={styles.optionText}>Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("Recipes")}
              >
                <Text style={styles.optionText}>Recipes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("Tips")}
              >
                <Text style={styles.optionText}>Tips</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  speechBubbleContainer: {
    backgroundColor: "#B8ECE8",
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 500,
    maxWidth: 340,
    alignItems: "center",
    paddingHorizontal: 15,
  },

  speechBubbleText: {
    fontSize: 16,
    color: "black",
  },

  optionsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 450,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },

  optionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
    width: "50%",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    color: "black",
  },

  frogEatImage: {
    width: 400,
    height: 200,
    resizeMode: "contain",
    marginTop: 200,
  },

  container: {
    flex: 1,
  },
});
