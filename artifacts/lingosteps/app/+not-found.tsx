import { router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function NotFoundScreen() {
  useEffect(() => {
    router.replace("/(tabs)/");
  }, []);
  return null;
}
