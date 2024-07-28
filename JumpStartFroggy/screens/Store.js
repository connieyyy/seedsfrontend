import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useUser } from "../UserContext.js";
import lilypad from "../assets/lilypadlogin.jpg";
import frogcoin from "../assets/frogcoin.png";

const API_URL = "http://localhost:3000/store";

export default function Feed() {
  const [storeItems, setStoreItems] = useState([]);
  const [coinValue, setCoinValue] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        const response = await axios.get(`${API_URL}`);
        setStoreItems(response.data);
      } catch (error) {
        console.error("Error fetching store items");
      }
    };

    const fetchCoinValue = async () => {
      try {
        const response = await axios.get(`${API_URL}/${user.email}`);
        setCoinValue(response.data.frogCoins);
      } catch (error) {
        console.error("Error fetching coin value");
      }
    };

    fetchStoreItems();
    fetchCoinValue();
  }, [user]);

  const handlePurchase = async (itemId) => {
    try {
      const response = await axios.post(`${API_URL}/${user.email}/${itemId}`, {
        email: user.email,
        itemId,
      });
      setCoinValue(response.data.frogCoins);
    } catch (error) {
      Alert.alert(
        "Purchase Failed",
        error.response.data.error || "An error occurred."
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.itemImage }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.itemDescription}>{item.itemDescription}</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handlePurchase(item._id)}
        disabled={
          item.isOneTimePurchase && user.purchasedItems.includes(item._id)
        }
      >
        <Text style={styles.buyButtonText}>
          {" "}
          Buy {item.itemPrice}{" "}
          <Image source={frogcoin} style={styles.coincost} />
        </Text>
      </TouchableOpacity>
      {item.isOneTimePurchase && user.purchasedItems.includes(item._id) && (
        <Text style={styles.purchasedText}>Item already purchased</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypad}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.coinContainer}>
          <View style={styles.coinBar}>
            <Text style={styles.coinText}>{coinValue}</Text>
          </View>
          <Image source={frogcoin} style={styles.frogcoin} />
        </View>
        <Text style={styles.shoptitle}>Frog Shop</Text>

        <View style={styles.shopcontainer}>
          <FlatList
            data={storeItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </View>
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
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  coinContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  frogcoin: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  buyButton: {
    backgroundColor: "#4ba17e",
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  buyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  coinBar: {
    backgroundColor: "white",
    paddingLeft: 70,
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  coinText: {
    fontSize: 18,
    color: "#22493F",
    fontWeight: "bold",
  },
  cost: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  coincost: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 10,
    fontWeight: "bold",
    alignSelf: "center",
  },
  shoptitle: {
    fontSize: 35,
    textAlign: "center",
    color: "white",
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 30,
  },
  shopcontainer: {
    backgroundColor: "#35725D",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    maxHeight: "60%",
  },
  listContainer: {
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "#22493F",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    borderRadius: 10,
    width: 150,
    height: 150,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "white",
  },
  itemPrice: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  itemImage: {
    width: 40,
    height: 40,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginTop: 5,
    textAlign: "center",
  },
});
