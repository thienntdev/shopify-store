/** @format */

"use client";

import Link from "next/link";
import PromotionBanner from "./PromotionBanner";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import TrackOrder from "../ui/TrackOrder";
import CartButton from "../ui/CartButton";
import Logo from "../ui/Logo";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Promotional Banner */}
      <PromotionBanner />

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          <SearchBar />

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <TrackOrder />
            <CartButton />
          </div>
        </div>
        <NavigationMenu />
      </div>
    </header>
  );
}
