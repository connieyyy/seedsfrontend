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
import chatfroggy from "../assets/chatfroggy.png";
import frogbutton from "../assets/frogbutton.png";
import decorate from "../assets/decorate.png";
import food from "../assets/food.png";
import log from "../assets/log.png";
import missions from "../assets/missions.png";

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={chatfroggy}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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

  container: {
    flex: 1,
  },
});
