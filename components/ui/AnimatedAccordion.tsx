import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

interface AnimatedAccordionProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

export function AnimatedAccordion({
  isExpanded,
  children,
}: AnimatedAccordionProps) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setShowContent(true);
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowContent(false);
        }
      });
    }
  }, [isExpanded, animatedHeight, animatedOpacity]);

  // Altura máxima dinámica basada en el contenido real
  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(contentHeight, 200)], // Altura mínima de 200px
  });

  if (!showContent && !isExpanded) {
    return null;
  }

  return (
    <Animated.View
      style={{
        maxHeight,
        opacity: animatedOpacity,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingHorizontal: 18,
          paddingBottom: 18,
          backgroundColor: "#fafafa",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && height !== contentHeight) {
            setContentHeight(height);
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}
