import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import axios from "axios";
import lilypadlogin from "../assets/lilypadlogin.jpg";
import basefrog from "../assets/froggy_sprites_anims/froggy_base.png";
import food from "../assets/food.png";
import { useUser } from "../UserContext.js";

export default function Decor({ navigation }) {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useUser();
  const API_URL = "http://localhost:3000/decor";

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`${API_URL}/${user.email}`)
        .then((response) => {
          const itemCount = response.data.reduce((acc, item) => {
            if (acc[item._id]) {
              acc[item._id].count += 1;
            } else {
              acc[item._id] = { ...item, count: 1 };
            }
            return acc;
          }, {});

          const itemsArray = Object.values(itemCount);
          setPurchasedItems(itemsArray);
        })
        .catch((error) => {
          console.error("Error fetching purchased items:", error);
        });
    }
  }, [user]);

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const handleActionPress = () => {
    if (selectedItem.itemType === "food") {
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypadlogin}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.titletext}>Inventory</Text>
        <View style={styles.cupboard}>
          {purchasedItems.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.itemContainer}
              onPress={() => handleItemPress(item)}
            >
              <Image
                source={{ uri: item.itemImage }}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <Text style={styles.itemCount}>x{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Image style={styles.basefrog} source={basefrog} resizeMode="contain" />
        {selectedItem && (
          <TouchableOpacity
            style={[styles.bottombutton, styles.actionButton]}
            onPress={handleActionPress}
          >
            <Text style={styles.actionButtonText}>
              {selectedItem.itemType === "food" ? "Feed" : "Save"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.bottombutton}></TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  basefrog: {
    width: 300,
    height: 250,
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  titletext: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    padding: 10,
  },
  bottombutton: {
    marginTop: 10,
    borderRadius: 35,
    overflow: "hidden",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cupboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    backgroundColor: "#35725D",
    padding: 10,
    borderRadius: 10,
  },
  itemContainer: {
    position: "relative",
    margin: 5,
    backgroundColor: "#4ba17e",
    padding: 15,
    borderRadius: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemCount: {
    position: "absolute",
    bottom: 0,
    right: 0,
    color: "white",
    borderRadius: 10,
    padding: 2,
    fontSize: 20,
    fontWeight: "bold",
  },
  actionButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#35725D",
    padding: 15,
    borderRadius: 20,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
  },
});
