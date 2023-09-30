import createDebugger from 'debug';
import type { Debugger } from 'debug';

class Logger {

  private readonly debugger: Debugger;
  private readonly parent?: Logger;
  private readonly scope: string;

  constructor(scope: string, parent?: Logger) {
    scope = [parent?.scope, scope].filter(Boolean).join(':');

    this.debugger = createDebugger(scope);
    this.debugger.namespace = `[${scope}]:`;
    this.parent = parent;
    this.scope = scope;
  }

  /**
   * Provides a child logger with an extended 'decorators' namespace.
   */
  public get decorators(): Omit<Logger, 'decorators'> {
    return new Logger('decorators', this);
  }

  /**
   * Logs a debug-level message.
   * Visibility is controlled through the 'debug' package.
   */
  public debug(...data: any[]): void {
    // @ts-expect-error: TS2556, a spread argument must either have a tuple type or be passed to a rest parameter.
    this.debugger(...data);
  }

  /**
   * Creates a message with the logger namespace, usually used to throw standardized errors.
   */
  public createMessage(...parts: any[]): string {
    parts = this.prepareMessage(...parts);
    return [this.debugger.namespace, ...parts].join(' ');
  }

  /**
   * Prepares a message by converting each part provided into a string.
   *
   * @param parts the parts of the message to be prepared.
   * @returns an array of strings representing the prepared message parts.
   * @throws Error if any part is an object or array.
   */
  public prepareMessage(...parts: any[]): string[] {
    return parts.map(part => {
      if (part && typeof part === 'object') {
        throw new Error(this.createMessage('Cannot create message with array or object as argument.'));
      }

      if (typeof part === 'string') {
        return this.prepareMessagePart(part);
      }

      return String(part);
    });
  }

  /**
   * Prepares a message part by removing the scope and extra whitespaces.
   *
   * @param part the message part to be prepared.
   * @returns the prepared message part.
   */
  public prepareMessagePart(part: string): string {
    part = part
      .replaceAll(this.debugger.namespace, '')
      .replaceAll(/\s+/g, ' ');

    return this.parent
      ? this.parent.prepareMessagePart(part)
      : part;
  }

}

export {
  Logger,
};
