import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { auth } from "../src/firebase-config.js";
import { signInWithCustomToken } from "firebase/auth";

import lilypadlogin from "../assets/lilypadlogin.jpg";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      const { token } = response.data;

      await signInWithCustomToken(auth, token);

      alert("User created successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypadlogin}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.loginbox}>
          <Text style={styles.greeting}>Welcome back</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
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

  greeting: {
    marginTop: 30,
    marginBottom: 30,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    color: "#146a65",
  },

  loginbox: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    padding: 20,
    alignItems: "center",
    height: 400,
  },

  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#146a65",
    borderRadius: 10,
    width: "100%",
    padding: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
