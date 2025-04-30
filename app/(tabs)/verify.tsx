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
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function VerificationScreen() {
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { phoneNumber } = useLocalSearchParams();

  const inputRef = useRef(null);
  const router = useRouter();

  // Focus input when screen loads
  useEffect(() => {
    setTimeout(() => {
      //@ts-ignore
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle code input change
  const handleCodeChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, "");

    // Validate the code (must be 6 digits)
    const isValidCode = cleaned.length === 6;
    setIsValid(isValidCode);

    if (cleaned.length > 0 && !isValidCode) {
      setErrorMessage("Please enter a valid 6-digit code");
    } else {
      setErrorMessage("");
    }

    setCode(cleaned);
  };

  // Handle verification
  const handleVerify = () => {
    if (isValid) {
      // In a real app, you would verify the code with your backend here
      console.log("Verifying code:", code);
      router.push("/closet");
    }
  };

  // Handle resend code
  const handleResend = () => {
    if (canResend) {
      // In a real app, you would trigger a new code to be sent here
      console.log("Resending code to:", phoneNumber);
      setTimeLeft(30);
      setCanResend(false);
    }
  };

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
          <Text style={styles.header}>Verification</Text>
          <Text style={styles.subheader}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={styles.phoneText}>{phoneNumber}</Text>
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              ref={inputRef}
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="000000"
              keyboardType="number-pad"
              value={code}
              onChangeText={handleCodeChange}
              maxLength={6}
              textContentType="oneTimeCode" // iOS autofill from SMS
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendButton}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend in {formatTime(timeLeft)}
              </Text>
            )}
          </View>
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
    textAlign: "center",
    lineHeight: 26,
  },
  phoneText: {
    fontWeight: "700",
    color: "#333",
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
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    letterSpacing: 8,
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
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendButton: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
});
