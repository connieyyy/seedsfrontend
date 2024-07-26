import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useUser } from "../UserContext.js";
import frogimg from "../assets/froggy_sprites_anims/froggy_base.png";
import Icon from "react-native-vector-icons/FontAwesome"; // Correct import

const API_URL = "http://localhost:3000/friends";

export default function FriendsPage() {
  const { user } = useUser(); // Accessing user from context
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [error, setError] = useState("");
  const [noFriendsMessage, setNoFriendsMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/${user.email}`);
      const friendsList = response.data;
      if (friendsList.length === 0) {
        setNoFriendsMessage("No friends yet");
      } else {
        setNoFriendsMessage("");
      }
      setFriends(friendsList);
    } catch (err) {
      setError("Error fetching friends");
    }
  };

  const handleAddFriend = async () => {
    try {
      await axios.post(`${API_URL}/${user.email}/${newFriend}`);
      setNewFriend("");
      fetchFriends();
    } catch (err) {
      setError("Error adding friend");
    }
  };

  const handleRemoveFriend = async (friend) => {
    try {
      await axios.delete(`${API_URL}/${user.email}/${friend}`);
      fetchFriends();
    } catch (err) {
      setError("Error removing friend");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter friend's username"
          placeholderTextColor="black"
          value={newFriend}
          onChangeText={setNewFriend}
        />
        <TouchableOpacity style={styles.addbutton} onPress={handleAddFriend}>
          <Text style={styles.buttonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {noFriendsMessage && (
        <Text style={styles.noFriends}>{noFriendsMessage}</Text>
      )}
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image source={frogimg} style={styles.frogimg} />
            <Text style={styles.friendName}>{item}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFriend(item)}
            >
              <Icon name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#35725D",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80,
    marginVertical: 30,
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "transparent",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "white",
    flex: 1,
    marginRight: 10,
  },
  addbutton: {
    backgroundColor: "#22493F",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#22493F",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  frogimg: {
    width: 80,
    height: 70,
    marginRight: 10,
  },
  error: {
    color: "white",
  },
  noFriends: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#22493F",
    borderRadius: 5,
    padding: 10,
  },
  friendName: {
    fontSize: 18,
    color: "white",
    flex: 1,
  },
  removeButton: {
    padding: 5,
  },
});
