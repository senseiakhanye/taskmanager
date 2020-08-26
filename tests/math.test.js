const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require("../src/math");

test("Should calculate total with tip", () => {
    expect(calculateTip(10, .3)).toBe(13);

    // It throws an error, this is the case with jest
    // if (total !== 13) {
    //     throw new Error(`Total tip should be 13, got ${total}`);
    // }
});

test("Should calculate total with default tip", () => {
    expect(calculateTip(10)).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

// Asynchronous test requires done as a parameter
// test("Async test demo", (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2);
//         done();
//     }, 2000);
// });

// Another way of testing using async function
// test("Async test demo", async () => {
//     ... await
//     expect(..).toBe(..);
// } 