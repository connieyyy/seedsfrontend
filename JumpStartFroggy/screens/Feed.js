import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useUser } from "../UserContext.js";
import { useNavigation } from "@react-navigation/native";
import frogimg from "../assets/froggy_sprites_anims/froggy_base.png";
import Icon from "react-native-vector-icons/FontAwesome";
const API_URL = "http://localhost:3000/feed";

export default function Feed() {
  const [friends, setFriends] = useState([]);
  const { user } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriends = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`${API_URL}/${user.email}`);
          setFriends(response.data);
        } catch (error) {
          setError("Error fetching friends data");
        }
      } else {
        setError("User not logged in");
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
          <View style={styles.iconRow}>
            <Icon name="users" size={30} color="white" />
            <Icon name="plus" size={20} color="white" style={styles.plusIcon} />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.friendContainer}>
            <View style={styles.rowContainer}>
              <Image source={frogimg} style={styles.frogimg} />
              <Text style={styles.username}>{item.username}</Text>
            </View>
            {item.posts && item.posts.length > 0
              ? item.posts.map((post, index) => (
                  <View key={`post-${index}`} style={styles.foodLogEntry}>
                    <Image
                      source={{ uri: post }}
                      style={styles.foodImage}
                      onError={() => {
                        console.log("Image failed to load");
                      }}
                    />
                    <Text style={styles.foodTitle}>
                      {item.foodLogs[index]?.title || ""}
                    </Text>
                    <Text style={styles.foodDescription}>
                      {item.foodLogs[index]?.description || ""}
                    </Text>
                  </View>
                ))
              : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#35725D",
    paddingLeft: 20,
    paddingTop: 55,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  plusIcon: {
    marginLeft: 5,
  },
  friendContainer: {
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  foodImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    aspectRatio: 1.5,
  },
  foodTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  foodDescription: {
    fontSize: 20,
    color: "white",
    marginTop: 4,
    marginBottom: 15,
  },
  frogimg: {
    width: 60,
    height: 55,
    marginRight: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
