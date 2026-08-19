import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: ['verite-01', 'verite-02'],
      toggleWishlist: (id: string) => {
        const { wishlistIds } = get();
        if (wishlistIds.includes(id)) {
          set({ wishlistIds: wishlistIds.filter((item) => item !== id) });
        } else {
          set({ wishlistIds: [...wishlistIds, id] });
        }
      },
      isWishlisted: (id: string) => get().wishlistIds.includes(id),
      clearWishlist: () => set({ wishlistIds: [] }),
    }),
    {
      name: 'verite-wishlist-storage',
    }
  )
);
