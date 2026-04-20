import { ReactNode } from "react";
import { useAuth } from "../../store/authStore";
import { CartProvider } from "../../store/cartStore";

export default function CartProviderWithUser({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <CartProvider userId={user?.id ?? null}>{children}</CartProvider>;
}
