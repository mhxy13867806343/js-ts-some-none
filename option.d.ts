/**
 * TypeScript type definitions for Rust-like Option type
 */

// Base Option interface
export interface IOption<T> {
  isSome(): boolean;
  isNone(): boolean;
  unwrap(): T;
  unwrapOr<U>(defaultValue: U): T | U;
  unwrapOrElse<U>(fn: () => U): T | U;
  map<U>(fn: (value: T) => U): Option<U>;
  mapOr<U, V>(defaultValue: V, fn: (value: T) => U): U | V;
  mapOrElse<U, V>(defaultFn: () => V, fn: (value: T) => U): U | V;
  filter(predicate: (value: T) => boolean): Option<T>;
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;
  or<U>(other: Option<U>): Option<T | U>;
  orElse<U>(fn: () => Option<U>): Option<T | U>;
  toString(): string;
  toJSON(): { type: 'Some' | 'None'; value: T | undefined };
  match<U>(matcher: {
    Some: (value: T) => U;
    None: () => U;
  }): U;
}

// Some interface
export interface ISome<T> extends IOption<T> {
  readonly value: T;
  isSome(): this is ISome<T>;
  isNone(): this is INone;
  unwrap(): T;
}

// None interface
export interface INone extends IOption<never> {
  isSome(): this is ISome<never>;
  isNone(): this is INone;
  unwrap(): never;
}

// Option type union
export type Option<T> = ISome<T> | INone;

// Factory function types
export interface SomeConstructor {
  <T>(value: T): ISome<T>;
}

export interface NoneConstructor {
  (): INone;
}

// Pattern matching types
export type Pattern<T, R> = 
  | [SomeConstructor, (value: T) => R]
  | [NoneConstructor, () => R]
  | [ISome<T>, R | ((value: T) => R)]
  | [INone, R | (() => R)];

export interface MatchFunction {
  <T, R>(option: Option<T>, patterns: Pattern<T, R>[]): R;
}

// Export the factory functions and match
export declare const Some: SomeConstructor;
export declare const None: NoneConstructor;
export declare const match: MatchFunction;

// Utility types for better TypeScript integration
export type Unwrap<T> = T extends Option<infer U> ? U : never;
export type IsSome<T> = T extends ISome<any> ? true : false;
export type IsNone<T> = T extends INone ? true : false;

// Helper types for common patterns
export type OptionResult<T, E = Error> = Option<T> | E;
export type AsyncOption<T> = Promise<Option<T>>;

// Utility functions types
export interface OptionUtils {
  /**
   * Convert a nullable value to Option
   */
  fromNullable<T>(value: T | null | undefined): Option<NonNullable<T>>;
  
  /**
   * Convert an array of Options to Option of array
   */
  sequence<T>(options: Option<T>[]): Option<T[]>;
  
  /**
   * Apply a function that returns Option to each element
   */
  traverse<T, U>(array: T[], fn: (item: T) => Option<U>): Option<U[]>;
  
  /**
   * Combine two Options with a function
   */
  map2<T, U, V>(opt1: Option<T>, opt2: Option<U>, fn: (a: T, b: U) => V): Option<V>;
  
  /**
   * Get the first Some value from an array of Options
   */
  firstSome<T>(options: Option<T>[]): Option<T>;
}

export declare const OptionUtils: OptionUtils;

// Module augmentation for better integration
declare global {
  interface Array<T> {
    /**
     * Safe array access that returns Option
     */
    get(index: number): Option<T>;
    
    /**
     * Find first element that matches predicate
     */
    findOption(predicate: (value: T, index: number, array: T[]) => boolean): Option<T>;
  }
  
  interface Object {
    /**
     * Safe property access that returns Option
     */
    getProperty<K extends keyof this>(key: K): Option<this[K]>;
  }
}

// Export everything as default for convenience
declare const _default: {
  Some: typeof Some;
  None: typeof None;
  Option: typeof Option;
  OptionUtils: typeof OptionUtils;
};
export default _default;