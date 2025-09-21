
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
