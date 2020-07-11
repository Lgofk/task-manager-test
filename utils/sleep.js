// Implementing sleep function that will block event loop.
const mssleep = (milliseconds) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}
const sleep = (n) => {
  mssleep(n * 1000);
}

module.exports = sleep;