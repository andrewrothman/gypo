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

        const gypo = require("./").default;

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

tests(test => {
    test("standard logging", "hey there!", "", false, gypo => {
        gypo.log("hey there!");
    });

    test("error logging", "", "uh oh!", false, gypo => {
        gypo.error("uh oh!");
    });

    test("tagged logging", "[web] requested /cats/img/1.gif", "", false, gypo => {
        gypo.tag("web").log("requested", "/cats/img/1.gif");
    });

    test("tagged error logging", "", "[db] connection failed", false, gypo => {
        gypo.tag("db").error("connection failed");
    });

    test("tagged trace logging", "[db] ping took 100ms", "", false, gypo => {
        gypo.tag("db").trace("ping took 100ms");
    });

    test("tagged error logging", "", "[db] insert failed", false, gypo => {
        gypo.tag("db").error("insert failed");
    });

    test("tagged error logging", "", "[db] insert failed", false, gypo => {
        gypo.tag("db").error("insert failed");
    });

    test("dies", "", "oh the humanity", 1, gypo => {
        gypo.die("oh the humanity");
    });

    test("tagged dies", "", "[test] oh the humanity", 1, gypo => {
        gypo.tag("test").die("oh the humanity");
    });

    test("nested tags", "[db/connection] success!", "", false, gypo => {
        gypo.tag("db").tag("connection").log("success!");
    });
});