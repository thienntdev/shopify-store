/** @format */

import PromotionBanner from "./PromotionBanner";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import TrackOrder from "../ui/TrackOrder";
import CartButton from "../ui/CartButton";
import Logo from "../ui/Logo";
import { getMenu } from "@/libs/shopify";

export default async function Header() {
  const menu = await getMenu("next-js-frontend-menu");
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Promotional Banner */}
      <PromotionBanner />

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
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
