/** @format */

import PromotionBanner from "./PromotionBanner";
import SearchBar from "./SearchBar";
import NavigationMenu from "./NavigationMenu";
import TrackOrder from "../ui/nav/TrackOrder";
import CartButton from "../ui/nav/CartButton";
import WishlistButton from "../ui/nav/WishlistButton";
import SearchIcon from "../ui/nav/SearchIcon";
import MobileMenuButton from "../ui/nav/MobileMenuButton";
import CountrySelector from "../ui/nav/CountrySelector";
import Logo from "../ui/Logo";
import MobileSearchBar from "./MobileSearchBar";

export default async function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Promotional Banner */}
      <PromotionBanner />

      {/* Main Header */}
      <div className="container mx-auto px-4 py-1 lg:py-4 relative">
        {/* Mobile/Tablet Layout */}
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <MobileMenuButton />
          <Logo />
          <div className="flex items-center gap-4">
            <MobileSearchBar />
            <WishlistButton />
            <CartButton />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          <Logo />
          <SearchBar />
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <CountrySelector />
            <WishlistButton />
            <TrackOrder />
            <CartButton />
          </div>
        </div>
        <div className="hidden lg:block">
          <NavigationMenu />
        </div>
      </div>
    </header>
  );
}
