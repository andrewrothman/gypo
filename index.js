const toString = obj => typeof obj === "string" ? obj : typeof obj === "object" ? JSON.stringify(obj) : new String(obj);
const allToString = all => all.map(toString).join(" ");

// ANSI color codes
const colors = {
    blue: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
};

const levels = [
    { name: "log", output: "stdout", shouldHideLevel: true },
    { name: "info", color: "blue", output: "stdout" },
    { name: "error", color: "red", output: "stderr" },
    { name: "die", color: "red", output: "stderr" },
    { name: "debug", output: "stdout" },
    { name: "warn", color: "yellow", output: "stdout" },
    { name: "success", color: "green", output: "stdout" },
    { name: "trace", output: "stdout" }
];

const createLogger = (stdout, stderr, tagList) => {
    let logger = {
        tagList,
        stdout,
        stderr
    };

    levels.forEach(level => {
        const levelStr = !level.shouldHideLevel ? `(${level.name}) ` : "";
        const tagStr = logger.tagList !== undefined ? `[${logger.tagList.join("/")}] ` : "";
        const colorize = val => level.color !== undefined ? colors[level.color] + val + colors.reset : val;
        logger[level.name] = (...args) => logger[level.output](colorize(tagStr + levelStr + allToString(args)))
    });

    const oldDie = logger.die;

    logger.die = (...args) => {
        oldDie(...args);
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