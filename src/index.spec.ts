import Gypo, { GypoEvent, GypoEventPriority } from "./";

test("it reports an event", () => {
	const logMock = jest.fn();
	Gypo.logFunction = logMock;
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {},
	};
	
	Gypo.report(event);
	
	expect(logMock).toBeCalledWith(event);
});

test("it reports 10,000 events", () => {
	for (let i = 0; i < 10000; i++) {
		const event: GypoEvent = {
			type: "my-event-type",
			priority: GypoEventPriority.Info,
			data: {},
		};
		
		Gypo.report(event);
	}
});

test("it reports an event with data", () => {
	const logMock = jest.fn();
	Gypo.logFunction = logMock;
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {
			num: 123,
		},
	};
	
	Gypo.report(event);
	
	expect(logMock).toBeCalledWith(event);
});

test("it runs a simple middleware", () => {
	const middlewareMock = jest.fn();
	
	Gypo.onEvent(GypoEventPriority.Info, () => {
		middlewareMock();
	});
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {},
	};
	
	Gypo.report(event);
	
	expect(middlewareMock).toBeCalledTimes(1);
});

test("it runs a simple middleware which cancels logging", () => {
	const logMock = jest.fn();
	Gypo.logFunction = logMock;
	
	const middlewareMock = jest.fn();
	
	Gypo.onEvent(GypoEventPriority.Info, () => {
		middlewareMock();
	});
	
	Gypo.onEventFinishedReporting(() => {
		expect(middlewareMock).toBeCalledTimes(1);
		expect(logMock).toBeCalledTimes(0);
	});
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {},
	};
	
	Gypo.report(event);
});

test("it runs through the middleware chain", () => {
	const logMock = jest.fn();
	Gypo.logFunction = logMock;
	
	const middlewareMock = jest.fn();
	
	Gypo.onEvent(GypoEventPriority.Info, (_, next) => {
		next();
	});
	
	Gypo.onEvent(GypoEventPriority.Info, (_, next) => {
		middlewareMock();
		next();
	});
	
	Gypo.onEventFinishedReporting(() => {
		expect(middlewareMock).toBeCalledTimes(1);
		expect(logMock).toBeCalledTimes(1);
	});
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {},
	};
	
	Gypo.report(event);
});

test("it runs through the middleware chain and cancels logging", () => {
	const logMock = jest.fn();
	Gypo.logFunction = logMock;
	
	const middlewareMock = jest.fn();
	
	Gypo.onEvent(GypoEventPriority.Info, (_, next) => {
		next();
	});
	
	Gypo.onEvent(GypoEventPriority.Info, () => {
		middlewareMock();
	});
	
	Gypo.onEventFinishedReporting(() => {
		expect(middlewareMock).toBeCalledTimes(1);
		expect(logMock).toBeCalledTimes(0);
	});
	
	const event: GypoEvent = {
		type: "my-event-type",
		priority: GypoEventPriority.Info,
		data: {},
	};
	
	Gypo.report(event);
});
