const tests = (setupTests) => {
    let numPassed = 0;
    let numFailed = 0;
    let tests = [];

    const done = () => {
        console.log(`\n${numPassed} passed, ${numFailed} failed`);
        process.exit(numFailed === 0 ? 0 : 1);
    }

    const test = (msg, expectedOut, expectedErr, expExitCode, code) => {
        tests.push({msg, expectedOut, expectedErr, expExitCode, code});
    }

    setupTests(test);

    let numPending = tests.length;

    tests.forEach(test => {
        const {msg, expectedOut, expectedErr, expExitCode, code} = test;

        const gypo = require("./");

        let stdout = "";
        let stderr = "";
        let exitCode = false;

        gypo.stdout = value => {stdout += value;};
        gypo.stderr = value => {stderr += value;};

        const oldProcessExit = process.exit;
        process.exit = code => {exitCode = code;}
        
        code(gypo);
        numPending--;

        process.exit = oldProcessExit;

        if (expectedOut !== stdout) {
            console.error("x " + msg + ` (expected out: "${expectedOut}" but got out: "${stdout}")`);
            numFailed++;
        }
        if (expectedErr !== stderr) {
            console.error("x " + msg + ` (expected err: "${expectedErr}" but got err: "${stderr}")`);
            numFailed++;
        }
        if (expExitCode != exitCode /* casted */) {
            console.error("x " + msg + ` (expected exit code: "${expExitCode}" but got exit code: "${exitCode}")`);
            numFailed++;
        }
        else {
            console.log("- " + msg);
            numPassed++;
        }

        if (numPending === 0) {
            done();
        }
    });
};

// ANSI color codes
const colors = {
    blue: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
};

tests(test => {
    test("standard logging", "hey there!", "", false, gypo => {
        gypo.log("hey there!");
    });

    test("error logging", "", colors.red + "(error) uh oh!" + colors.reset, false, gypo => {
        gypo.error("uh oh!");
    });

    test("tagged logging", "[web] requested /cats/img/1.gif", "", false, gypo => {
        gypo.tag("web").log("requested", "/cats/img/1.gif");
    });

    test("tagged error logging", "", colors.red + "[db] (error) connection failed" + colors.reset, false, gypo => {
        gypo.tag("db").error("connection failed");
    });

    test("tagged trace logging", "[db] (trace) ping took 100ms", "", false, gypo => {
        gypo.tag("db").trace("ping took 100ms");
    });

    test("tagged error logging", "", colors.red + "[db] (error) insert failed" + colors.reset, false, gypo => {
        gypo.tag("db").error("insert failed");
    });

    test("dies", "", colors.red + "(die) oh the humanity" + colors.reset, 1, gypo => {
        gypo.die("oh the humanity");
    });

    test("tagged dies", "", colors.red + "[test] (die) oh the humanity" + colors.reset, 1, gypo => {
        gypo.tag("test").die("oh the humanity");
    });

    test("nested tags", colors.green + "[db/connection] (success) yay!" + colors.reset, "", false, gypo => {
        gypo.tag("db").tag("connection").success("yay!");
    });
    
    test("mulitple lines",  "this\n.. is\n.. multiple\n.. lines", "", false, gypo => {
        gypo.log("this\nis\nmultiple\nlines");
    });
    
    test("only shows enabled log levels", colors.yellow + "(warn) this should show up" + colors.reset, "", false, gypo => {
        gypo.enabledLogLevels = ["warn"];
        gypo.debug("this should not show up");
        gypo.warn("this should show up");
    });
});