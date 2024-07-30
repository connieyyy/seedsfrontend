import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import lilypadlogin from "../assets/lilypadlogin.jpg";

import basefrog from "../assets/froggy_sprites_anims/froggy_base.png";
import bowfrog from "../assets/accessorysprites/bowfroggy/bowfroggy.png";
import partyfrog from "../assets/accessorysprites/partyfroggy/partyfroggy.png";
import tophatfrog from "../assets/accessorysprites/tophatfroggy/tophatfroggy.png";

import eatingfrog from "../assets/froggy_sprites_anims/froggy_eat.gif";
import boweating from "../assets/accessorysprites/bowfroggy/bowfroggy_eat.gif";
import partyeating from "../assets/accessorysprites/partyfroggy/partyfroggy_eat.gif";
import topeating from "../assets/accessorysprites/tophatfroggy/tophatfroggy_eat.gif";

import shop from "../assets/shop.png";
import { useUser } from "../UserContext.js";

const accessoryGifs = {
  Bow: bowfrog,
  "Party Hat": partyfrog,
  "Top Hat": tophatfrog,
};

const eatingGifs = {
  Bow: boweating,
  "Party Hat": partyeating,
  "Top Hat": topeating,
};

export default function Decor({ navigation }) {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isEating, setIsEating] = useState(false);
  const [accessory, setAccessory] = useState(null);
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

      axios
        .get(`http://localhost:3000/pets/${user.email}/accessory`)
        .then((response) => {
          const accessory = response.data.accessory;
          setAccessory(accessory);
        })
        .catch((error) => {
          console.error("Error fetching pet accessory:", error);
        });
    }
  }, [user]);

  const getFrogImage = () => {
    if (isEating) {
      return accessory ? eatingGifs[accessory] || eatingfrog : eatingfrog;
    } else {
      return accessory ? accessoryGifs[accessory] : basefrog;
    }
  };

  const handleItemPress = (item) => {
    const isFood = item.itemType === "food";

    axios
      .post(`${API_URL}/${user.email}`, {
        inventoryItem: item.itemName,
      })
      .then((response) => {
        const updatedItems = purchasedItems
          .map((i) => (i._id === item._id ? { ...i, count: i.count - 1 } : i))
          .filter((i) => i.count > 0);

        setPurchasedItems(updatedItems);
        if (isFood) {
          setIsEating(true);
          setTimeout(() => setIsEating(false), 3000);
        } else {
          setAccessory(item.itemName);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.error === "Pet is full") {
          Alert.alert(
            "Cannot feed the pet",
            "Your pet is full and cannot eat more."
          );
        } else {
          console.error("Error using item:", error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={lilypadlogin}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.titletext}>Inventory</Text>
        <Text style={styles.subtitletext}>
          Select item to feed or equip accessories.
        </Text>
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

        <Image
          style={styles.basefrog}
          source={getFrogImage()}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.bottombutton}
          onPress={() => navigation.navigate("Store")}
        >
          <Image source={shop} style={styles.buttonImage} />
        </TouchableOpacity>
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
    width: 200,
    height: 150,
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
    textAlign: "center",
    padding: 10,
  },
  subtitletext: {
    color: "white",
    fontSize: 18,
    padding: 15,
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
    marginBottom: 110,
    width: 280,
    backgroundColor: "#35725D",
    padding: 5,
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
  bottombutton: {
    marginTop: 30,
    borderRadius: 35,
    width: 70,
    height: 70,
    overflow: "hidden",
  },
});
