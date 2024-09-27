/**
 *
 * @param delay in milliseconds
 * @returns Decorator that will delay the execution of the method by the specified delay
 */

export const Sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
