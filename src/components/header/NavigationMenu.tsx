/** @format */
"use client";

import { useState, useRef, useEffect, Fragment, useCallback } from "react";
import Link from "next/link";

// Types
interface DropdownLink {
  label: string;
  href: string;
  badge?: string; // Optional badge like "🔥"
}

interface DropdownSection {
  title: string;
  href?: string; // Title có thể click được
  links: DropdownLink[];
}

interface NavigationItem {
  name: string;
  href: string;
  color?: string;
  hasDropdown?: boolean;
  dropdownContent?: DropdownSection[]; // Mỗi item có nhiều sections
}

export default function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState<number>(200);
  const ulRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const navigationItems: NavigationItem[] = [
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

  // Kiểm tra xem chuột có trong vùng tam giác an toàn không
  // Vùng tam giác: từ 2 góc trên dropdown (trái và phải) xuống vị trí menu item
  const isMouseInSafeTriangle = (
    mouseX: number,
    mouseY: number,
    dropdownLeft: number,
    dropdownRight: number,
    dropdownTop: number,
    menuItemBottom: number
  ): boolean => {
    // Chuột phải đang ở giữa menu item và dropdown
    if (mouseY < menuItemBottom || mouseY > dropdownTop) return false;

    // Tính toán vùng tam giác: từ 2 góc dropdown mở rộng lên trên
    // Khoảng cách từ menu item đến dropdown
    const distance = dropdownTop - menuItemBottom;

    // Vùng rộng ở menu item (từ center mở rộng)
    const safeWidthAtTop = Math.min(distance * 0.5, 100); // Tối đa 100px mỗi bên

    // Vị trí center của dropdown
    const dropdownCenter = (dropdownLeft + dropdownRight) / 2;

    // Kiểm tra xem chuột có nằm trong vùng tam giác không
    // Vùng tam giác mở rộng từ dropdown lên menu item
    const relativeY = mouseY - menuItemBottom;
    const widthAtMouseY = (safeWidthAtTop * (distance - relativeY)) / distance;

    return (
      mouseX >= dropdownCenter - widthAtMouseY &&
      mouseX <= dropdownCenter + widthAtMouseY
    );
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(
    (itemName: string, liElement: HTMLLIElement | null) => {
      // Clear timeout hiện tại nếu có
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }

      // Tạo timeout để đóng dropdown sau 100ms
      closeTimeoutRef.current = setTimeout(() => {
        // Nếu dropdown đang mở và liElement tồn tại thì kiểm tra xem chuột có trong vùng tam giác an toàn không
        if (dropdownRef.current && isMenuOpen === itemName && liElement) {
          const dropdownRect = dropdownRef.current.getBoundingClientRect();
          const liRect = liElement.getBoundingClientRect();
          const { x, y } = mousePositionRef.current;

          // Kiểm tra xem chuột có trong vùng tam giác an toàn không
          const inSafeZone = isMouseInSafeTriangle(
            x,
            y,
            dropdownRect.left,
            dropdownRect.right,
            dropdownRect.top,
            liRect.bottom
          );

          // Nếu chuột đang trong dropdown hoặc vùng an toàn thì không đóng
          const inDropdown =
            x >= dropdownRect.left &&
            x <= dropdownRect.right &&
            y >= dropdownRect.top &&
            y <= dropdownRect.bottom;

          if (!inDropdown && !inSafeZone) {
            setIsMenuOpen(null);
          }
        } else {
          setIsMenuOpen(null);
        }
      }, 100); // Delay nhỏ để kiểm tra
    },
    [isMenuOpen]
  );

  // Debounce function để tránh update quá nhiều lần
  const updateDropdownPosition = useCallback(() => {
    if (ulRef.current) {
      const rect = ulRef.current.getBoundingClientRect();
      // Tính top = bottom của ul + margin top (8px)
      setDropdownTop(rect.bottom + 8);
    }
  }, []);

  // Effect để track mouse position và update dropdown position
  useEffect(() => {
    if (!isMenuOpen) return;

    // Cập nhật position ngay khi menu mở
    updateDropdownPosition();

    // Thêm event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", updateDropdownPosition, {
      passive: true,
    });
    window.addEventListener("resize", updateDropdownPosition, {
      passive: true,
    });

    // Dùng ResizeObserver để detect khi header thay đổi kích thước (khi banner đóng/mở)
    const headerElement = ulRef.current?.closest("header");
    if (headerElement) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateDropdownPosition();
      });
      resizeObserverRef.current.observe(headerElement);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", updateDropdownPosition);
      window.removeEventListener("resize", updateDropdownPosition);
      if (resizeObserverRef.current && headerElement) {
        resizeObserverRef.current.unobserve(headerElement);
        resizeObserverRef.current = null;
      }
    };
  }, [isMenuOpen, handleMouseMove, updateDropdownPosition]);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Fragment>
      <nav className="mt-4 border-t border-gray-200">
        <ul ref={ulRef} className="flex items-center justify-center gap-6 py-3">
          {navigationItems.map((item) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={(e) => {
                if (item.hasDropdown) {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                  }
                  setIsMenuOpen(item.name);
                }
              }}
              onMouseLeave={(e) => {
                if (item.hasDropdown) {
                  handleMouseLeave(item.name, e.currentTarget);
                }
              }}
            >
              <Link
                href={item.href}
                className={`text-sm font-medium hover:text-orange-500 transition-colors ${
                  item.color || "text-gray-700"
                }`}
              >
                {item.name}
                {item.hasDropdown && (
                  <svg
                    className="inline-block w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </Link>

              {/* Dropdown Menu - Dynamic Content */}
              {item.hasDropdown &&
                isMenuOpen === item.name &&
                item.dropdownContent && (
                  <div
                    ref={dropdownRef}
                    className="fixed left-1/2 -translate-x-1/2 w-auto min-w-1/2 max-h-[80vh] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-6 grid grid-cols-3 gap-6 z-50"
                    style={{ top: `${dropdownTop}px` }}
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                      }
                    }}
                    onMouseLeave={() => setIsMenuOpen(null)}
                  >
                    {item.dropdownContent.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {/* Section Title - Clickable if href exists */}
                        {section.href ? (
                          <Link
                            href={section.href}
                            className="font-semibold mb-3 text-gray-900 hover:text-orange-500 transition-colors block"
                          >
                            {section.title}
                          </Link>
                        ) : (
                          <h3 className="font-semibold mb-3 text-gray-900">
                            {section.title}
                          </h3>
                        )}
                        <ul className="space-y-1.5 text-sm text-gray-600">
                          {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link
                                href={link.href}
                                className="hover:text-orange-500 transition-colors flex items-center gap-1"
                              >
                                {link.label}
                                {link.badge && (
                                  <span className="text-orange-500">
                                    {link.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
            </li>
          ))}
        </ul>
      </nav>
    </Fragment>
  );
}
