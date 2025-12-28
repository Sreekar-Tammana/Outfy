
export interface OutfitItem {
  id: string;
  image: string; // base64
  description: string;
}

export interface TryOnResult {
  imageUrl: string;
  timestamp: number;
}
