export interface GypoLogger {
    tagValue: string,
    log(...args: string[]): void,
    info(...args: string[]): void,
    error(...args: string[]): void,
    debug(...args: string[]): void,
    warn(...args: string[]): void,
    success(...args: string[]): void,
    trace(...args: string[]): void,
    die(...args: string[]): void,
    tag(value: string[]): GypoLogger
}

export default GypoLogger;