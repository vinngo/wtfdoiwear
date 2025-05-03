import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // Format and validate phone number as user types
  const handlePhoneChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Format the phone number
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

    // Validate the phone number (simple validation for 10 digits)
    const isValidNumber = cleaned.length === 10;
    setIsValid(isValidNumber);

    if (cleaned.length > 0 && !isValidNumber) {
      setErrorMessage("Please enter a valid 10-digit phone number");
    } else {
      setErrorMessage("");
    }

    setPhoneNumber(formatted);
  };

  const handleLogin = async () => {
    if (isValid) {
      router.push("/closet");
      //await handleSendSMS(); uncomment this once twilio lets us send SMS
    }
  };

  const handleSendSMS = async () => {
    try {
      const withCountryCode = "+1" + phoneNumber.replace(/-/g, "");

      const { error } = await supabase.auth.signInWithOtp({
        phone: withCountryCode,
      });

      if (error) throw error;

      router.push(`/verify?phoneNumber=${encodeURIComponent(withCountryCode)}`);
    } catch (e) {
      console.error("could not send verification code.", e);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.dismissKeyboard}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.formContainer}>
          <Text style={styles.header}>Sign in to continue</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="000-000-0000"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={12} // Account for formatting characters
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            We'll send you a verification code to confirm your number
          </Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  dismissKeyboard: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginBottom: 48,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  button: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
