// A curated list of vibrant colors from Tailwind CSS, adapted for this utility.
// Each color object contains shades for different UI elements.
export const CLIENT_COLORS = [
  { name: 'rose', bg50: 'bg-rose-50', bg100: 'bg-rose-100', border500: 'border-rose-500', bg500: 'bg-rose-500', text800: 'text-rose-800', text900: 'text-rose-900' },
  { name: 'pink', bg50: 'bg-pink-50', bg100: 'bg-pink-100', border500: 'border-pink-500', bg500: 'bg-pink-500', text800: 'text-pink-800', text900: 'text-pink-900' },
  { name: 'fuchsia', bg50: 'bg-fuchsia-50', bg100: 'bg-fuchsia-100', border500: 'border-fuchsia-500', bg500: 'bg-fuchsia-500', text800: 'text-fuchsia-800', text900: 'text-fuchsia-900' },
  { name: 'purple', bg50: 'bg-purple-50', bg100: 'bg-purple-100', border500: 'border-purple-500', bg500: 'bg-purple-500', text800: 'text-purple-800', text900: 'text-purple-900' },
  { name: 'violet', bg50: 'bg-violet-50', bg100: 'bg-violet-100', border500: 'border-violet-500', bg500: 'bg-violet-500', text800: 'text-violet-800', text900: 'text-violet-900' },
  { name: 'indigo', bg50: 'bg-indigo-50', bg100: 'bg-indigo-100', border500: 'border-indigo-500', bg500: 'bg-indigo-500', text800: 'text-indigo-800', text900: 'text-indigo-900' },
  { name: 'blue', bg50: 'bg-blue-50', bg100: 'bg-blue-100', border500: 'border-blue-500', bg500: 'bg-blue-500', text800: 'text-blue-800', text900: 'text-blue-900' },
  { name: 'sky', bg50: 'bg-sky-50', bg100: 'bg-sky-100', border500: 'border-sky-500', bg500: 'bg-sky-500', text800: 'text-sky-800', text900: 'text-sky-900' },
  { name: 'cyan', bg50: 'bg-cyan-50', bg100: 'bg-cyan-100', border500: 'border-cyan-500', bg500: 'bg-cyan-500', text800: 'text-cyan-800', text900: 'text-cyan-900' },
  { name: 'teal', bg50: 'bg-teal-50', bg100: 'bg-teal-100', border500: 'border-teal-500', bg500: 'bg-teal-500', text800: 'text-teal-800', text900: 'text-teal-900' },
  { name: 'emerald', bg50: 'bg-emerald-50', bg100: 'bg-emerald-100', border500: 'border-emerald-500', bg500: 'bg-emerald-500', text800: 'text-emerald-800', text900: 'text-emerald-900' },
  { name: 'green', bg50: 'bg-green-50', bg100: 'bg-green-100', border500: 'border-green-500', bg500: 'bg-green-500', text800: 'text-green-800', text900: 'text-green-900' },
  { name: 'lime', bg50: 'bg-lime-50', bg100: 'bg-lime-100', border500: 'border-lime-500', bg500: 'bg-lime-500', text800: 'text-lime-800', text900: 'text-lime-900' },
  { name: 'yellow', bg50: 'bg-yellow-50', bg100: 'bg-yellow-100', border500: 'border-yellow-500', bg500: 'bg-yellow-500', text800: 'text-yellow-800', text900: 'text-yellow-900' },
  { name: 'amber', bg50: 'bg-amber-50', bg100: 'bg-amber-100', border500: 'border-amber-500', bg500: 'bg-amber-500', text800: 'text-amber-800', text900: 'text-amber-900' },
  { name: 'orange', bg50: 'bg-orange-50', bg100: 'bg-orange-100', border500: 'border-orange-500', bg500: 'bg-orange-500', text800: 'text-orange-800', text900: 'text-orange-900' },
];

/**
 * A simple hashing function to convert a string (like a client ID) into a number.
 * This is used to deterministically pick a color from the CLIENT_COLORS array.
 * @param str The string to hash.
 * @returns A number hash.
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Gets a consistent color palette for a given client ID.
 * It uses a hash of the client ID to pick a color from the CLIENT_COLORS array,
 * ensuring that the same client always gets the same color.
 * @param clientId The ID of the client.
 * @returns A color object with Tailwind classes for different shades.
 */
export const getClientColor = (clientId: string | undefined) => {
  if (!clientId) {
      // Return a default gray color if no ID is provided.
      return { name: 'gray', bg50: 'bg-gray-50', bg100: 'bg-gray-100', border500: 'border-gray-500', bg500: 'bg-gray-500', text800: 'text-gray-800', text900: 'text-gray-900' };
  }
  const hash = simpleHash(clientId);
  const index = hash % CLIENT_COLORS.length;
  return CLIENT_COLORS[index];
};

// Deprecated stage colors, kept for reference or potential future use if needed.
export const STAGE_COLORS = [
  { name: 'blue', bg: 'bg-blue-200', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-500' },
  { name: 'purple', bg: 'bg-purple-200', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-500' },
  { name: 'yellow', bg: 'bg-yellow-200', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-500' },
  { name: 'green', bg: 'bg-green-200', text: 'text-green-800 dark:text-green-300', border: 'border-green-500' },
  { name: 'pink', bg: 'bg-pink-200', text: 'text-pink-800 dark:text-pink-300', border: 'border-pink-500' },
  { name: 'indigo', bg: 'bg-indigo-200', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-500' },
  { name: 'teal', bg: 'bg-teal-200', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-500' },
  { name: 'gray', bg: 'bg-gray-200', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-500' },
];

export const getColorClasses = (colorName: string | undefined) => {
  if (!colorName) return STAGE_COLORS.find(c => c.name === 'gray')!;
  return STAGE_COLORS.find(c => c.name === colorName) || STAGE_COLORS.find(c => c.name === 'gray')!;
};