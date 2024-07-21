import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import froggy from "../assets/main.png";
import chat from "../assets/chat.png";
import decorate from "../assets/decorate.png";
import food from "../assets/food.png";
import log from "../assets/log.png";
import missions from "../assets/missions.png";

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={froggy}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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

  container: {
    flex: 1,
  },
});
