/** @format */

// Types
export interface DropdownLink {
  label: string;
  href: string;
  badge?: string; // Optional badge like "🔥"
}

export interface DropdownSection {
  title: string;
  href?: string; // Title có thể click được
  links: DropdownLink[];
}

export interface NavigationItem {
  name: string;
  href: string;
  color?: string;
  hasDropdown?: boolean;
  dropdownContent?: DropdownSection[]; // Mỗi item có nhiều sections
}

export const navigationItems: NavigationItem[] = [
  { name: "Valentine", href: "/valentine", color: "text-orange-500" },
  { name: "Pet Lovers", href: "/pet-lovers", color: "text-blue-500" },
  {
    name: "Occasions",
    href: "/occasions",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "Holidays",
        href: "/occasions/holidays",
        links: [
          { label: "Christmas", href: "/occasions/christmas" },
          { label: "New Year", href: "/occasions/new-year" },
          { label: "Valentine's Day", href: "/occasions/valentines" },
          { label: "Easter", href: "/occasions/easter" },
        ],
      },
      {
        title: "Special Events",
        href: "/occasions/special-events",
        links: [
          { label: "Birthday", href: "/occasions/birthday" },
          { label: "Anniversary", href: "/occasions/anniversary" },
          { label: "Wedding", href: "/occasions/wedding" },
          { label: "Graduation", href: "/occasions/graduation" },
        ],
      },
      {
        title: "Seasonal",
        href: "/occasions/seasonal",
        links: [
          { label: "Spring", href: "/occasions/spring" },
          { label: "Summer", href: "/occasions/summer" },
          { label: "Fall", href: "/occasions/fall" },
          { label: "Winter", href: "/occasions/winter" },
        ],
      },
    ],
  },
  {
    name: "Recipients",
    href: "/recipients",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "For Her",
        href: "/recipients/for-her",
        links: [
          {
            label: "All Gifts for Her",
            href: "/recipients/for-her/all",
            badge: "🔥",
          },
          { label: "Jewelry", href: "/recipients/for-her/jewelry" },
          { label: "Accessories", href: "/recipients/for-her/accessories" },
          { label: "Home Decor", href: "/recipients/for-her/home-decor" },
        ],
      },
      {
        title: "For Him",
        href: "/recipients/for-him",
        links: [
          {
            label: "All Gifts for Him",
            href: "/recipients/for-him/all",
            badge: "🔥",
          },
          { label: "Apparel", href: "/recipients/for-him/apparel" },
          { label: "Drinkware", href: "/recipients/for-him/drinkware" },
          { label: "Accessories", href: "/recipients/for-him/accessories" },
        ],
      },
      {
        title: "For Kids",
        href: "/recipients/for-kids",
        links: [
          { label: "All Gifts for Kids", href: "/recipients/for-kids/all" },
          { label: "Toys", href: "/recipients/for-kids/toys" },
          { label: "Apparel", href: "/recipients/for-kids/apparel" },
          { label: "Accessories", href: "/recipients/for-kids/accessories" },
        ],
      },
    ],
  },
  {
    name: "Decorations",
    href: "/decorations",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "Ornament",
        href: "/decorations/ornament",
        links: [
          {
            label: "All Ornaments",
            href: "/decorations/ornament/all",
            badge: "🔥",
          },
          { label: "Family Ornament", href: "/decorations/ornament/family" },
          { label: "Couple Ornament", href: "/decorations/ornament/couple" },
          {
            label: "Pet Lover Ornament",
            href: "/decorations/ornament/pet-lover",
          },
        ],
      },
      {
        title: "Light & Candle",
        href: "/decorations/light-candle",
        links: [
          {
            label: "Bottle Lamp",
            href: "/decorations/light-candle/bottle-lamp",
          },
          {
            label: "3D LED Light",
            href: "/decorations/light-candle/led-light",
          },
          { label: "Jar Light", href: "/decorations/light-candle/jar-light" },
          {
            label: "Candle Holders",
            href: "/decorations/light-candle/candle-holders",
          },
        ],
      },
      {
        title: "Wall Art",
        href: "/decorations/wall-art",
        links: [
          { label: "Poster", href: "/decorations/wall-art/poster" },
          { label: "Canvas", href: "/decorations/wall-art/canvas" },
          {
            label: "Framed Prints",
            href: "/decorations/wall-art/framed-prints",
          },
          { label: "Metal Signs", href: "/decorations/wall-art/metal-signs" },
        ],
      },
    ],
  },
  {
    name: "Apparel",
    href: "/apparel",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "T-Shirts",
        href: "/apparel/t-shirts",
        links: [
          {
            label: "All T-Shirts",
            href: "/apparel/t-shirts/all",
            badge: "🔥",
          },
          { label: "Men's T-Shirts", href: "/apparel/t-shirts/mens" },
          { label: "Women's T-Shirts", href: "/apparel/t-shirts/womens" },
          { label: "Kids T-Shirts", href: "/apparel/t-shirts/kids" },
        ],
      },
      {
        title: "Hoodies",
        href: "/apparel/hoodies",
        links: [
          { label: "All Hoodies", href: "/apparel/hoodies/all" },
          { label: "Pullover Hoodies", href: "/apparel/hoodies/pullover" },
          { label: "Zip-Up Hoodies", href: "/apparel/hoodies/zip-up" },
        ],
      },
      {
        title: "Accessories",
        href: "/apparel/accessories",
        links: [
          { label: "Hats", href: "/apparel/accessories/hats" },
          { label: "Bags", href: "/apparel/accessories/bags" },
          { label: "Socks", href: "/apparel/accessories/socks" },
        ],
      },
    ],
  },
  {
    name: "Accessories",
    href: "/accessories",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "Phone Cases",
        href: "/accessories/phone-cases",
        links: [
          {
            label: "All Phone Cases",
            href: "/accessories/phone-cases/all",
            badge: "🔥",
          },
          { label: "iPhone Cases", href: "/accessories/phone-cases/iphone" },
          {
            label: "Samsung Cases",
            href: "/accessories/phone-cases/samsung",
          },
        ],
      },
      {
        title: "Bags & Wallets",
        href: "/accessories/bags-wallets",
        links: [
          { label: "Tote Bags", href: "/accessories/bags-wallets/tote" },
          { label: "Backpacks", href: "/accessories/bags-wallets/backpacks" },
          { label: "Wallets", href: "/accessories/bags-wallets/wallets" },
        ],
      },
      {
        title: "Keychains & More",
        href: "/accessories/keychains",
        links: [
          { label: "Keychains", href: "/accessories/keychains/all" },
          { label: "Lanyards", href: "/accessories/keychains/lanyards" },
          { label: "Magnets", href: "/accessories/keychains/magnets" },
        ],
      },
    ],
  },
  {
    name: "Drinkware",
    href: "/drinkware",
    hasDropdown: true,
    dropdownContent: [
      {
        title: "Mugs",
        href: "/drinkware/mugs",
        links: [
          { label: "All Mugs", href: "/drinkware/mugs/all", badge: "🔥" },
          { label: "Ceramic Mugs", href: "/drinkware/mugs/ceramic" },
          { label: "Travel Mugs", href: "/drinkware/mugs/travel" },
          { label: "Coffee Mugs", href: "/drinkware/mugs/coffee" },
        ],
      },
      {
        title: "Water Bottles",
        href: "/drinkware/water-bottles",
        links: [
          {
            label: "All Water Bottles",
            href: "/drinkware/water-bottles/all",
          },
          {
            label: "Stainless Steel",
            href: "/drinkware/water-bottles/stainless",
          },
          {
            label: "Plastic Bottles",
            href: "/drinkware/water-bottles/plastic",
          },
        ],
      },
      {
        title: "Tumblers",
        href: "/drinkware/tumblers",
        links: [
          { label: "All Tumblers", href: "/drinkware/tumblers/all" },
          {
            label: "Stainless Tumblers",
            href: "/drinkware/tumblers/stainless",
          },
          { label: "Acrylic Tumblers", href: "/drinkware/tumblers/acrylic" },
        ],
      },
    ],
  },
  { name: "Reviews", href: "/reviews" },
];
