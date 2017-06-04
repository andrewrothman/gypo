// gypo
// Andrew Rothman

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

const getGloballyEnabledLogLevels = () => {
    if (process.env["GYPO_LOG_LEVELS_ENABLED"] !== undefined) {
        return process.env["GYPO_LOG_LEVELS_ENABLED"].split(",").map(entry => entry.trim());
    }
    else {
        if (process.env.NODE_ENV === "production") {
            return ["log", "info", "error", "die", "warn", "success"];
        }
        else {
            return levels.map(level => level.name);
        }
    }
};

// returns true or false representing if the logger has the specified
// log level enabled... environment variables take precedent
const shouldLog = (level, enabledLogLevels) => enabledLogLevels.find(entry => entry === level) !== undefined && getGloballyEnabledLogLevels().find(entry => entry === level);

const createLogger = (stdout, stderr, tagList, enabledLogLevels) => {
    let logger = {
        tagList,
        stdout,
        stderr,
        enabledLogLevels
    };

    levels.forEach(level => {
        const levelStr = !level.shouldHideLevel ? `(${level.name}) ` : "";
        const tagStr = logger.tagList !== undefined ? `[${logger.tagList.join("/")}] ` : "";
        const colorize = val => level.color !== undefined ? colors[level.color] + val + colors.reset : val;
        logger[level.name] = (...args) => {
            if (shouldLog(level.name, logger.enabledLogLevels)) {
                logger[level.output](colorize(tagStr + levelStr + allToString(args).replace(/\n/g, "\n.. ")));
            }
        }
    });

    const oldDie = logger.die;

    logger.die = (...args) => {
        oldDie(...args);
        process.exit(1);
    };

    logger.tag = tag => {
        let newTagList = logger.tagList !== undefined ? logger.tagList.slice() : [];
        newTagList.push(tag);

        return createLogger(logger.stdout, logger.stderr, newTagList, enabledLogLevels);
    }

    return logger;
}

const defaultStdout = value => console.log(value);
const defaultStderr = value => console.error(value);

const gypo = createLogger(defaultStdout, defaultStderr, undefined, getGloballyEnabledLogLevels());

exports["default"] = gypo;
module.exports = exports["default"];