const wrapAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = wrapAsync;
// utils/wrapAsync.js
// This utility function wraps async route handlers to catch errors and pass them to the next middleware.
// It ensures that any errors thrown in async functions are handled properly, preventing unhandled promise rejections.
// Usage: In your route files, you can use this function to wrap your async route handlers like so:
