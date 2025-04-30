import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const checkUserSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("error checking auth", error);
        return;
      }

      if (!session) {
        return;
      }

      //router push to closet
    } catch (e) {
      console.error("Session check failed", e);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.header}>Sign in to continue</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Button title="Login" onPress={() => router.push("/closet")}></Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
});
