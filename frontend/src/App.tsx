import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <>
      {/* Artisanal noise texture overlay — fixed, 2% opacity, z-[9999] */}
      <div className="noise-overlay" />
      <AppRoutes />
    </>
  );
}
