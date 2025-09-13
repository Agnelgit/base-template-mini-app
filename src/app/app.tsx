"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";

// note: dynamic import is required for components that use the Frame SDK
const MoneySaver = dynamic(() => import("~/components/MoneySaver"), {
  ssr: false,
});

const HomePage = dynamic(() => import("~/components/HomePage"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Money Saver" }
) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <HomePage onLoginSuccess={handleLoginSuccess} />;
  }

  return <MoneySaver />;
}
