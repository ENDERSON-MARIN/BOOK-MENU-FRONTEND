/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslin0t-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

/**
 * Hook para criar callbacks estáveis que não causam re-renders desnecessários
 * Similar ao useCallback, mas garante que a referência nunca muda
 *
 * @param callback - Função callback
 * @returns Callback estável
 *
 * @example
 * const handleClick = useStableCallback((value: string) => {
 *   console.log(value);
 * });
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef(callback);

  // Atualiza a ref sempre que o callback mudar
  callbackRef.current = callback;

  // Retorna uma função estável que sempre chama a versão mais recente
  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

/**
 * Função para comparação superficial de objetos
 * Útil para React.memo e otimizações de re-render
 *
 * @param objA - Primeiro objeto
 * @param objB - Segundo objeto
 * @returns true se os objetos são iguais superficialmente
 */
export function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      objA[key] !== objB[key]
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Throttle function - limita a frequência de execução de uma função
 * Útil para eventos que disparam muitas vezes (scroll, resize, etc)
 *
 * @param func - Função a ser throttled
 * @param limit - Limite em milissegundos
 * @returns Função throttled
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scrolling...');
 * }, 200);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * Debounce function - atrasa a execução de uma função até que pare de ser chamada
 * Útil para inputs de busca e filtros
 *
 * @param func - Função a ser debounced
 * @param delay - Delay em milissegundos
 * @returns Função debounced
 *
 * @example
 * const handleSearch = debounce((searchTerm: string) => {
 *   fetchResults(searchTerm);
 * }, 500);
 *
 * input.addEventListener('input', (e) => handleSearch(e.target.value));
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Memoização simples para funções puras
 * Cache o resultado de funções baseado nos argumentos
 *
 * @param fn - Função a ser memoizada
 * @returns Função memoizada
 *
 * @example
 * const expensiveCalculation = memoize((a: number, b: number) => {
 *   // Cálculo pesado
 *   return a * b;
 * });
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
