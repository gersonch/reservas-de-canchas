import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedIconProps {
  isExpanded: boolean;
}

export function AnimatedIcon({ isExpanded }: AnimatedIconProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"], // Rotación suave del símbolo +
  });

  return (
    <Animated.Text
      style={{
        fontSize: 20,
        color: "#007AFF",
        fontWeight: "600",
        transform: [{ rotate: rotation }],
      }}
    >
      <FontAwesome name="plus" size={20} color="#007AFF" />
    </Animated.Text>
  );
}
