import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import swamp from "../assets/swamp.jpg";

const { height } = Dimensions.get("window");
const API_URL = "http://localhost:3000/foodlogs";

export default function FoodLog() {
  const [foodLogs, setFoodLogs] = useState([]);
  const [foodItem, setFoodItem] = useState({ name: "", description: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const response = await axios.get(API_URL);
        setFoodLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodLogs();
  }, []);

  const handleAddFoodItem = async () => {
    try {
      const response = await axios.post(API_URL, foodItem);
      setFoodLogs((prevLogs) => [...prevLogs, response.data]);
      setFoodItem({ name: "", description: "" });
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={swamp}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.overlaytitle}>Today's Food Log</Text>
          <Text style={styles.overlayText}>
            Log your meals for today. It counts toward your missions and resets
            at midnight.
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.instructionsContainer}>
        <FlatList
          data={foodLogs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.missionBlock}>
              <View style={styles.missionDetails}>
                <Text style={styles.missionTitle}>{item.name}</Text>
                <Text style={styles.missionDescription}>
                  Description: {item.description}
                </Text>
              </View>
            </View>
          )}
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
          <Button title="Add Food" onPress={handleAddFoodItem} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    backgroundColor: "#c2cc80",
    padding: 20,
    paddingTop: 30,
  },
  missionBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#737D06",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  missionDetails: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  missionDescription: {
    fontSize: 16,
    color: "white",
  },
  addButton: {
    backgroundColor: "#5b7cbf",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  modalView: {
    margin: 20,
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
});
