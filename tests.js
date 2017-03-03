const tests = (setupTests) => {
    let numPassed = 0;
    let numFailed = 0;
    let tests = [];

    const done = () => console.log(`\n${numPassed} passed, ${numFailed} failed`);

    const test = (msg, expectedOut, expectedErr, code) => {
        tests.push({msg, expectedOut, expectedErr, code});
    }

    setupTests(test);

    let numPending = tests.length;

    tests.forEach(test => {
        const {msg, expectedOut, expectedErr, code} = test;

        const gypo = require("./").default;

        let stdout = "";
        let stderr = "";

        gypo.stdout = value => {stdout += value;};
        gypo.stderr = value => {stderr += value;};

        code(gypo);
        numPending--;

        if (expectedOut !== stdout) {
            console.error("x " + msg + ` (expected out: "${expectedOut}" but got out: "${stdout}")`);
            numFailed++;
        }
        if (expectedErr !== stderr) {
            console.error("x " + msg + ` (expected err: "${expectedErr}" but got err: "${stderr}")`);
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
    test("standard logging", "hey there!", "", gypo => {
        gypo.log("hey there!");
    });

    test("error logging", "", "uh oh!", gypo => {
        gypo.error("uh oh!")
    });

    test("tagged logging", "[web] requested /cats/img/1.gif", "", gypo => {
        gypo.tag("web").log("requested", "/cats/img/1.gif")
    });

    test("tagged error logging", "", "[db] connection failed", gypo => {
        gypo.tag("db").error("connection failed")
    });

    test("tagged trace logging", "[db] ping took 100ms", "", gypo => {
        gypo.tag("db").trace("ping took 100ms")
    });

    test("tagged error logging", "", "[db] insert failed", gypo => {
        gypo.tag("db").error("insert failed")
    });
});