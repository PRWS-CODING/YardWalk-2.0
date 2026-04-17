import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // or your framework's plugin

export default defineConfig({
  base: "/", // Use absolute paths for Vercel to ensure assets load correctly
  plugins: [react()],
});
