import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ResultProvider } from "./context/ResultContext";
import CameraPage from "./pages/CameraPage";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

const rootRoute = createRootRoute({
  component: () => (
    <ResultProvider>
      <Outlet />
      <Toaster position="top-center" />
    </ResultProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/camera",
  component: CameraPage,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/result",
  component: ResultPage,
});

const routeTree = rootRoute.addChildren([homeRoute, cameraRoute, resultRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
