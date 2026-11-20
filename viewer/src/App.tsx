import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BotPage from "./pages/BotPage";
import MapPage from "./pages/MapPage";
import { Landing } from "./pages/viewerShared";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Prototype viewer: shows any prototype made with the Blue Dots Assistant, in the Dots library layout.
// /p/:id is the bot page, /p/:id/map the dot map. /uat/... reads from the test instance.
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/p/:id" element={<BotPage env="prod" />} />
          <Route path="/p/:id/map" element={<MapPage env="prod" />} />
          <Route path="/uat/p/:id" element={<BotPage env="uat" />} />
          <Route path="/uat/p/:id/map" element={<MapPage env="uat" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
