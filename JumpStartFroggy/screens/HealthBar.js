import React from "react";
import { View, StyleSheet } from "react-native";

const HealthBar = ({ health }) => {
  const barColor = health <= 25 ? "#FF0000" : "#A85DE2";

  return (
    <View style={styles.barContainer}>
      <View
        style={[styles.bar, { width: `${health}%`, backgroundColor: barColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    width: 220,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    width: "100%",
  },
});

export default HealthBar;
