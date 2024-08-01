import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

import lilypadlogin from "../assets/lilypadlogin.jpg";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/auth/signup", {
        username,
        email,
        password,
      });
      alert("User created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      alert("Error creating user");
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
          <Text style={styles.greeting}>Get Started</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
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
    height: 450,
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
