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
import frogbutton from "../assets/frogbutton.png";
import food from "../assets/food.png";
import log from "../assets/log.png";
import missions from "../assets/missions.png";
import axios from "axios";
import { useUser } from "../UserContext.js";
import pencilIcon from "../assets/pencil.png";
import HealthBar from "./HealthBar";

const frogStaticImage = require("../assets/froggy_sprites_anims/froggy_base.png");
const frogJumpGif = require("../assets/froggy_sprites_anims/froggy_fly_once.gif");
const frogJumpingGif = require("../assets/froggy_sprites_anims/froggy_jump.gif");

export default function App({ navigation }) {
  const [isJumping, setIsJumping] = useState(false);
  const [petInfo, setPetInfo] = useState({
    pet: [{ petName: "Froggy", petHealthLevel: 70 }],
  });
  const [intervalId, setIntervalId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const { user } = useUser();
  const API_URL = "http://localhost:3000/pets";

  useEffect(() => {
    const fetchPetInfo = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`${API_URL}/${user.email}`);
          setPetInfo(response.data);
          setNewPetName(
            response.data.pet && response.data.pet ? response.data.petName : ""
          );
        } catch (err) {
          console.error("Error fetching pet information:", err.message);
        }
      }
    };
    fetchPetInfo();

    const id = setInterval(async () => {
      if (user && user.email) {
        try {
          await axios.put(`${API_URL}/${user.email}/updateHealth`);
          const updatedResponse = await axios.get(
            `${API_URL}/${user.email}/getHealth`
          );
          setPetInfo(updatedResponse.data);
        } catch (err) {
          console.error("Error updating pet health:", err.message);
        }
      }
    }, 60 * 30 * 1000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [user]);

  const handleFrogPress = () => {
    if (petInfo.petHealthLevel > 25 && petInfo.petHealthLevel < 90) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 1000);
    }
  };

  const handleEditPress = () => {
    if (isEditing) {
      handleSavePress();
    } else {
      setIsEditing(true);
    }
  };

  const handleSavePress = async () => {
    if (newPetName.trim() === "") {
      alert("Pet name cannot be empty.");
      return;
    }
    try {
      await axios.put(`${API_URL}/${user.email}/updatePetName`, {
        newPetName,
      });

      const updatedResponse = await axios.get(`${API_URL}/${user.email}`);

      setPetInfo(updatedResponse.data);
      setIsEditing(false);

      console.log("Pet name updated and fetched successfully!");
    } catch (err) {
      console.error(
        "Error updating pet name:",
        err.response?.data || err.message || err
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={froggy}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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
                <Text style={styles.petInfoText}>{petInfo.petName} </Text>
                <TouchableOpacity onPress={handleEditPress}>
                  <Image source={pencilIcon} style={styles.pencilIcon} />
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.petInfoText}>Health:</Text>
          <HealthBar health={petInfo.petHealthLevel} />
        </View>

        <TouchableWithoutFeedback onPress={handleFrogPress}>
          <Image
            source={
              petInfo.petHealthLevel > 90
                ? frogJumpingGif
                : isJumping
                ? frogJumpGif
                : frogStaticImage
            }
            style={
              petInfo.petHealthLevel > 90
                ? styles.frogJumpImage
                : isJumping
                ? styles.frogJumpImage
                : styles.frogStaticImage
            }
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
            onPress={() => navigation.navigate("Chat")}
          >
            <Image source={chat} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombutton}
            onPress={() => navigation.navigate("Feed")}
          >
            <Image source={frogbutton} style={styles.buttonImage} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottombutton}
            onPress={() => navigation.navigate("Store")}
          >
            <Image source={food} style={styles.buttonImage} />
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
  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  petInfoText: {
    fontSize: 24,
    color: "#fff",
    padding: 5,
    marginBottom: 5,
  },
  petInfoTextInput: {
    fontSize: 24,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginRight: 10,
    width: 200,
  },
  pencilIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  saveText: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 10,
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
