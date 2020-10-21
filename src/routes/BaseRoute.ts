export class BaseRoute {
  static methods (): string[] {
    return Object.getOwnPropertyNames(this.prototype)
      .filter(method => method !== 'constructor' && !method.startsWith('_'))
  }
}
