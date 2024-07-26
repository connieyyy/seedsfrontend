import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import background from "../assets/main.png";
import frogbutton from "../assets/frogbutton.png";
import decorate from "../assets/decorate.png";
import food from "../assets/food.png";

const frogEatGif = require("../assets/froggy_sprites_anims/froggy_chat.gif");

const messages = [
  "Hello! I'm your froggy friend! I can provide some feedback on your diet, suggest some recipes, or offer some nutrition tips.",
  "How may I help you?",
  "Keep up the good work!",
];

export default function App({ navigation }) {
  const [messageIndex, setMessageIndex] = useState(0);

  const handleBubbleTap = () => {
    if (messageIndex === 1) return;
    setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const handleOptionSelect = (option) => {
    console.log(option);
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
          <Image source={frogEatGif} style={styles.frogEatImage} />
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
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.bottombutton}
              onPress={() => navigation.navigate("Food")}
            >
              <Image source={food} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottombutton}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Image source={frogbutton} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottombutton}
              onPress={() => navigation.navigate("Closet")}
            >
              <Image source={decorate} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
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

  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    marginBottom: 10,
  },

  bottombutton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 35,
    width: 70,
    height: 70,
    overflow: "hidden",
  },

  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
