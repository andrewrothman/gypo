const toString = obj => typeof obj === "string" ? obj : typeof obj === "object" ? JSON.stringify(obj) : new String(obj);
const allToString = all => all.map(toString).join(" ");

const levels = [
    {
        name: "log",
        output: "stdout"
    },
    {
        name: "info",
        color: "blue",
        output: "stdout"
    },
    {
        name: "error",
        color: "red",
        output: "stderr"
    },
    {
        name: "debug",
        output: "stdout"
    },
    {
        name: "warn",
        color: "yellow",
        output: "stdout"
    },
    {
        name: "success",
        color: "green",
        output: "stdout"
    },
    {
        name: "trace",
        output: "stdout"
    }
    // NOTE: `die` is not listed here, as its implementation is somewhat different
]

const createLogger = (stdout, stderr, tagValue) => {
    let logger = {
        tagValue,
        stdout,
        stderr
    };

    levels.forEach(level => {
        const tagStr = logger.tagValue !== undefined ? `[${logger.tagValue}] ` : "";
        logger[level.name] = (...args) => logger[level.output](tagStr + allToString(args));
    });

    logger.die = (...args) => {
        logger.error.apply(this, args);
        process.exit(1);
    };

    logger.tag = tag => createLogger(logger.stdout, logger.stderr, tag);

    return logger;
}

const defaultStdout = value => console.log(value);
const defaultStderr = value => console.error(value);

const gypo = createLogger(defaultStdout, defaultStderr);

module.exports.default = gypo;