import { create } from "zustand";
import { combine } from "zustand/middleware";
import { supabase } from "../supabase";
import { Category, clothing_item } from "@/types/database";

type ItemsPerCategory = Record<string, clothing_item[]>;

interface ClosetState {
  itemsPerCategory: ItemsPerCategory;
  loading: boolean;
}

interface ClosetActions {
  fetchItems: (category: string) => Promise<void>;
}

export const useClosetStore = create(
  combine<ClosetState, ClosetActions>(
    { itemsPerCategory: {}, loading: false },
    (set, get) => ({
      fetchItems: async (category) => {
        const { itemsPerCategory } = get();

        if (itemsPerCategory[category]) return;

        set({ loading: true });

        // Step 1: Fetch the category
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("name", category);

        if (categoryError || !categoryData || categoryData.length === 0) {
          console.error(
            "Could not fetch from specified category. Did you check the spelling?",
          );
          set({ loading: false });
          return;
        }

        const category_id = categoryData[0].id;

        // Step 2: Fetch clothing items by category_id
        const { data: clothingData, error: clothingError } = await supabase
          .from("clothing_items")
          .select("*")
          .eq("category_id", category_id);

        if (clothingError || !clothingData) {
          console.error(
            "Failed to fetch clothing items:",
            clothingError?.message,
          );
          set({ loading: false });
          return;
        }

        // Step 3: Update store
        set((state) => ({
          itemsPerCategory: {
            ...state.itemsPerCategory,
            [category]: clothingData,
          },
          loading: false,
        }));
      },
    }),
  ),
);
