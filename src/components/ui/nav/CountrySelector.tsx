/** @format */

"use client";

import { useState, useEffect, useRef } from "react";

// Danh sách các quốc gia phổ biến với currency code - sắp xếp theo ABC
const COUNTRIES = [
  { code: "AF", name: "Afghanistan", currency: "AFN" },
  { code: "AX", name: "Åland Islands", currency: "EUR" },
  { code: "AL", name: "Albania", currency: "ALL" },
  { code: "DZ", name: "Algeria", currency: "DZD" },
  { code: "AD", name: "Andorra", currency: "EUR" },
  { code: "AO", name: "Angola", currency: "USD" },
  { code: "AI", name: "Anguilla", currency: "XCD" },
  { code: "AR", name: "Argentina", currency: "ARS" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "AT", name: "Austria", currency: "EUR" },
  { code: "BE", name: "Belgium", currency: "EUR" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "CL", name: "Chile", currency: "CLP" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "CO", name: "Colombia", currency: "COP" },
  { code: "CZ", name: "Czech Republic", currency: "CZK" },
  { code: "DK", name: "Denmark", currency: "DKK" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "FI", name: "Finland", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "GR", name: "Greece", currency: "EUR" },
  { code: "IE", name: "Ireland", currency: "EUR" },
  { code: "IL", name: "Israel", currency: "ILS" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "IT", name: "Italy", currency: "EUR" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "NZ", name: "New Zealand", currency: "NZD" },
  { code: "NO", name: "Norway", currency: "NOK" },
  { code: "PE", name: "Peru", currency: "PEN" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "PL", name: "Poland", currency: "PLN" },
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "RU", name: "Russia", currency: "RUB" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "SE", name: "Sweden", currency: "SEK" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "TR", name: "Turkey", currency: "TRY" },
  { code: "AE", name: "United Arab Emirates", currency: "AED" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "US", name: "United States", currency: "USD" },
  { code: "VN", name: "Vietnam", currency: "VND" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [typedChars, setTypedChars] = useState("");
  const typedCharsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved country from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deliveryCountry");
    if (saved) {
      try {
        const country = JSON.parse(saved);
        setSelectedCountry(country);
      } catch (error) {
        console.error("Error loading saved country:", error);
      }
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typedCharsTimeoutRef.current) {
        clearTimeout(typedCharsTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Đóng dropdown nếu click ra ngoài dropdown và input
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        dropdownListRef.current &&
        !dropdownListRef.current.contains(target) &&
        !target.closest("[data-country-trigger]")
      ) {
        setIsDropdownOpen(false);
        setTypedChars("");
        // Blur input để có thể mở lại khi click vào
        if (inputRef.current) {
          inputRef.current.blur();
        }
        if (typedCharsTimeoutRef.current) {
          clearTimeout(typedCharsTimeoutRef.current);
        }
      }
    };

    if (isDropdownOpen) {
      // Sử dụng setTimeout để tránh đóng ngay khi mở
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Close modal when clicking outside (but not when dropdown is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if dropdown is open
      if (isDropdownOpen) {
        return;
      }

      const target = event.target as HTMLElement;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !target.closest("[data-country-trigger]")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Không set overflow hidden để giữ scrollbar
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isDropdownOpen]);

  const handleSelectCountry = (country: (typeof COUNTRIES)[0]) => {
    setSelectedCountry(country);
  };

  const handleSave = () => {
    localStorage.setItem("deliveryCountry", JSON.stringify(selectedCountry));
    setIsOpen(false);
    // Có thể thêm logic để update currency hoặc reload page
    window.location.reload();
  };

  return (
    <>
      <button
        data-country-trigger
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-2 py-2 text-gray-700 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h2.945M21 11a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium">{selectedCountry.name}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col relative min-h-[300px] pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                Update Your Preferences
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1">
              <p className="text-gray-900 mb-4">Select your shipping country</p>

              {/* Dropdown Input */}
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    readOnly
                    value={selectedCountry.name}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      // Không reset typedChars để có thể type liên tục
                    }}
                    onClick={() => {
                      // Mở dropdown khi click vào input (kể cả khi đã focus)
                      setIsDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      // Đảm bảo dropdown mở khi type
                      if (!isDropdownOpen) {
                        setIsDropdownOpen(true);
                      }

                      // Khi user type, scroll đến country đầu tiên (KHÔNG filter)
                      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
                        // Clear timeout cũ nếu có
                        if (typedCharsTimeoutRef.current) {
                          clearTimeout(typedCharsTimeoutRef.current);
                        }

                        // Chỉ dùng ký tự vừa gõ, không cộng dồn
                        const currentChar = e.key.toLowerCase();
                        setTypedChars(currentChar);
                        // KHÔNG set searchQuery để không filter danh sách

                        // Scroll đến country đầu tiên bắt đầu bằng ký tự vừa gõ
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            // Tìm country đầu tiên bắt đầu bằng ký tự vừa gõ
                            const firstMatch = COUNTRIES.find((c) =>
                              c.name.toLowerCase().startsWith(currentChar)
                            );

                            if (firstMatch && dropdownListRef.current) {
                              const element =
                                dropdownListRef.current.querySelector(
                                  `[data-country-code="${firstMatch.code}"]`
                                ) as HTMLElement;
                              if (element && dropdownListRef.current) {
                                const container = dropdownListRef.current;
                                const elementTop = element.offsetTop;
                                // Scroll đến element với padding
                                const scrollTop = Math.max(0, elementTop - 10);
                                container.scrollTo({
                                  top: scrollTop,
                                  behavior: "smooth",
                                });
                              }
                            }
                          }, 50);
                        });

                        // Reset typedChars sau 1 giây không type
                        typedCharsTimeoutRef.current = setTimeout(() => {
                          setTypedChars("");
                        }, 1000);
                      } else if (e.key === "Backspace") {
                        // Clear timeout cũ nếu có
                        if (typedCharsTimeoutRef.current) {
                          clearTimeout(typedCharsTimeoutRef.current);
                        }

                        // Xóa typedChars khi backspace
                        setTypedChars("");
                        // KHÔNG set searchQuery để không filter danh sách

                        // Scroll về đầu danh sách
                        if (dropdownListRef.current) {
                          dropdownListRef.current.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }

                        // Reset typedChars sau 1 giây không type
                        typedCharsTimeoutRef.current = setTimeout(() => {
                          setTypedChars("");
                        }, 1000);
                      } else if (e.key === "Escape") {
                        setIsDropdownOpen(false);
                        setTypedChars("");
                        setSearchQuery("");
                        if (typedCharsTimeoutRef.current) {
                          clearTimeout(typedCharsTimeoutRef.current);
                        }
                      }
                    }}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 cursor-pointer"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
                </div>

                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownListRef}
                    className="fixed z-10002 w-full max-w-md mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    style={{
                      top: dropdownRef.current
                        ? dropdownRef.current.getBoundingClientRect().bottom + 8
                        : undefined,
                      left: dropdownRef.current
                        ? dropdownRef.current.getBoundingClientRect().left
                        : undefined,
                      width: dropdownRef.current
                        ? dropdownRef.current.getBoundingClientRect().width
                        : undefined,
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {COUNTRIES.length > 0 ? (
                      COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          data-country-code={country.code}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectCountry(country);
                            setSearchQuery("");
                            setTypedChars("");
                            setIsDropdownOpen(false);
                            if (typedCharsTimeoutRef.current) {
                              clearTimeout(typedCharsTimeoutRef.current);
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedCountry.code === country.code
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {country.name} ({country.currency})
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No countries found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 border-t border-gray-200 space-y-4 shrink-0">
              <button
                onClick={handleSave}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Save & Continue
              </button>
              <p className="text-sm text-gray-600 text-center">
                Learn more about our{" "}
                <a
                  href="/shipping-policy"
                  className="text-orange-500 hover:underline"
                >
                  Shipping Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
