import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import dayswamp from "../assets/dayswamp.jpg";

const { height } = Dimensions.get("window");

export default function Mission() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/missions");
        setMissions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

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
        <View style={styles.dailyMissionBlock}>
          {dailyMission ? (
            <>
              <Text style={styles.missionText}>{dailyMission.title}</Text>
              <Text style={styles.missiondescription}>
                {dailyMission.description}
              </Text>
            </>
          ) : (
            <Text>No daily mission available</Text>
          )}
        </View>

        <Text style={styles.yourmissionsubtitle}>Your missions:</Text>
        {yourMissions.length > 0 ? (
          yourMissions.map((mission) => (
            <View key={mission.id} style={styles.missionBlock}>
              <Text style={styles.missionText}>{mission.title}</Text>
              <Text style={styles.missiondescription}>
                {mission.description}
              </Text>
            </View>
          ))
        ) : (
          <Text>No other missions available</Text>
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
    alignItems: "flex-start",
    backgroundColor: "#c2cc80",
    padding: 20,
    paddingTop: 30,
  },
  dailymissionsubtitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    marginLeft: 10,
  },
  yourmissionsubtitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 20,
  },
  missionText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
    marginVertical: 5,
    marginLeft: 10,
  },
  missiondescription: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 5,
    marginLeft: 10,
  },
  missionBlock: {
    backgroundColor: "#737d06",
    marginTop: 10,
    width: "100%",
    height: 100,
    borderRadius: 10,
    padding: 10,
  },
  dailyMissionBlock: {
    backgroundColor: "#737d06",
    marginTop: 10,
    width: "100%",
    height: 100,
    borderRadius: 10,
    padding: 10,
  },
});
