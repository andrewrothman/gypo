# Gypo

A simple structured events reporting library.

## What Are Structured Events?

Logs are great. They help developers figure out what's going on with their code. But as the world develops software with ever-growing complexity, its become clear that plain-text log files don't quite cut it when analyzing and understanding the internal state of software applications.

## What is Gypo?

Gypo is a structured events reporting format/library. Its format is extremely simple and standards compliant, thus fits very well in cross-platform deployments. It's initial implementation is in TypeScript, so it supports a rapidly-growing ecosystem of server-side Node.JS, web-based applications, edge-computing, and IOT environments.

### Simple, Standards-Based Cross-Platform Format

* Qualified and versioned, with heavily-documented format.
* Plain [JSONL](http://jsonlines.org/) format supported in a wide-variety of programming environments.
* Time represented in millisecond Unix epoch.

### Encourages Best Practices

* Event data field is required, encouraging the developer to include relevant info.
* Support for stdout/stderr.
* UTF-8 file encoding (supports emojis and other unicode characters).
* Production output optimization via `NODE_ENV` environment variable.
* Standard color control environment variable [adherence](https://github.com/chalk/supports-color).

### Small Log Output Size

* Format specifies only bare-essential fields.
* Millisecond Unix epoch time takes up a small amount of space for highly-accurate time-points.
* Whitespace-free JSON string output in production.

### Fast Runtime Performance

* Observed throughput of ~62,000 events per second to stdout on a 2014 Intel i5 8GB MacBook Pro.
* Non-blocking middleware support.
* Millisecond Unix epoch number serialization and sorting are very performant.
* Fast json stringifier.
* Fast console output.

### Configurable

* Middleware.

### Great Developer Experience

* Easy development of tooling/middleware.

## What Tooling Is Available?

* jq - Command-line JSON processor ([Homepage](https://stedolan.github.io/jq/)) ([GitHub](https://github.com/stedolan/jq))

## Is This Safe To Use In Production?

It should be. Its currently-used in a few production-critical applications, but its still a relatively young project.
