"use client";
// Composes the public home page from the shared navigation and product introduction.
import Header from "@/app/_components/Header";
import Hero from "@/app/_components/Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
