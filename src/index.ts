import chalk from "chalk";
const fastJson = require("fast-json-stringify");

const DEFAULT_FORMAT_STRING: string = "gypo:v1";

export enum GypoEventPriority {
	Info = "info",
	Warn = "warn",
	Error = "error",
}

type EventPrioritySelector = GypoEventPriority | "all";

export interface GypoEvent {
	format?: string;
	type: string;
	priority: GypoEventPriority;
	time?: number;
	data: any;
}

const gypoEventSchema = {
	type: "object",
	additionalProperties: true,
	required: [
		"type",
		"priority",
	],
	properties: {
		type: {
			type: "string",
		},
		priority: {
			"type": "string",
			"enum": [
				"error",
				"warn",
				"info",
			],
		},
		data: {
			type: "object",
			additionalProperties: true,
		},
	},
};

const stringify = fastJson(gypoEventSchema);

type LogFunction = (event: GypoEvent) => void;
type EventMiddleware = (event: GypoEvent, next: () => void) => void;
type EventHook = (event: GypoEvent) => void;

/**
 * Structured events reporter.
 */
class Gypo {
	private static hooks: { [K in GypoEventPriority]?: EventMiddleware[] } = {};
	public static logFunction: LogFunction = Gypo.defaultLogFunction;
	private static eventFinishedeportingHooks: EventHook[] = [];
	
	/**
	 * Adds a hook to run after an event has completely run through the middleware chain and finished logged.
	 * @param hook The hook to run.
	 */
	static onEventFinishedReporting(hook: EventHook) {
		this.eventFinishedeportingHooks.push(hook);
	}
	
	/**
	 * Adds a new middleware to the middleware chain for events of a certain priority.
	 * @param priority The priority to attach the middleware to.
	 * @param middleware The middleware to use.
	 */
	static onEvent(priority: EventPrioritySelector, middleware: EventMiddleware) {
		if (priority === "all") {
			// add the middleware to all priority arrays
			for (const p of [GypoEventPriority.Info, GypoEventPriority.Warn, GypoEventPriority.Error]) {
				Gypo.onEvent(p as EventPrioritySelector, middleware);
			}
			
			return;
		}
		
		// add the middleware to the specified priority array
			
		if (this.hooks[priority] === undefined) {
			this.hooks[priority] = [middleware];
		}
		else {
			this.hooks[priority]!.push(middleware);
		}
	}
	
	private static runMiddleware(event: GypoEvent, middlewares: EventMiddleware[], index: number) {
		// note: the below code is similar to the `koa-compose` middleware
		// chain... with some differences for this specific use-case
		// ref: https://github.com/koajs/compose/blob/master/index.js
		
		if (index > middlewares.length) {
			throw new Error("gypo: next() called, but no more middleware remaining");
		}
		
		// construct the `next` function using the next middleware
		const next = this.runMiddleware.bind(null, event, middlewares, index + 1);
		middlewares[index](event, next);
		
		// call onEventFinishedReporting hooks
		if (index === middlewares.length) {
			for (const hook of this.eventFinishedeportingHooks) {
				hook(event);
			}
		}
	}
	
	/**
	 * Runs through an array of middlewares, passing in an Event.
	 * @param middlewares The middlewares to run.
	 * @param event The event that occurred.
	 */
	private static runMiddlewares(middlewares: EventMiddleware[], event: GypoEvent): void {
		// run the first middleware
		this.runMiddleware(event, middlewares, 0);
	}
	
	private static defaultLogFunction(event: GypoEvent) {
		// cleanup event
		
		event.format = event.format || DEFAULT_FORMAT_STRING;
		
		if (Object.keys(event.data).length === 0) {
			delete event.data;
		}
		
		// determine formatting
		
		const isPretty: boolean = process.env.NODE_ENV === undefined || process.env.NODE_ENV === "development";
		const unformattedLogStr: string = (isPretty ? JSON.stringify(event, null, 2) : stringify(event)) + "\n";
		
		let logFunc;
		let logStr;
		
		// set the correct logging function and formatted log string
		
		if (event.priority === GypoEventPriority.Info) {
			logStr = unformattedLogStr;
			
			if (typeof process !== "undefined") {
				logFunc = process.stdout.write.bind(process.stdout);
			}
			else {
				// tslint:disable-next-line:no-console
				logFunc = console.log;
			}
		}
		else if (event.priority === GypoEventPriority.Warn) {
			logStr = isPretty ? chalk.yellow(unformattedLogStr) : unformattedLogStr;
			
			if (typeof process !== "undefined") {
				logFunc = process.stdout.write.bind(process.stdout);
			}
			else {
				// tslint:disable-next-line:no-console
				logFunc = console.warn;
			}
		}
		else if (event.priority === GypoEventPriority.Error) {
			logStr = isPretty ? chalk.red(unformattedLogStr) : unformattedLogStr;
			
			if (typeof process !== "undefined") {
				logFunc = process.stderr.write.bind(process.stderr);
			}
			else {
				// tslint:disable-next-line:no-console
				logFunc = console.error;
			}
		}
		else {
			throw new Error("gypo: unrecognized event priority");
		}
		
		// run the log function with the log string
		
		if (logFunc !== undefined && logStr !== undefined) {
			logFunc(logStr);
		}
	}
	
	/**
	 * Report the occurrence of an event.
	 * @param event The event that took place.
	 */
	static report(event: GypoEvent) {
		const reportedAt: Date = new Date();
		event.time = Math.floor(reportedAt.getTime());
		
		const execLogFunction = (e: GypoEvent) => {
			this.logFunction(e);
		}
		
		const hooks = [ ...(this.hooks[event.priority] || []), execLogFunction ];
		this.runMiddlewares(hooks, event);
	}
}

export default Gypo;
