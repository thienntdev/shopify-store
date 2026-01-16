/** @format */

"use client";

import { useState, useEffect, useRef } from "react";

import { formatPrice, formatPriceWithCurrency } from "@/utils/format";

interface PriceRangeSliderProps {
  priceRange: { min: number; max: number };
  priceFilter: { min: number; max: number };
  onPriceChange: (min: number, max: number) => void;
  autoUpdate?: boolean; // If false, only update when apply is called
  onValueChange?: (min: number, max: number) => void; // Callback to get current values (for manual apply)
}

export default function PriceRangeSlider({
  priceRange,
  priceFilter,
  onPriceChange,
  autoUpdate = true, // Default to true for mobile
  onValueChange,
}: PriceRangeSliderProps) {
  // Use lazy state initialization (5.6)
  const [localMinPrice, setLocalMinPrice] = useState(() => priceFilter.min);
  const [localMaxPrice, setLocalMaxPrice] = useState(() => priceFilter.max);
  const [minPriceInput, setMinPriceInput] = useState(() =>
    formatPrice(priceFilter.min)
  );
  const [maxPriceInput, setMaxPriceInput] = useState(() =>
    formatPrice(priceFilter.max)
  );
  const [isDragging, setIsDragging] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const slider1Ref = useRef<HTMLInputElement>(null);
  const slider2Ref = useRef<HTMLInputElement>(null);

  // Sync local state with prop
  const prevPriceFilterRef = useRef({
    min: priceFilter.min,
    max: priceFilter.max,
  });

  useEffect(() => {
    if (
      prevPriceFilterRef.current.min !== priceFilter.min ||
      prevPriceFilterRef.current.max !== priceFilter.max
    ) {
      setLocalMinPrice(priceFilter.min);
      setLocalMaxPrice(priceFilter.max);
      setMinPriceInput(formatPrice(priceFilter.min));
      setMaxPriceInput(formatPrice(priceFilter.max));
      prevPriceFilterRef.current = {
        min: priceFilter.min,
        max: priceFilter.max,
      };
    }
  }, [priceFilter.min, priceFilter.max]);

  // Get actual min and max based on current values
  const actualMin = Math.min(localMinPrice, localMaxPrice);
  const actualMax = Math.max(localMinPrice, localMaxPrice);

  const handlePriceSliderChange = (
    sliderId: "slider1" | "slider2",
    value: number
  ) => {
    const clampedValue = Math.max(
      priceRange.min,
      Math.min(value, priceRange.max)
    );

    // Use functional setState updates (5.5) - read both values together
    if (sliderId === "slider1") {
      // Update min price, checking against current max
      setLocalMaxPrice((prevMax) => {
        setLocalMinPrice((prevMin) => {
          if (clampedValue > prevMax) {
            // Swap: min exceeds max, so swap them
            setMinPriceInput(formatPrice(prevMax));
            setMaxPriceInput(formatPrice(clampedValue));
            return prevMax; // min becomes old max
          } else {
            // Normal case: min is within range
            setMinPriceInput(formatPrice(clampedValue));
            return clampedValue;
          }
        });
        // Update max if it was swapped
        if (clampedValue > prevMax) {
          return clampedValue; // max becomes new value
        }
        return prevMax;
      });
    } else {
      // Update max price, checking against current min
      setLocalMinPrice((prevMin) => {
        setLocalMaxPrice((prevMax) => {
          if (clampedValue < prevMin) {
            // Swap: max goes below min, so swap them
            setMaxPriceInput(formatPrice(prevMin));
            setMinPriceInput(formatPrice(clampedValue));
            return prevMin; // max becomes old min
          } else {
            // Normal case: max is within range
            setMaxPriceInput(formatPrice(clampedValue));
            return clampedValue;
          }
        });
        // Update min if it was swapped
        if (clampedValue < prevMin) {
          return clampedValue; // min becomes new value
        }
        return prevMin;
      });
    }
  };

  // Update parent when values change (debounced) - only if autoUpdate is true
  useEffect(() => {
    const newActualMin = Math.min(localMinPrice, localMaxPrice);
    const newActualMax = Math.max(localMinPrice, localMaxPrice);

    if (autoUpdate) {
      // Auto-update: call onPriceChange with debounce
      const timer = setTimeout(() => {
        onPriceChange(newActualMin, newActualMax);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Manual update: just notify parent of current values via onValueChange
      if (onValueChange) {
        onValueChange(newActualMin, newActualMax);
      }
    }
  }, [localMinPrice, localMaxPrice, onPriceChange, autoUpdate, onValueChange]);

  const handlePriceInputChange = (type: "min" | "max", value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue === "") {
      if (type === "min") {
        setMinPriceInput("");
      } else {
        setMaxPriceInput("");
      }
      return;
    }

    const numValue = parseFloat(numericValue) || 0;
    const clampedValue = Math.max(
      priceRange.min,
      Math.min(numValue, priceRange.max)
    );

    if (type === "min") {
      handlePriceSliderChange("slider1", clampedValue);
    } else {
      handlePriceSliderChange("slider2", clampedValue);
    }
  };

  // Helper function to handle slider interaction (both mouse and touch)
  const handleSliderInteraction = (
    x: number,
    rect: DOMRect,
    type: "mouse" | "touch"
  ) => {
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const clickedValue =
      priceRange.min + percentage * (priceRange.max - priceRange.min);

    const slider1Pos =
      ((localMinPrice - priceRange.min) / (priceRange.max - priceRange.min)) *
      rect.width;
    const slider2Pos =
      ((localMaxPrice - priceRange.min) / (priceRange.max - priceRange.min)) *
      rect.width;

    const thumbSize = 20;
    const nearSlider1 = Math.abs(x - slider1Pos) < thumbSize;
    const nearSlider2 = Math.abs(x - slider2Pos) < thumbSize;

    if (nearSlider1 && !nearSlider2) {
      setIsDragging(true);
      if (slider1Ref.current) {
        slider1Ref.current.style.zIndex = "40";
        if (slider2Ref.current) slider2Ref.current.style.zIndex = "30";
        handlePriceSliderChange("slider1", Math.round(clickedValue));

        const handleMove = (moveX: number) => {
          const moveRect = sliderTrackRef.current?.getBoundingClientRect();
          if (!moveRect) return;
          const moveXPos = moveX - moveRect.left;
          const movePercentage = Math.max(
            0,
            Math.min(1, moveXPos / moveRect.width)
          );
          const moveValue =
            priceRange.min + movePercentage * (priceRange.max - priceRange.min);
          handlePriceSliderChange("slider1", Math.round(moveValue));
        };

        const handleMouseMove = (moveE: MouseEvent) => {
          handleMove(moveE.clientX);
        };

        const handleTouchMove = (moveE: TouchEvent) => {
          if (moveE.touches[0]) {
            handleMove(moveE.touches[0].clientX);
          }
        };

        const handleEnd = () => {
          setIsDragging(false);
          if (type === "mouse") {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleEnd);
          } else {
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleEnd);
          }
          if (slider1Ref.current && slider2Ref.current) {
            slider1Ref.current.style.zIndex = "25";
            slider2Ref.current.style.zIndex = "30";
          }
        };

        if (type === "mouse") {
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleEnd);
        } else {
          document.addEventListener("touchmove", handleTouchMove);
          document.addEventListener("touchend", handleEnd);
        }
      }
      return;
    } else if (nearSlider2 && !nearSlider1) {
      setIsDragging(true);
      if (slider2Ref.current) {
        slider2Ref.current.style.zIndex = "40";
        if (slider1Ref.current) slider1Ref.current.style.zIndex = "25";
        handlePriceSliderChange("slider2", Math.round(clickedValue));

        const handleMove = (moveX: number) => {
          const moveRect = sliderTrackRef.current?.getBoundingClientRect();
          if (!moveRect) return;
          const moveXPos = moveX - moveRect.left;
          const movePercentage = Math.max(
            0,
            Math.min(1, moveXPos / moveRect.width)
          );
          const moveValue =
            priceRange.min + movePercentage * (priceRange.max - priceRange.min);
          handlePriceSliderChange("slider2", Math.round(moveValue));
        };

        const handleMouseMove = (moveE: MouseEvent) => {
          handleMove(moveE.clientX);
        };

        const handleTouchMove = (moveE: TouchEvent) => {
          if (moveE.touches[0]) {
            handleMove(moveE.touches[0].clientX);
          }
        };

        const handleEnd = () => {
          setIsDragging(false);
          if (type === "mouse") {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleEnd);
          } else {
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleEnd);
          }
          if (slider1Ref.current && slider2Ref.current) {
            slider1Ref.current.style.zIndex = "25";
            slider2Ref.current.style.zIndex = "30";
          }
        };

        if (type === "mouse") {
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleEnd);
        } else {
          document.addEventListener("touchmove", handleTouchMove);
          document.addEventListener("touchend", handleEnd);
        }
      }
      return;
    }

    // Track click - move the closer slider
    const distance1 = Math.abs(clickedValue - localMinPrice);
    const distance2 = Math.abs(clickedValue - localMaxPrice);

    setIsDragging(true);
    if (distance1 < distance2) {
      handlePriceSliderChange("slider1", Math.round(clickedValue));
    } else {
      handlePriceSliderChange("slider2", Math.round(clickedValue));
    }

    const handleEnd = () => {
      setIsDragging(false);
      if (type === "mouse") {
        document.removeEventListener("mouseup", handleEnd);
      } else {
        document.removeEventListener("touchend", handleEnd);
      }
    };

    if (type === "mouse") {
      document.addEventListener("mouseup", handleEnd);
    } else {
      document.addEventListener("touchend", handleEnd);
    }
  };

  return (
    <div className="space-y-4">
      {/* Price Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={
              minPriceInput
                ? formatPriceWithCurrency(
                    parseFloat(minPriceInput.replace(/[^\d]/g, "")) || actualMin
                  )
                : formatPriceWithCurrency(actualMin)
            }
            onChange={(e) => handlePriceInputChange("min", e.target.value)}
            onBlur={() => {
              const numValue =
                parseFloat(minPriceInput.replace(/[^\d]/g, "")) || actualMin;
              const clamped = Math.max(
                priceRange.min,
                Math.min(numValue, priceRange.max)
              );
              handlePriceSliderChange("slider1", clamped);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={formatPriceWithCurrency(priceRange.min)}
          />
        </div>
        <span className="text-gray-500">-</span>
        <div className="flex-1">
          <input
            type="text"
            value={
              maxPriceInput
                ? formatPriceWithCurrency(
                    parseFloat(maxPriceInput.replace(/[^\d]/g, "")) || actualMax
                  )
                : formatPriceWithCurrency(actualMax)
            }
            onChange={(e) => handlePriceInputChange("max", e.target.value)}
            onBlur={() => {
              const numValue =
                parseFloat(maxPriceInput.replace(/[^\d]/g, "")) || actualMax;
              const clamped = Math.max(
                priceRange.min,
                Math.min(numValue, priceRange.max)
              );
              handlePriceSliderChange("slider2", clamped);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={formatPriceWithCurrency(priceRange.max)}
          />
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-6">
        <div
          ref={sliderTrackRef}
          className="relative h-2 bg-gray-200 rounded-lg"
        >
          {/* Active range track */}
          <div
            className={`absolute h-2 bg-red-500 rounded-lg ${
              isDragging ? "" : "transition-all duration-300 ease-out"
            }`}
            style={{
              left: `${
                ((actualMin - priceRange.min) /
                  (priceRange.max - priceRange.min)) *
                100
              }%`,
              width: `${
                ((actualMax - actualMin) / (priceRange.max - priceRange.min)) *
                100
              }%`,
            }}
          />
          {/* Overlay to catch ALL clicks and touches */}
          <div
            className="absolute inset-0 z-50 cursor-pointer touch-none"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!sliderTrackRef.current) return;
              const rect = sliderTrackRef.current.getBoundingClientRect();
              handleSliderInteraction(e.clientX - rect.left, rect, "mouse");
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!sliderTrackRef.current) return;
              const rect = sliderTrackRef.current.getBoundingClientRect();
              const touch = e.touches[0];
              if (touch) {
                handleSliderInteraction(
                  touch.clientX - rect.left,
                  rect,
                  "touch"
                );
              }
            }}
            style={{
              pointerEvents: "auto",
            }}
          />
          {/* Slider 1 */}
          <input
            ref={slider1Ref}
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={localMinPrice}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              handlePriceSliderChange("slider1", val);
            }}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            style={{
              zIndex: 25,
              pointerEvents: "none",
            }}
          />
          {/* Slider 2 */}
          <input
            ref={slider2Ref}
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={localMaxPrice}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              handlePriceSliderChange("slider2", val);
            }}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
            style={{
              zIndex: 30,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
