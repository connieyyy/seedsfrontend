import React from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";

import lilypadlogin from "../assets/lilypadlogin.jpg";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypadlogin}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.text}>Login Screen</Text>
        <Button title="Login" onPress={() => navigation.navigate("Home")} />
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

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
