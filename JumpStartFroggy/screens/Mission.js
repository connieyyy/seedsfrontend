import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import swamp from "../assets/swamp.jpg";

export default function Mission() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={swamp}
        style={styles.imageBackground}
        resizeMode="cover"
      ></ImageBackground>
      <View style={styles.colorBackground}>
        {/* Add any additional content here */}
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
    height: 200,
  },
  colorBackground: {
    flex: 1,
    backgroundColor: "#e0f7fa", // Replace with your desired background color
  },
});
