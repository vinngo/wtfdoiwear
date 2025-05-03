import {
  Camera,
  getCameraDevice,
  useCameraDevices,
} from "react-native-vision-camera";
import { useEffect, useState, useRef } from "react";
import { View } from "react-native";

export function CameraScreen() {
  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = getCameraDevice(devices, "back");

  useEffect(() => {
    async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "granted");
    };
  }, []);

  if (!device || !hasPermission) return <View>Loading...</View>;

  return (
    <Camera
      style={{ flex: 1 }}
      ref={camera}
      device={device}
      isActive={true}
      photo={true}
    />
  );
}
