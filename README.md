# Gypo

A simple but structured logging library.

```
import gypo from "gypo"
// or
const gypo = require("gypo")

// logs just like you're used to with console.log

gypo.log("hey there!")  
gypo.error("uh oh!")

// or optionally use tags to seperate components of your app

gypo.tag("web").log("requested", "/cats/img/1.gif")
gypo.tag("db").error("connection failed")

// filter by log level
// `info`, `error`, `debug`, `warn`, `success`, `die`, and `trace`

gypo.tag("db").trace("ping took 100ms")
gypo.tag("db").error("insert failed")
```

That's it!

## API

### gypo

log(...args: string)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logs out all arguments to stdout with no color

info(...args: string)
debug(...args: string)
warn(...args: string)
success(...args: string)
trace(...args: string)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logs out all arguments to stdout with a cooresponding color

error(...args: string)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logs out all arguments to stdout with a cooresponding color

die(...args: string)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logs out all arguments to stderr and then calls process.exit
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NOTE: this WILL exit your program

tag(tag: string): object

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a tagged "sublogger". All logs will be prepended with a path to this logger.

## Extras

If you use common tags, you can also be a little more concise:

```
const db = logger => {
    connectToDatabase();
    logger.info("connection successful");
    ...
};

const web = logger => {
    serve();
    logger.info("serving");
    ...
};


const dbLogger = gypo.tag("db");
const webLogger = gypo.tag("web");

db(dbLogger);
web(webLogger);

// [db] connection successful
// [web] serving
```

Also, if you'd like, you can set the `stdout` and `stderr` function on any gypo logger. They have the following function signatures:

```
stdout(value: string): void
stderr(value: string): void
```

Happy logging!
<br />
Andrew Rothman