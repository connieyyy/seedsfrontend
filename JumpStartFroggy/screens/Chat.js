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
  ScrollView,
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
  const [recipe, setRecipe] = useState(null);

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
    if (option === "Feedback") {
      try {
        const response = await axios.post("http://localhost:3000/chat/askg", {
          prompt: "Give me a nutrition tip.",
        });
        messages[2] = response.data.reply;
      } catch (error) {
        console.error("Error fetching nutrition tip:", error);
        Alert.alert("Error", "Could not fetch nutrition tip.");
      }
    } else if (option === "Recipes") {
      const fetchedRecipe = await fetchRecipe();
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
      }
    }
    setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const fetchRecipe = async () => {
    try {
      const response = await axios.get("http://localhost:3000/chat");
      const { title, instructions, readyInMinutes, image } = response.data;
      return { title, instructions, readyInMinutes, image };
    } catch (error) {
      console.error("Error fetching recipe:", error);
      Alert.alert("Error", "Could not fetch recipe.");
      return null;
    }
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return "";
    return instructions
      .split(". ")
      .map((instruction, index) => {
        return `${index + 1}. ${instruction.trim()}.`;
      })
      .join("\n");
  };

  const handleExitRecipe = () => {
    setRecipe(null);
    setMessageIndex(0);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {!recipe && <Image source={frogGif} style={styles.frogEatImage} />}
          <TouchableOpacity
            style={styles.speechBubbleContainer}
            onPress={handleBubbleTap}
            disabled={messageIndex === 1} // Disable tap when options are shown
          >
            <Text style={styles.speechBubbleText}>
              {messages[messageIndex]}
            </Text>
          </TouchableOpacity>
          {messageIndex === 1 && !recipe && (
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
          {recipe && (
            <View style={styles.recipeContainer}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeReadyIn}>
                Ready in: {recipe.readyInMinutes} minutes
              </Text>
              <ScrollView style={styles.recipeInstructions}>
                <Text>{formatInstructions(recipe.instructions)}</Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.exitButton}
                onPress={handleExitRecipe}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
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
    maxHeight: 255,
    alignItems: "center",
    overflowY: "scroll",
    paddingHorizontal: 15,
  },

  speechBubbleText: {
    fontSize: 16,
    color: "black",
    whiteSpace: "pre-line",
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

  recipeContainer: {
    backgroundColor: "#FFF1DC",
    borderRadius: 10,
    padding: 20,
    marginTop: 150,
    alignItems: "center",
  },

  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  recipeImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },

  recipeReadyIn: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },

  recipeInstructions: {
    fontSize: 16,
    color: "black",
    whiteSpace: "pre-line",
  },

  exitButton: {
    marginTop: 20,
    backgroundColor: "#ff6347",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },

  exitButtonText: {
    fontSize: 16,
    color: "white",
  },
});
