/**
 * Shared color utilities for consistent user coloring across components
 */

/**
 * Generate a consistent pastel color from a user ID
 * This ensures the same user always gets the same color across all views
 */
export const getColorFromId = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 70% 80%)`;
};

/**
 * Generate Tailwind-compatible color classes from a user ID
 * Returns both background and text color classes for consistent styling
 */
export const getTailwindColorsFromId = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  
  // Map hue to predefined Tailwind color classes for consistency
  const hue = h % 360;
  
  if (hue < 30) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
  if (hue < 60) return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
  if (hue < 90) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
  if (hue < 120) return { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200' };
  if (hue < 150) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
  if (hue < 180) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (hue < 210) return { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' };
  if (hue < 240) return { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' };
  if (hue < 270) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
  if (hue < 300) return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' };
  if (hue < 330) return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
  return { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' };
};

/**
 * Generate initials from a name (consistent with VortexAvatars component)
 */
export const getInitialsFromName = (name = "?") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
