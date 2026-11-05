import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { isPostHogConfigured, POSTHOG_HOST, POSTHOG_KEY } from "@/lib/analytics";

if (isPostHogConfigured) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    person_profiles: "always",
    loaded: (client) => {
      client.capture("$pageview", {
        $current_url: window.location.href,
        path: window.location.pathname,
      });

      if (import.meta.env.DEV) {
        client.debug();
      }
    },
  });
} else if (import.meta.env.DEV) {
  console.warn("PostHog is not configured. Add VITE_PUBLIC_POSTHOG_KEY and VITE_PUBLIC_POSTHOG_HOST.");
}

createRoot(document.getElementById("root")!).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
);
