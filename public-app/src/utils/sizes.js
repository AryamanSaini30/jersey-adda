export const defaultJerseySizes = ['S', 'M', 'L', 'XL', '2XL'];

const sizeAliases = {
  ZXL: '2XL',
  XXL: '2XL',
};

export function normalizeSizes(value) {
  if (Array.isArray(value)) {
    return value
      .map((size) => sizeAliases[String(size || '').toUpperCase()] || String(size || '').toUpperCase())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((size) => sizeAliases[size.trim().toUpperCase()] || size.trim().toUpperCase())
      .filter(Boolean);
  }

  return defaultJerseySizes;
}
