// utils/dataTransformer.ts

// Converte uma string de snake_case para camelCase
const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

// Verifica se um objeto é um objeto simples (e não um array, Date, etc.)
const isObject = function (o: any): o is object {
  return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
};

// Converte as chaves de um objeto ou array de objetos de snake_case para camelCase
export const snakeToCamel = <T>(o: any): T => {
  if (isObject(o)) {
    const n: { [key: string]: any } = {};
    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = snakeToCamel((o as any)[k]);
      });
    return n as T;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return snakeToCamel(i);
    }) as any;
  }
  return o as T;
};

// Converte uma string de camelCase para snake_case
const toSnake = (s: string): string => {
    return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Converte as chaves de um objeto de camelCase para snake_case
export const camelToSnake = <T>(o: any): T => {
    if (isObject(o)) {
        const n: { [key: string]: any } = {};
        Object.keys(o).forEach((k) => {
            n[toSnake(k)] = (o as any)[k];
        });
        return n as T;
    } else if (Array.isArray(o)) {
        return o.map(v => camelToSnake(v)) as any;
    }
    return o as T;
};
