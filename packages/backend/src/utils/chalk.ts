export class Chalk {
  static fgRed(str: string) {
    return `\x1b[31m${str}\x1b[37m`;
  }
  static fgGreen(str: string) {
    return `\x1b[32m${str}\x1b[37m`;
  }
  static fgYellow(str: string) {
    return `\x1b[33m${str}\x1b[37m`;
  }
  static fgBlue(str: string) {
    return `\x1b[34m${str}\x1b[37m`;
  }
  static fgMagenta(str: string) {
    return `\x1b[35m${str}\x1b[37m`;
  }
  static fgCyan(str: string) {
    return `\x1b[36m${str}\x1b[37m`;
  }
  static fgWhite(str: string) {
    return `\x1b[37m${str}`;
  }

  static bgRed(str: string) {
    return `\x1b[41m${str}\x1b[40m`;
  }
  static bgGreen(str: string) {
    return `\x1b[42m${str}\x1b[40m`;
  }
  static bgYellow(str: string) {
    return `\x1b[43m${str}\x1b[40m`;
  }
  static bgBlue(str: string) {
    return `\x1b[44m${str}\x1b[40m`;
  }
  static bgMagenta(str: string) {
    return `\x1b[45m${str}\x1b[40m`;
  }
  static bgCyan(str: string) {
    return `\x1b[46m${str}\x1b[40m`;
  }
  static bgWhite(str: string) {
    return `\x1b[47m${str}\x1b[40m`;
  }
}
