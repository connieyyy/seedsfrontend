import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import dayswamp from "../assets/dayswamp.jpg";
import { useUser } from "../UserContext.js";
import frogCoin from "../assets/frogcoin.png";

const { height } = Dimensions.get("window");
const API_URL = "http://localhost:3000/missions";

export default function Mission() {
  const [missions, setMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchMissions = async () => {
      if (user && user.email) {
        const today = new Date().toISOString().split("T")[0];
        try {
          const response = await axios.get(`${API_URL}/${user.email}/${today}`);
          const missionsData = response.data;

          // Update the list of missions and completed missions
          const completed = new Set(
            missionsData.filter((m) => m.status).map((m) => m.number)
          );

          setMissions(missionsData);
          setCompletedMissions(completed);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMissions();
  }, [user]);

  const handleUpdateMissionStatus = async (missionNumber) => {
    if (user && user.email) {
      try {
        await axios.put(`${API_URL}/${user.email}/${missionNumber}`);
        // Refresh the missions after updating
        const today = new Date().toISOString().split("T")[0];
        const response = await axios.get(`${API_URL}/${user.email}/${today}`);
        const missionsData = response.data;

        // Update the list of missions and completed missions
        const completed = new Set(
          missionsData.filter((m) => m.status).map((m) => m.number)
        );

        setMissions(missionsData);
        setCompletedMissions(completed);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

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
        <Text style={styles.yourmissionsubtitle}>Your missions:</Text>
        {missions.length > 0 ? (
          missions.map((mission) => (
            <View key={mission.number} style={styles.missionBlock}>
              <TouchableOpacity
                onPress={() => handleUpdateMissionStatus(mission.number)}
                style={[
                  styles.circleButton,
                  completedMissions.has(mission.number) &&
                    styles.buttonComplete,
                ]}
              >
                {completedMissions.has(mission.number) ? (
                  <Icon name="check" size={24} color="white" />
                ) : null}
              </TouchableOpacity>
              <View style={styles.missionDetails}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <View>
                  <Text style={styles.missionDescription}>Description:</Text>
                  <Text style={styles.missiondescription}>
                    {mission.description}
                  </Text>
                </View>
                <View style={styles.rewardContainer}>
                  <Text style={styles.missionDescription}>
                    Reward: {mission.reward}
                  </Text>
                  <Image source={frogCoin} style={styles.frogCoinImage} />
                </View>
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
    alignItems: "center",
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
    width: 50,
    height: 50,
    borderRadius: 300,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  buttonComplete: {
    backgroundColor: "#8BC34A",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: 5,
  },
  frogCoinImage: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 30,
  },
  missionDetails: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  missiondescription: {
    fontSize: 20,
    color: "white",
    fontWeight: "400",
  },
  missionDescription: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
});
