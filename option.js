/**
 * JavaScript implementation of Rust's Option type
 * Provides Some and None variants for handling optional values
 */

// Base Option class
class Option {
  constructor() {
    if (this.constructor === Option) {
      throw new Error('Option is an abstract class and cannot be instantiated directly');
    }
  }

  // Check if this is Some variant
  isSome() {
    return this instanceof SomeClass;
  }

  // Check if this is None variant
  isNone() {
    return this instanceof None;
  }

  // Unwrap the value, throws error if None
  unwrap() {
    if (this.isNone()) {
      throw new Error('Called unwrap on a None value');
    }
    return this.value;
  }

  // Unwrap with default value if None
  unwrapOr(defaultValue) {
    return this.isSome() ? this.value : defaultValue;
  }

  // Unwrap with function result if None
  unwrapOrElse(fn) {
    return this.isSome() ? this.value : fn();
  }

  // Map function over the contained value
  map(fn) {
    return this.isSome() ? Some(fn(this.value)) : None();
  }

  // Map or return default value
  mapOr(defaultValue, fn) {
    return this.isSome() ? fn(this.value) : defaultValue;
  }

  // Map or call function for default
  mapOrElse(defaultFn, fn) {
    return this.isSome() ? fn(this.value) : defaultFn();
  }

  // Filter the option based on predicate
  filter(predicate) {
    if (this.isSome() && predicate(this.value)) {
      return this;
    }
    return None();
  }

  // Chain operations that return Option
  andThen(fn) {
    return this.isSome() ? fn(this.value) : None();
  }

  // Return this option or another option
  or(other) {
    return this.isSome() ? this : other;
  }

  // Return this option or call function
  orElse(fn) {
    return this.isSome() ? this : fn();
  }

  // Convert to string representation
  toString() {
    return this.isSome() ? `Some(${this.value})` : 'None';
  }

  // Convert to JSON
  toJSON() {
    return {
      type: this.isSome() ? 'Some' : 'None',
      value: this.isSome() ? this.value : undefined
    };
  }
}

// Some variant - contains a value
class SomeClass extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  // Enhanced toString for better display of different JS types
  toString() {
    const valueStr = this._formatValue(this.value);
    return `Some(${valueStr})`;
  }

  _formatValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'function') {
      return value.name ? `function ${value.name}` : 'function';
    }
    if (Array.isArray(value)) {
      return `[${value.map(v => this._formatValue(v)).join(', ')}]`;
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[object Object]';
      }
    }
    return String(value);
  }
}

// None variant - represents absence of value
class NoneClass extends Option {
  constructor() {
    super();
    this.value = undefined;
  }
}

// Singleton None instance
const noneInstance = new NoneClass();

// Factory functions
function Some(value) {
  // Support all JavaScript types
  return new SomeClass(value);
}

function None() {
  return noneInstance;
}

// Pattern matching utility
function match(option, patterns) {
  for (const [pattern, handler] of patterns) {
    if (typeof pattern === 'function') {
      // Check if pattern is Some or None constructor
      if (pattern === Some && option.isSome()) {
        return typeof handler === 'function' ? handler(option.value) : handler;
      }
      if (pattern === None && option.isNone()) {
        return typeof handler === 'function' ? handler() : handler;
      }
    } else if (pattern instanceof SomeClass && option.isSome()) {
      // Check if values match
      if (pattern.value === option.value) {
        return typeof handler === 'function' ? handler(option.value) : handler;
      }
    } else if (pattern instanceof NoneClass && option.isNone()) {
      return typeof handler === 'function' ? handler() : handler;
    }
  }
  throw new Error('Non-exhaustive patterns in match');
}

// ES Module exports
export { Option, Some, None, match };

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Option, Some, None, match };
}

// Browser global compatibility
if (typeof window !== 'undefined') {
  window.Option = Option;
  window.Some = Some;
  window.None = None;
  window.match = match;
}