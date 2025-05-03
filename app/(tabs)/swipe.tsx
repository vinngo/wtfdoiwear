import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

// Mock data for clothing items
const CLOTHING_ITEMS = {
  shirts: [
    {
      id: 1,
      name: "Classic White Tee",
      price: "$19.99",
      image: "https://via.placeholder.com/400x500?text=White+Tee",
    },
    {
      id: 2,
      name: "Black Polo Shirt",
      price: "$24.99",
      image: "https://via.placeholder.com/400x500?text=Black+Polo",
    },
    {
      id: 3,
      name: "Striped Button-Up",
      price: "$34.99",
      image: "https://via.placeholder.com/400x500?text=Striped+Shirt",
    },
    {
      id: 4,
      name: "Graphic Print Tee",
      price: "$22.99",
      image: "https://via.placeholder.com/400x500?text=Graphic+Tee",
    },
  ],
  pants: [
    {
      id: 1,
      name: "Blue Jeans",
      price: "$39.99",
      image: "https://via.placeholder.com/400x500?text=Blue+Jeans",
    },
    {
      id: 2,
      name: "Black Chinos",
      price: "$44.99",
      image: "https://via.placeholder.com/400x500?text=Black+Chinos",
    },
    {
      id: 3,
      name: "Khaki Pants",
      price: "$42.99",
      image: "https://via.placeholder.com/400x500?text=Khaki+Pants",
    },
    {
      id: 4,
      name: "Joggers",
      price: "$29.99",
      image: "https://via.placeholder.com/400x500?text=Joggers",
    },
  ],
  dresses: [
    {
      id: 1,
      name: "Summer Floral Dress",
      price: "$49.99",
      image: "https://via.placeholder.com/400x500?text=Floral+Dress",
    },
    {
      id: 2,
      name: "Little Black Dress",
      price: "$59.99",
      image: "https://via.placeholder.com/400x500?text=Black+Dress",
    },
    {
      id: 3,
      name: "Maxi Dress",
      price: "$64.99",
      image: "https://via.placeholder.com/400x500?text=Maxi+Dress",
    },
    {
      id: 4,
      name: "Cocktail Dress",
      price: "$79.99",
      image: "https://via.placeholder.com/400x500?text=Cocktail+Dress",
    },
  ],
  accessories: [
    {
      id: 1,
      name: "Leather Belt",
      price: "$24.99",
      image: "https://via.placeholder.com/400x500?text=Leather+Belt",
    },
    {
      id: 2,
      name: "Silver Watch",
      price: "$99.99",
      image: "https://via.placeholder.com/400x500?text=Silver+Watch",
    },
    {
      id: 3,
      name: "Sunglasses",
      price: "$34.99",
      image: "https://via.placeholder.com/400x500?text=Sunglasses",
    },
    {
      id: 4,
      name: "Beanie Hat",
      price: "$19.99",
      image: "https://via.placeholder.com/400x500?text=Beanie+Hat",
    },
  ],
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function Swipe() {
  const { category = "shirts" } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [disliked, setDisliked] = useState<number[]>([]);

  const router = useRouter();

  // Get items based on category
  const items =
    CLOTHING_ITEMS[category as keyof typeof CLOTHING_ITEMS] ||
    CLOTHING_ITEMS.shirts;

  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: "clamp",
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const swipeCard = (direction: "right" | "left") => {
    const x = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (direction === "right") {
        setLiked([...liked, items[currentIndex].id]);
      } else {
        setDisliked([...disliked, items[currentIndex].id]);
      }
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prevIndex) => prevIndex + 1);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeCard("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeCard("left");
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const renderCards = () => {
    if (currentIndex >= items.length) {
      return (
        <View style={styles.endOfCardsContainer}>
          <Text style={styles.endOfCardsText}>No more items</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return items
      .map((item, index) => {
        if (index < currentIndex) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                {
                  transform: [{ translateX: position.x }, { rotate: rotation }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardDetails}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </Animated.View>
          );
        }

        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={item.id}
              style={[
                styles.card,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                },
                styles.nextCard,
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardDetails}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/closet")}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.cardsContainer}>{renderCards()}</View>

      {currentIndex < items.length && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.dislikeButton]}
            onPress={() => swipeCard("left")}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() => swipeCard("right")}
          >
            <AntDesign name="hearto" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40, // To balance the header layout
  },
  cardsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  nextCard: {
    top: 10,
    zIndex: -1,
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  cardDetails: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  likeContainer: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 1,
    transform: [{ rotate: "15deg" }],
  },
  likeText: {
    borderWidth: 2,
    borderColor: "#4CD964",
    color: "#4CD964",
    fontSize: 28,
    fontWeight: "bold",
    padding: 10,
  },
  dislikeContainer: {
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 1,
    transform: [{ rotate: "-15deg" }],
  },
  dislikeText: {
    borderWidth: 2,
    borderColor: "#FF3B30",
    color: "#FF3B30",
    fontSize: 28,
    fontWeight: "bold",
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  likeButton: {
    borderColor: "#000000",
    borderWidth: 2,
  },
  dislikeButton: {
    borderColor: "#000000",
    borderWidth: 2,
  },
  endOfCardsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  endOfCardsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
});
