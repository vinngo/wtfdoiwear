import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ListRenderItem,
} from "react-native";
import { Plus, Shuffle, X, Camera, ImageIcon } from "lucide-react-native";

interface Category {
  id: string;
  name: string;
}

interface ClothingItem {
  id: string;
  name: string;
  image: string;
}

const categories: Category[] = [
  { id: "1", name: "Tops" },
  { id: "2", name: "Bottoms" },
  { id: "3", name: "Outerwear" },
  { id: "4", name: "Shoes" },
  { id: "5", name: "Accessories" },
];

const mockItems: Record<string, ClothingItem[]> = {
  "1": [
    {
      id: "101",
      name: "White T-Shirt",
      image: "https://via.placeholder.com/150",
    },
    { id: "102", name: "Black Polo", image: "https://via.placeholder.com/150" },
    { id: "103", name: "Blue Shirt", image: "https://via.placeholder.com/150" },
    // ... and the rest
  ],
  "2": [
    { id: "201", name: "Blue Jeans", image: "https://via.placeholder.com/150" },
    // ... and the rest
  ],
  "3": [
    {
      id: "301",
      name: "Denim Jacket",
      image: "https://via.placeholder.com/150",
    },
    // ... and the rest
  ],
  // Add more as needed...
};

export default function ClosetScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].id,
  );

  const renderCategoryItem: ListRenderItem<Category> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderClothingItem: ListRenderItem<ClothingItem> = ({ item }) => (
    <View style={styles.clothingItem}>
      <Image
        source={{ uri: item.image as string }}
        style={styles.clothingImage}
      />
      <Text style={styles.clothingName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.topBar}>
        <Text style={styles.title}>My ####-ing Closet</Text>
        <TouchableOpacity style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.selectedCategoryHeader}>
        <Text style={styles.selectedCategoryTitle}>
          {categories.find((cat) => cat.id === selectedCategory)?.name}
        </Text>
        <TouchableOpacity style={styles.swipeModeButton}>
          <Shuffle size={16} color="#333" />
          <Text style={styles.swipeModeText}>Swipe Mode</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockItems[selectedCategory]}
        renderItem={renderClothingItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.clothingList}
      />

      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  categoryContainer: {
    marginTop: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  selectedCategoryItem: {
    backgroundColor: "#333",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  selectedCategoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  selectedCategoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  swipeModeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  swipeModeText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
  clothingList: {
    padding: 8,
  },
  clothingItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  clothingImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clothingName: {
    fontSize: 14,
    color: "#333",
    padding: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
