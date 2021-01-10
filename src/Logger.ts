export default class Logger {
  static log = console.log
  static warn = console.warn
  static error = console.error
  static debug = console.debug
  static info = console.info

  static patch() {}
}
