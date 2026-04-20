import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./store/authStore";
import CartProviderWithUser from "./components/shared/CartProviderWithUser";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProviderWithUser>
          <App />
        </CartProviderWithUser>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
