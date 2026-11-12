import React, { useState, useEffect } from 'react';
import { Watch, CartItem, Order, WatchReview } from './types/watch';
import { INITIAL_WATCHES } from './data/sampleWatches';
import { Navbar } from './components/layout/Navbar';
import { HeroShowroom } from './components/home/HeroShowroom';
import { WatchCatalog } from './components/catalog/WatchCatalog';
import { WatchShowroomModal } from './components/three/WatchShowroomModal';
import { WatchDetailModal } from './components/catalog/WatchDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WatchComparisonModal } from './components/home/WatchComparisonModal';
import { HeritageSection } from './components/home/HeritageSection';
import { HorologyAdvisor } from './components/home/HorologyAdvisor';
import { Footer } from './components/layout/Footer';

export default function App() {
  // Watches State (Persisted in localStorage)
  const [watches, setWatches] = useState<Watch[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('luxora_watches');
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_WATCHES;
  });

  // Orders State (Persisted in localStorage)
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('luxora_orders');
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('luxora_cart');
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Wishlist & Comparison
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Modals & Navigation Overlays
  const [activeShowroomWatch, setActiveShowroomWatch] = useState<Watch | null>(null);
  const [selectedDetailWatch, setSelectedDetailWatch] = useState<Watch | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCheckoutDiscount, setAppliedCheckoutDiscount] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Save watches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxora_watches', JSON.stringify(watches));
    } catch {
      // Ignore
    }
  }, [watches]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxora_orders', JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxora_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  // Cart Actions
  const handleAddToCart = (watch: Watch, color: string, strap: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.watch.id === watch.id && it.selectedColor === color && it.selectedStrap === strap
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: `${watch.id}-${color}-${Date.now()}`,
          watch,
          selectedColor: color,
          selectedStrap: strap,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleInstantBuy = (watch: Watch, color: string, strap: string) => {
    handleAddToCart(watch, color, strap);
    setIsCartOpen(false);
    setSelectedDetailWatch(null);
    setActiveShowroomWatch(null);
    setAppliedCheckoutDiscount(0);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (discountPercent: number) => {
    setAppliedCheckoutDiscount(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Decrease stock for ordered watches
    setWatches((prevWatches) =>
      prevWatches.map((w) => {
        const orderedItem = newOrder.items.find((item) => item.watch.id === w.id);
        if (orderedItem) {
          return {
            ...w,
            stockAvailability: Math.max(0, w.stockAvailability - orderedItem.quantity),
          };
        }
        return w;
      })
    );
    // Clear cart
    setCartItems([]);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (watchId: string) => {
    setWishlistIds((prev) =>
      prev.includes(watchId) ? prev.filter((id) => id !== watchId) : [...prev, watchId]
    );
  };

  // Comparison Toggle
  const handleToggleCompare = (watchId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(watchId)) {
        return prev.filter((id) => id !== watchId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 luxury timepieces at once.');
        return prev;
      }
      return [...prev, watchId];
    });
  };

  // Admin Actions
  const handleAddWatch = (newWatch: Watch) => {
    setWatches((prev) => [newWatch, ...prev]);
  };

  const handleUpdateWatch = (updatedWatch: Watch) => {
    setWatches((prev) => prev.map((w) => (w.id === updatedWatch.id ? updatedWatch : w)));
  };

  const handleDeleteWatch = (watchId: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== watchId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset catalog to curated default Swiss masterworks?')) {
      setWatches(INITIAL_WATCHES);
      localStorage.setItem('luxora_watches', JSON.stringify(INITIAL_WATCHES));
    }
  };

  // Add review to a watch
  const handleAddReview = (
    watchId: string,
    reviewData: Omit<WatchReview, 'id' | 'date' | 'verified'>
  ) => {
    const newRev: WatchReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
      verified: true,
    };

    setWatches((prev) =>
      prev.map((w) => {
        if (w.id === watchId) {
          const updatedReviews = [newRev, ...w.reviews];
          const newAvg =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...w,
            reviews: updatedReviews,
            rating: Math.round(newAvg * 100) / 100,
          };
        }
        return w;
      })
    );

    if (selectedDetailWatch && selectedDetailWatch.id === watchId) {
      setSelectedDetailWatch((prev) => {
        if (!prev) return null;
        const updated = [newRev, ...prev.reviews];
        return {
          ...prev,
          reviews: updated,
          rating: Math.round((updated.reduce((sum, r) => sum + r.rating, 0) / updated.length) * 100) / 100,
        };
      });
    }
  };

  // Navigation smoothly scrolls to section
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const heroWatch = watches[0] || INITIAL_WATCHES[0];
  const comparedWatches = watches.filter((w) => comparedIds.includes(w.id));

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        comparisonCount={comparedIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          // Filter to wishlisted watches or open catalog
          handleNavigateSection('catalog');
        }}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenShowroom={() => setActiveShowroomWatch(heroWatch)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={handleNavigateSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Full Hero 3D Showroom Section */}
        <HeroShowroom
          heroWatch={heroWatch}
          onOpenShowroom={() => setActiveShowroomWatch(heroWatch)}
          onExploreCollection={() => handleNavigateSection('catalog')}
          onSelectWatch={(watch) => setSelectedDetailWatch(watch)}
        />

        {/* Master Catalog Collection */}
        <WatchCatalog
          watches={watches}
          onOpenDetails={(watch) => setSelectedDetailWatch(watch)}
          onOpenShowroom={(watch) => setActiveShowroomWatch(watch)}
          onAddToCart={handleAddToCart}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          comparedIds={comparedIds}
          onToggleCompare={handleToggleCompare}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Bespoke Horology Advisor / Matchmaker */}
        <HorologyAdvisor
          watches={watches}
          onOpenShowroom={(watch) => setActiveShowroomWatch(watch)}
          onOpenDetails={(watch) => setSelectedDetailWatch(watch)}
          onAddToCart={handleAddToCart}
        />

        {/* Heritage Section & Pakistan Boutiques */}
        <HeritageSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenShowroom={() => setActiveShowroomWatch(heroWatch)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* ====================================================
          MODALS & DRAWERS
          ==================================================== */}

      {/* 1. Fullscreen 3D Showroom Modal */}
      {activeShowroomWatch && (
        <WatchShowroomModal
          watch={activeShowroomWatch}
          allWatches={watches}
          onClose={() => setActiveShowroomWatch(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          onSelectDifferentWatch={(w) => setActiveShowroomWatch(w)}
          isWishlisted={wishlistIds.includes(activeShowroomWatch.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* 2. Detailed Watch Specs & Review Modal */}
      {selectedDetailWatch && (
        <WatchDetailModal
          watch={selectedDetailWatch}
          onClose={() => setSelectedDetailWatch(null)}
          onOpenShowroom={(w) => {
            setSelectedDetailWatch(null);
            setActiveShowroomWatch(w);
          }}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          isWishlisted={wishlistIds.includes(selectedDetailWatch.id)}
          onToggleWishlist={handleToggleWishlist}
          isCompared={comparedIds.includes(selectedDetailWatch.id)}
          onToggleCompare={handleToggleCompare}
          onAddReview={handleAddReview}
        />
      )}

      {/* 3. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 4. Checkout & Printable Invoice Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountPercent={appliedCheckoutDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 5. Admin Dashboard Studio */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        watches={watches}
        orders={orders}
        onAddWatch={handleAddWatch}
        onUpdateWatch={handleUpdateWatch}
        onDeleteWatch={handleDeleteWatch}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onResetDefaults={handleResetDefaults}
      />

      {/* 6. Side-by-side Watch Comparison Modal */}
      <WatchComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedWatches={comparedWatches}
        onRemoveWatch={(id) => setComparedIds((prev) => prev.filter((i) => i !== id))}
        onOpenShowroom={(w) => {
          setIsComparisonOpen(false);
          setActiveShowroomWatch(w);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
