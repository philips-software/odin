import createDebugger from 'debug';
import type { Debugger } from 'debug';

class Logger {

  private readonly debugger: Debugger;
  private readonly scope: string;

  constructor(scope: string, parent?: Logger) {
    scope = [parent?.scope, scope].filter(Boolean).join(':');

    this.debugger = createDebugger(scope);
    this.debugger.namespace = `[${scope}]:`;
    this.scope = scope;
  }

  /**
   * Provides a child logger with an extended 'decorators' namespace.
   */
  public get decorators(): Omit<Logger, 'decorators'> {
    return new Logger('decorators', this);
  }

  /**
   * Creates a message with the logger namespace, usually used to throw standardized errors.
   */
  public createMessage(...data: any[]): string {
    return [this.debugger.namespace, ...data].join(' ');
  }

  /**
   * Logs a debug-level message.
   * Visibility is controlled through the 'debug' package.
   */
  public debug(...data: any[]): void {
    // @ts-expect-error: TS2556, a spread argument must either have a tuple type or be passed to a rest parameter.
    this.debugger(...data);
  }

}

export {
  Logger,
};
