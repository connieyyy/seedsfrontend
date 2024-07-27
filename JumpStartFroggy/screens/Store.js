import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useUser } from "../UserContext.js";
import frogimg from "../assets/froggy_sprites_anims/froggy_base.png";

const API_URL = "http://localhost:3000/feed";

export default function Feed() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchFriends = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`${API_URL}/${user.email}`);
          setFriends(response.data);
        } catch (error) {
          setError("Error fetching friends data");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User not logged in");
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#35725D",
    padding: 10,
  },
});
