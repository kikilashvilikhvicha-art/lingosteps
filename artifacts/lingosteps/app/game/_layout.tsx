import { Stack } from "expo-router";
import React from "react";

export default function GameLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="quiz" />
      <Stack.Screen name="unscramble" />
      <Stack.Screen name="image-guess" />
      <Stack.Screen name="timed" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
