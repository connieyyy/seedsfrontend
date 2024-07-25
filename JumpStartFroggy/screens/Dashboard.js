import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from "react-native";
import froggy from "../assets/main.png";
import chat from "../assets/chat.png";
import decorate from "../assets/decorate.png";
import food from "../assets/food.png";
import log from "../assets/log.png";
import missions from "../assets/missions.png";
import axios from "axios";
import { useUser } from "../UserContext.js";
import pencilIcon from "../assets/pencil.png";

const frogStaticImage = require("../assets/froggy_sprites_anims/froggy_base.png");
const frogJumpGif = require("../assets/froggy_sprites_anims/froggy_jump_once.gif");

export default function App({ navigation }) {
  const [isJumping, setIsJumping] = useState(false);
  const [petInfo, setPetInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPetName, setNewPetName] = useState(false);
  const { user } = useUser();
  const API_URL = "http://localhost:3000/pets";

  useEffect(() => {
    const fetchPetInfo = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`${API_URL}/${user.email}`);
          setPetInfo(response.data);
        } catch (err) {
          console.error("Error fetching pet information:", err.message);
        }
      }
    };
    fetchPetInfo();
  }, [user]);

  const handleFrogPress = () => {
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
    }, 1000); // Adjust timeout based on the GIF duration
  };

  const handleSavePress = async () => {
    try {
      await axios.put(`${API_URL}/${email}`, {
        petName: newPetName,
      });
      setPetInfo((prevInfo) => ({
        ...prevInfo,
        pet: [
          {
            ...prevInfo.pet[0],
            petName: newPetName,
          },
        ],
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating pet name", err);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={froggy}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {petInfo && (
          <View style={styles.petInfoContainer}>
            <View style={styles.petInfoRow}>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.petInfoTextInput}
                    value={newPetName}
                    onChangeText={setNewPetName}
                  />
                  <TouchableOpacity onPress={handleSavePress}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.petInfoText}>
                    {/* Pet Name: {petInfo.pet[0].petName} */ { petInfo }}
                  </Text>
                  <TouchableOpacity onPress={handleEditPress}>
                    <Image source={pencilIcon} style={styles.pencilIcon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <Text style={styles.petInfoText}>
              Pet Health Level: {petInfo.pet[0].petHealthLevel}
            </Text>
            <Text style={styles.petInfoText}>
              Pet Age: {petInfo.pet[0].petAge}
            </Text>
          </View>
        )}

        <TouchableWithoutFeedback
          onPress={handleFrogPress}
          style={styles.frogButton}
        >
          <Image
            key={isJumping ? "jumping" : "static"}
            source={isJumping ? frogJumpGif : frogStaticImage}
            style={isJumping ? styles.frogJumpImage : styles.frogStaticImage}
            fadeDuration={0}
          />
        </TouchableWithoutFeedback>

        <View style={styles.topbuttonContainer}>
          <TouchableOpacity
            style={styles.topbutton}
            onPress={() => navigation.navigate("Missions")}
          >
            <Image source={missions} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topbutton}
            onPress={() => navigation.navigate("Foodlog")}
          >
            <Image source={log} style={styles.buttonImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.bottombutton}
            onPress={() => navigation.navigate("Food")}
          >
            <Image source={food} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombutton}
            onPress={() => navigation.navigate("Chat")}
          >
            <Image source={chat} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombutton}
            onPress={() => navigation.navigate("Closet")}
          >
            <Image source={decorate} style={styles.buttonImage} />
          </TouchableOpacity>
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

  petInfoContainer: {
    position: "absolute",
    top: 70,
    left: 30,
  },
  petInfoText: {
    fontSize: 24,
    color: "#fff",
    padding: 5,
    marginBottom: 5,
  },

  topbuttonContainer: {
    position: "absolute",
    top: 130,
    right: 20,
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

  topbutton: {
    marginHorizontal: 10,
    marginTop: 25,
    borderRadius: 10,
    width: 70,
    height: 70,
    overflow: "hidden",
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

  frogStaticImage: {
    width: 350,
    height: 380,
    resizeMode: "contain",
  },

  frogJumpImage: {
    width: 360,
    height: 400,
    resizeMode: "contain",
  },

  container: {
    flex: 1,
  },
});
