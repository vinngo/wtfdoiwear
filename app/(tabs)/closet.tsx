import React, { useState, useEffect } from "react";
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
import { useClosetStore } from "@/lib/stores/clothingStore";
import { supabase } from "@/lib/supabase";
import { CategoryList } from "@/types/database";
import { useRouter } from "expo-router";
import { CameraScreen } from "@/components/Camera";

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

  const [modalVisible, setModalVisible] = useState(false);
  const fetchItems = useClosetStore((state) => state.fetchItems);
  const router = useRouter();

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

  //when user navigates to the ClosetScreen
  //on log in -> fetches data
  //anywhere else -> uses cached data in the store.
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          console.error("session not found!");
        }

        for (const category of CategoryList) {
          await fetchItems(category);
        }
      } catch (e) {
        console.error("could not verify user session!", e);
      }
    };

    // init(); uncomment this once we fix everything else...
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.topBar}>
        <Text style={styles.title}>My F-ing Closet</Text>
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
        <TouchableOpacity
          style={styles.swipeModeButton}
          onPress={() => router.push("/swipe")}
        >
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Item</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Add your form inputs/buttons here */}
              <View style={styles.modalBody}>
                <TouchableOpacity style={styles.imageButton}>
                  <Camera size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  modalBody: {
    gap: 12,
  },

  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 12,
  },

  imageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});
