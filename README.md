# Gypo

A simple but structured logging library.

```
import gypo from "gypo"
// or
const gypo = require("gypo").default

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

### log(...args: string)

Logs out all arguments to stdout

#### info(...args: string)

Logs out all arguments to stdout (with blue color)

#### error(...args: string)

Logs out all arguments to stderr (with red color)

### debug(...args: string)

Logs out all arguments to stdout

## warn(...args: string)

Logs out all arguments to stdout (with yellow color)

## success(...args: string)

Logs out all arguments to stdout (with green color)

### trace(...args: string)

Logs out all arguments to stdout

### die(...args: string)

Logs out all arguments to stderr and then calls process.exit

#### tag(tag: string): object

Returns an object that has the same methods as the exported `gypo` object, but prepends all entries with a tag

## Extras

If you'd like, you can set the `stdout` and `stderr` function on any gypo logger.They have the following function signatures:

```
stdout(value: string): void
stderr(value: string): void
```

If you use common tags, you can also be a little more concise:

```
const webLog = gypo.tag("web")
const dbLog = gypo.tag("db")

webLog.info("requested", "/cats/img/1.gif")
dbLog.error("connection failed")
```

Happy logging!
<br />
Andrew Rothman