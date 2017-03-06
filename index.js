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

const createLogger = (stdout, stderr, tagList) => {
    let logger = {
        tagList,
        stdout,
        stderr
    };

    levels.forEach(level => {
        const tagStr = logger.tagList !== undefined ? `[${logger.tagList.join("/")}] ` : "";
        logger[level.name] = (...args) => logger[level.output](tagStr + allToString(args));
    });

    logger.die = (...args) => {
        logger.error.apply(this, args);
        process.exit(1);
    };

    logger.tag = tag => {
        let newTagList = logger.tagList !== undefined ? logger.tagList.slice() : [];
        newTagList.push(tag);

        return createLogger(logger.stdout, logger.stderr, newTagList);
    }

    return logger;
}

const defaultStdout = value => console.log(value);
const defaultStderr = value => console.error(value);

const gypo = createLogger(defaultStdout, defaultStderr);

module.exports.default = gypo;