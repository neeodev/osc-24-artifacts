/**
 *
 * @param delay in milliseconds
 * @returns Decorator that will delay the execution of the method by the specified delay
 */

export function Sleep(delay: number) {
  return function SleepDecorator<
    This,
    ArgsType,
    Args extends ArgsType[],
    Return,
    Fn extends (this: This, ...args: Args) => Return
  >(target: Fn, context: ClassMethodDecoratorContext<This, Fn>) {
    console.log(context);
    return function (this: This, ...args: Args) {
      setTimeout(() => {
        target.call(this, ...args);
      }, delay);
    };
  };
}
