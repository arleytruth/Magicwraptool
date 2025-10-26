export const wrapCategories = [
    "vehicle",
    "furniture",
    "wall",
    "building",
    "electronics",
    "box",
    "auto_tuning",
    "general_item",
] as const;

export type WrapCategory = (typeof wrapCategories)[number];
