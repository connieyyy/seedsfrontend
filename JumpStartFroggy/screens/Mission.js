import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing MaterialIcons for check mark
import dayswamp from "../assets/dayswamp.jpg";

const { height } = Dimensions.get("window");
const API_URL = "http://localhost:3000/missions"; // Update as needed for your environment

export default function Mission() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedMissions, setCompletedMissions] = useState(new Set());

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get(API_URL);
        setMissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleToggleComplete = (id) => {
    setCompletedMissions((prevState) => {
      const newState = new Set(prevState);
      if (newState.has(id)) {
        newState.delete(id);
      } else {
        newState.add(id);
      }
      return newState;
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  // Separate the first mission as the daily mission
  const [dailyMission, ...yourMissions] = missions;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={dayswamp}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.overlaytitle}>Missions</Text>
        </View>
      </ImageBackground>
      <View style={styles.instructionsContainer}>
        <Text style={styles.dailymissionsubtitle}>Daily mission:</Text>
        {dailyMission ? (
          <View style={styles.missionBlock}>
            <TouchableOpacity
              onPress={() => handleToggleComplete(dailyMission.id)}
              style={[
                styles.circleButton,
                completedMissions.has(dailyMission.id) && styles.buttonComplete,
              ]}
            >
              {completedMissions.has(dailyMission.id) ? (
                <Icon name="check" size={24} color="white" />
              ) : null}
            </TouchableOpacity>
            <View style={styles.missionDetails}>
              <Text style={styles.missionTitle}>{dailyMission.title}</Text>
              <Text style={styles.missionDescription}>
                Description: {dailyMission.description}
              </Text>
              <Text style={styles.missionDescription}>
                Reward: {dailyMission.reward}
              </Text>
            </View>
          </View>
        ) : (
          <Text>No daily mission available</Text>
        )}
        <Text style={styles.yourmissionsubtitle}>Your missions:</Text>
        {yourMissions.length > 0 ? (
          yourMissions.map((mission) => (
            <View key={mission.id} style={styles.missionBlock}>
              <TouchableOpacity
                onPress={() => handleToggleComplete(mission.id)}
                style={[
                  styles.circleButton,
                  completedMissions.has(mission.id) && styles.buttonComplete,
                ]}
              >
                {completedMissions.has(mission.id) ? (
                  <Icon name="check" size={24} color="white" />
                ) : null}
              </TouchableOpacity>
              <View style={styles.missionDetails}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDescription}>
                  Description: {mission.description}
                </Text>
                <Text style={styles.missionDescription}>
                  Reward: {mission.reward}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No additional missions available</Text>
        )}
      </View>
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
  instructionsContainer: {
    flex: 1,
    backgroundColor: "#c2cc80",
    padding: 20,
    paddingTop: 30,
  },
  dailymissionsubtitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 10,
    marginBottom: 15,
  },
  yourmissionsubtitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 15,
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
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  buttonComplete: {
    backgroundColor: "#8BC34A",
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
});
