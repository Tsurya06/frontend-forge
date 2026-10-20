import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders";
import { AppRoutes } from "@/app/routes";
import { AiTutorDrawer } from "@/components/ai";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProviders>
        <AppRoutes />
        <AiTutorDrawer />
      </AppProviders>
    </BrowserRouter>
  );
}
