import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import dayswamp from "../assets/dayswamp.jpg";

const { height } = Dimensions.get("window");

export default function FoodLog() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={dayswamp}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.overlaytitle}>Missions</Text>
        </View>
      </ImageBackground>
      <View style={styles.instructionsContainer}>
        <Text style={styles.dailymissionsubtitle}>Daily mission:</Text>
        <Text style={styles.yourmissionsubtitle}>Your missions:</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: height * 0.32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlaytitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  overlayText: {
    marginTop: 15,
    fontSize: 16,
    color: "white",
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  instructionsContainer: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#c2cc80",
    padding: 20,
    paddingTop: 30,
  },
  dailymissionsubtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },

  yourmissionsubtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 10,
  },
});
