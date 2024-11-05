import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate input fields
    if (!username) {
      Alert.alert("Validation Error", "Please enter your username!");
      return;
    }
    if (!fullName) {
      Alert.alert("Validation Error", "Please enter your full name!");
      return;
    }
    if (!email || !emailPattern.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email!");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert("Validation Error", "Please enter your password ");
      return;
    }
    if (!phoneNumber) {
      Alert.alert("Validation Error", "Please enter your phone number!");
      return;
    }
    if (!address) {
      Alert.alert("Validation Error", "Please enter your address!");
      return;
    }

    const userData = {
      user_name: username,
      full_name: fullName,
      email,
      password,
      phone_number: phoneNumber,
      address,
      user_avatar: userAvatar, // Optional avatar URL
      google_id: null, // If you have a Google ID, you can set it here
    };

    try {
      const response = await axios.post(
        "http://10.0.2.2:8080/api/v1/auth/register",
        userData
      );

      if (response.status === 201) {
        Alert.alert(
          "Registration Successful!",
          "You have successfully registered your account!"
        );
        router.push("/sign-in");
      } else {
        Alert.alert(
          "Registration Failed",
          response.data.message || "Please try again."
        );
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      if (err.response && err.response.data) {
        Alert.alert(
          "Registration Error",
          err.response.data.message || "Something went wrong."
        );
      } else {
        console.log(error);
        Alert.alert("Registration Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@assets/images/logo.jpeg")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#7d7d7d"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#7d7d7d"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7d7d7d"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" // Ensure correct keyboard for email
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7d7d7d"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#7d7d7d"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad" // Ensure correct keyboard for phone number
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#7d7d7d"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/sign-in")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0E5CF",
  },
  frame: {
    width: "90%", // Changed to percentage for better responsiveness
    maxWidth: 400, // Optional max width
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 15,
    backgroundColor: "#E9DAC1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
    borderRadius: 80,
    overflow: "hidden",
    width: 160,
    height: 160,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6E4B1F",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3C3B1",
    backgroundColor: "#FFF",
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: "#6E4B1F",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: "#6E4B1F",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
