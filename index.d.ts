interface GypoLogger {
    stdout(value: string): void,
    stderr(value: string): void,
    tag(value: string): GypoLogger,

    log(...args: Object[]): void,
    info(...args: Object[]): void,
    error(...args: Object[]): void,
    debug(...args: Object[]): void,
    warn(...args: Object[]): void,
    success(...args: Object[]): void,
    trace(...args: Object[]): void,
    die(...args: Object[]): void
}

declare const gypo: GypoLogger;
export default gypo;