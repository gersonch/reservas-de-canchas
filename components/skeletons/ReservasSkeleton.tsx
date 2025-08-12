import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SkeletonItem = () => {
  // Animación declarativa sin useEffect
  const animatedOpacity = useDerivedValue(() =>
    withRepeat(withTiming(1, { duration: 800 }), -1, true)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedOpacity.value, [0.3, 1], [0.3, 1]),
  }));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Animated.View style={[styles.complexNameSkeleton, animatedStyle]} />
        <Animated.View style={[styles.menuButtonSkeleton, animatedStyle]} />
      </View>
      <Animated.View style={[styles.detalleSkeleton, animatedStyle]} />
      <Animated.View style={[styles.diaSkeleton, animatedStyle]} />
      <Animated.View style={[styles.fechaSkeleton, animatedStyle]} />
      <Animated.View style={[styles.precioSkeleton, animatedStyle]} />
      <Animated.View style={[styles.statusSkeleton, animatedStyle]} />
    </View>
  );
};

export default function ReservasSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.titleSkeleton} />
      {[...Array(3)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleSkeleton: {
    height: 28,
    width: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  complexNameSkeleton: {
    height: 18,
    width: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  menuButtonSkeleton: {
    height: 18,
    width: 18,
    backgroundColor: "#e0e0e0",
    borderRadius: 9,
  },
  detalleSkeleton: {
    height: 16,
    width: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
  diaSkeleton: {
    height: 16,
    width: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
  fechaSkeleton: {
    height: 14,
    width: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  precioSkeleton: {
    height: 16,
    width: 90,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
  statusSkeleton: {
    height: 16,
    width: 110,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 4,
  },
});
