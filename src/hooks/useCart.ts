"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/yandexMetrika";
import {
  addCartItem,
  CART_OPEN_EVENT,
  CART_UPDATED_EVENT,
  CART_STORAGE_KEY,
  clearCart,
  readCart,
  replaceCartFromServer,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart/cartStorage";
import { readServerCart, syncCartToServer } from "@/lib/cart/serverCartClient";
import type { RequestItemInput } from "@/types/requestItem";

export function useCart() {
  const [items, setItems] = useState<RequestItemInput[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    refresh();
    let cancelled = false;

    void readServerCart().then((snapshot) => {
      if (cancelled || snapshot === null) return;
      if (snapshot.hasSession) {
        replaceCartFromServer(snapshot.items);
        setItems(snapshot.items);
        return;
      }

      const localItems = readCart();
      if (localItems.length > 0) void syncCartToServer(localItems);
    });

    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) refresh();
    };

    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    const onOpenRequest = () => {
      trackEvent(ANALYTICS_EVENTS.cartOpen);
      setOpen(true);
    };
    window.addEventListener(CART_OPEN_EVENT, onOpenRequest);

    return () => {
      cancelled = true;
      window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_OPEN_EVENT, onOpenRequest);
    };
  }, [refresh]);

  const addItem = useCallback((item: RequestItemInput) => {
    setItems(addCartItem(item));
    trackEvent(ANALYTICS_EVENTS.addToCart, {
      itemType: String(item.itemType ?? "shopProduct"),
      slug: String(item.slug ?? ""),
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems(removeCartItem(key));
    trackEvent(ANALYTICS_EVENTS.removeFromCart, { key });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems(updateCartItemQuantity(key, quantity));
  }, []);

  const clear = useCallback(() => {
    setItems(clearCart());
  }, []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [items],
  );

  return {
    items,
    count,
    open,
    setOpen,
    addItem,
    removeItem,
    setQuantity,
    clear,
  };
}
