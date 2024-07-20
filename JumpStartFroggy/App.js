import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";

import lilypadlogin from "./assets/lilypadlogin.jpg";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypadlogin}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Jump start into a healthy college life!
        </Text>

        <View style={styles.buttoncontainer}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => Alert.alert("Button Pressed!")}
            underlayColor="#1e90ff"
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => Alert.alert("Button Pressed!")}
            underlayColor="#1e90ff"
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    alignItems: "center",

    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },

  buttoncontainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
