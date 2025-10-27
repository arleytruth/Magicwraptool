"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Car, Armchair, Home, Building, Smartphone, Package, Gauge, ShoppingBag, Check } from "lucide-react";
import type { WrapCategory } from "@/types/wrap";

const categories = [
  { id: 'vehicle' as WrapCategory, label: 'Vehicle Wrapping', icon: Car },
  { id: 'furniture' as WrapCategory, label: 'Furniture Wrapping', icon: Armchair },
  { id: 'wall' as WrapCategory, label: 'Wall Wrapping', icon: Home },
  { id: 'building' as WrapCategory, label: 'Building Wrapping', icon: Building },
  { id: 'electronics' as WrapCategory, label: 'Electronics Wrapping', icon: Smartphone },
  { id: 'box' as WrapCategory, label: 'Box Wrapping', icon: Package },
  { id: 'auto_tuning' as WrapCategory, label: 'Auto Tuning', icon: Gauge },
  { id: 'general_item' as WrapCategory, label: 'Item Wrapping', icon: ShoppingBag }
];

interface CategorySelectorProps {
  selectedCategory?: WrapCategory;
  onSelect: (category: WrapCategory) => void;
  disabled?: boolean;
  onRequireAuth?: () => void;
}

export function CategorySelector({
  selectedCategory,
  onSelect,
  disabled = false,
  onRequireAuth,
}: CategorySelectorProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`cursor-pointer transition-all hover:shadow-md relative ${
            selectedCategory === category.id
              ? "ring-2 ring-primary bg-primary/10"
              : "hover:bg-primary/20"
          } ${disabled ? "cursor-not-allowed" : ""}`}
          onClick={() => {
            if (disabled) {
              onRequireAuth?.();
              return;
            }
            onSelect(category.id);
          }}
        >
          <CardContent className="p-4 text-center">
            {selectedCategory === category.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="mb-2 flex justify-center">
              <category.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-sm">{category.label}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
