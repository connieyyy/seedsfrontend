import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "react-native-image-picker"; // Ensure correct import
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import swamp from "../assets/swamp.jpg";
import { useUser } from "../UserContext.js";

const { height } = Dimensions.get("window");
const API_URL = "http://localhost:3000/foodlogs";

export default function FoodLog() {
  const [foodLogs, setFoodLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [foodItem, setFoodItem] = useState({
    name: "",
    description: "",
    image: null,
  });
  const { user } = useUser();

  useEffect(() => {
    const fetchFoodLogs = async () => {
      if (user && user.email) {
        const today = new Date().toISOString().split("T")[0];
        try {
          const response = await axios.get(`${API_URL}/${user.email}/${today}`);
          const flattenedData = Array.isArray(response.data)
            ? response.data.flat()
            : [];
          setFoodLogs(flattenedData);
        } catch (err) {
          console.error("Error fetching food logs:", err.message);
        }
      }
    };
    fetchFoodLogs();
  }, [user]);

  const handleImagePick = () => {
    if (!ImagePicker.launchImageLibrary) {
      console.error("ImagePicker is not available.");
      return;
    }

    const options = {
      mediaType: "photo",
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setFoodItem({
          ...foodItem,
          image: selectedImage,
        });
      }
    });
  };

  const handleAddFoodItem = async () => {
    if (user && user.email) {
      const today = new Date().toISOString().split("T")[0];

      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("foodName", foodItem.name);
      formData.append("date", today);
      formData.append("foodDescription", foodItem.description);

      if (foodItem.image) {
        formData.append("image", {
          uri: foodItem.image.uri,
          type: foodItem.image.type,
          name: foodItem.image.fileName || "food_image.jpg",
        });
      }

      try {
        await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const response = await axios.get(`${API_URL}/${user.email}/${today}`);
        setFoodLogs(response.data ? response.data : []);
        setFoodItem({ name: "", description: "", image: null });
        setModalVisible(false);
      } catch (err) {
        console.error("Error adding food item:", err.message);
      }
    }
  };

  const handleDeleteFoodItem = async (foodId) => {
    try {
      await axios.delete(`${API_URL}/${user.email}/${foodId}`);
      setFoodLogs(foodLogs.filter((log) => log._id !== foodId));
    } catch (err) {
      console.error("Error deleting food item:", err.message);
    }
  };

  const confirmDelete = (foodId) => {
    Alert.alert(
      "Delete Food Item",
      "Are you sure you want to delete this food item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteFoodItem(foodId) },
      ]
    );
  };

  const renderFoodLogItem = ({ item }) => (
    <View style={styles.missionBlock}>
      <View style={styles.foodLogContent}>
        {item.foodPhotoLink && item.foodPhotoLink.trim() !== "" ? (
          <Image
            source={{ uri: item.foodPhotoLink }}
            style={styles.foodImage}
            onError={() => {
              console.log("Image failed to load");
            }}
          />
        ) : null}
        <Text style={styles.missionTitle}>{item.foodName}</Text>
        <Text style={styles.missionsubtitle}>{item.foodDescription}</Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item._id)}
        style={styles.deleteButton}
      >
        <Icon name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={swamp}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.overlaytitle}>Food Log</Text>
          <Text style={styles.overlayText}>
            Log your meals for today; reset occurs at midnight.
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.instructionsContainer}>
        <FlatList
          data={foodLogs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderFoodLogItem}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Food Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Food Name"
              value={foodItem.name}
              onChangeText={(text) => setFoodItem({ ...foodItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={foodItem.description}
              onChangeText={(text) =>
                setFoodItem({ ...foodItem, description: text })
              }
            />
            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.input}>
                {foodItem.image ? foodItem.image.fileName : "Choose Photo"}
              </Text>
            </TouchableOpacity>
            <Button title="Add Food" onPress={handleAddFoodItem} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: height * 0.32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlaytitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  overlayText: {
    marginTop: 15,
    fontSize: 16,
    color: "white",
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  instructionsContainer: {
    flex: 1,
    backgroundColor: "#5B7CBF",
    padding: 20,
    paddingTop: 30,
  },
  missionBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A4D83",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  foodLogContent: {
    flex: 1,
    width: "100%",
  },
  deleteButton: {
    marginLeft: 10,
  },
  missionTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  missionsubtitle: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 5,
    color: "white",
  },
  addButton: {
    backgroundColor: "#2A4D83",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 30,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 15,
  },
  foodImage: {
    width: "100%",
    height: 100,
    overflow: "hidden",
  },
});
