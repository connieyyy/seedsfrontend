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
import axios from "axios";
import froggy from "../assets/main.png";
import chat from "../assets/chat.png";
import frogbutton from "../assets/frogbutton.png";
import log from "../assets/log.png";
import missions from "../assets/missions.png";
import logoutIcon from "../assets/logout.png";
import { useUser } from "../UserContext.js";
import pencilIcon from "../assets/pencil.png";
import HealthBar from "./HealthBar";
import decor from "../assets/decor.png";
import bowjumping from "../assets/accessorysprites/bowfroggy/bowfroggy_jump.gif";
import bowsad from "../assets/accessorysprites/bowfroggy/bowfroggy_sad.gif";
import bowfrog from "../assets/accessorysprites/bowfroggy/bowfroggy.png";
import bowflying from "../assets/accessorysprites/bowfroggy/bowfroggy_fly_once.gif";
import partyjumping from "../assets/accessorysprites/partyfroggy/partyfroggy_jump.gif";
import partysad from "../assets/accessorysprites/partyfroggy/partyfroggy_sad.gif";
import partyfrog from "../assets/accessorysprites/partyfroggy/partyfroggy.png";
import partyflying from "../assets/accessorysprites/partyfroggy/partyfroggy_fly_once.gif";
import tophatjumping from "../assets/accessorysprites/tophatfroggy/tophatfroggy_jump.gif";
import tophatsad from "../assets/accessorysprites/tophatfroggy/tophatfroggy_sad.gif";
import tophatfrog from "../assets/accessorysprites/tophatfroggy/tophatfroggy.png";
import tophatflying from "../assets/accessorysprites/tophatfroggy/tophatfroggy_fly_once.gif";

const frogStaticImage = require("../assets/froggy_sprites_anims/froggy_base.png");
const frogJumpGif = require("../assets/froggy_sprites_anims/froggy_fly_once.gif");
const frogJumpingGif = require("../assets/froggy_sprites_anims/froggy_jump.gif");
const sadfrogGif = require("../assets/froggy_sprites_anims/froggy_sad.gif");

const accessoryImages = {
  "Top Hat": {
    healthLow: tophatsad,
    healthMedium: tophatfrog,
    healthHigh: tophatjumping,
    flying: tophatflying,
  },
  "Party Hat": {
    healthLow: partysad,
    healthMedium: partyfrog,
    healthHigh: partyjumping,
    flying: partyflying,
  },
  Bow: {
    healthLow: bowsad,
    healthMedium: bowfrog,
    healthHigh: bowjumping,
    flying: bowflying,
  },
};

export default function App({ navigation }) {
  const [isJumping, setIsJumping] = useState(false);
  const [frogImage, setFrogImage] = useState(frogStaticImage);
  const [petInfo, setPetInfo] = useState({
    pet: [{ petName: "Froggy", petHealthLevel: 70, accessory: "" }],
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

  useEffect(() => {
    const fetchImage = async () => {
      const image = await getFrogImage();
      setFrogImage(image);
    };
    fetchImage();
  }, [petInfo.petHealthLevel, isJumping]);

  const getFrogImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pets/${user.email}/accessory`
      );
      const accessory = response.data.accessory;
      const frogHealth = petInfo.petHealthLevel;

      if (frogHealth < 25)
        return accessoryImages[accessory]?.healthLow || sadfrogGif;
      if (frogHealth < 90)
        return isJumping
          ? accessoryImages[accessory]?.flying || frogJumpGif
          : accessoryImages[accessory]?.healthMedium || frogStaticImage;
      return accessoryImages[accessory]?.healthHigh || frogJumpingGif;
    } catch (error) {
      console.error("Error fetching pet accessory:", error);
      return sadfrogGif;
    }
  };

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

  const handleLogoutPress = () => {
    navigation.navigate("Home");
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
            source={frogImage}
            style={
              petInfo.petHealthLevel <= 25 ||
              petInfo.petHealthLevel > 90 ||
              isJumping
                ? styles.frogJumpImage
                : styles.frogStaticImage
            }
          />
        </TouchableWithoutFeedback>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
        >
          <Image source={logoutIcon} style={styles.logoutIcon} />
        </TouchableOpacity>

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
            <Image source={decor} style={styles.buttonImage} />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </ImageBackground>
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
  logoutButton: {
    position: "absolute",
    top: 70,
    right: 20,
    width: 30,
    height: 30,
  },
  logoutIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
