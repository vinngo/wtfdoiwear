export interface clothing_item {
  id: number;
  created_at: string | null;
  user_id: string;
  name: string;
  image_url: string;
}

export interface category {
  id: number;
  name: string;
}
