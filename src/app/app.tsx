"use client";

import dynamic from "next/dynamic";
import { APP_NAME } from "~/lib/constants";

// note: dynamic import is required for components that use the Frame SDK
const MoneySaver = dynamic(() => import("~/components/MoneySaver"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Money Saver" }
) {
  return <MoneySaver />;
}
