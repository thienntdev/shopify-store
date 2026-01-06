/** @format */
"use client";

import { useState, useRef, useEffect, Fragment, useCallback } from "react";
import Link from "next/link";
import { navigationItems, type NavigationItem } from "@/data/navigation";

export default function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [dropdownTop, setDropdownTop] = useState<number>(200);
  const ulRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

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
        <ul ref={ulRef} className="flex items-center justify-center gap-6 pt-4">
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
                className={`text-sm lg:text-sm font-medium hover:text-orange-500 transition-colors ${
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
                            className="font-semibold text-lg mb-3 text-gray-900 hover:text-orange-500 transition-colors block uppercase"
                          >
                            {section.title}
                          </Link>
                        ) : (
                          <h3 className="font-semibold mb-3 text-gray-900">
                            {section.title}
                          </h3>
                        )}
                        <ul className="space-y-1.5 text-lg text-gray-600">
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
