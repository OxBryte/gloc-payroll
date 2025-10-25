// Comprehensive Node.js polyfills for browser environment
// This file should be imported before any other modules that use Node.js APIs

// Buffer polyfill - simplified approach
if (typeof globalThis.Buffer === "undefined") {
  // Simple fallback Buffer implementation
  globalThis.Buffer = {
    from: (data) => {
      if (typeof data === "string") {
        return new TextEncoder().encode(data);
      }
      return new Uint8Array(data);
    },
    isBuffer: (obj) => obj instanceof Uint8Array,
    alloc: (size) => new Uint8Array(size),
    allocUnsafe: (size) => new Uint8Array(size),
    concat: (list) => {
      const totalLength = list.reduce((acc, buf) => acc + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of list) {
        result.set(buf, offset);
        offset += buf.length;
      }
      return result;
    },
  };
}

// Process polyfill
if (typeof globalThis.process === "undefined") {
  globalThis.process = {
    env: {},
    version: "v18.0.0",
    versions: {
      node: "18.0.0",
      v8: "10.0.0",
      uv: "1.0.0",
      zlib: "1.0.0",
      brotli: "1.0.0",
      ares: "1.0.0",
      modules: "108",
      nghttp2: "1.0.0",
      napi: "9",
      llhttp: "6.0.0",
      openssl: "3.0.0",
      cldr: "41.0",
      icu: "71.0",
      tz: "2022a",
      unicode: "14.0",
      ngtcp2: "0.8.0",
      nghttp3: "0.7.0",
    },
    platform: "browser",
    arch: "x64",
    pid: 1,
    ppid: 0,
    title: "browser",
    argv: [],
    execArgv: [],
    execPath: "/browser",
    cwd: () => "/",
    chdir: (dir) => {
      console.warn("process.chdir() is not supported in browser");
    },
    umask: () => 0,
    hrtime: () => [0, 0],
    uptime: () => 0,
    memoryUsage: () => ({
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    }),
    cpuUsage: () => ({ user: 0, system: 0 }),
    nextTick: (fn) => setTimeout(fn, 0),
    exit: (code) => {
      console.warn("process.exit() is not supported in browser");
    },
    kill: (pid, signal) => {
      console.warn("process.kill() is not supported in browser");
    },
    abort: () => {
      console.warn("process.abort() is not supported in browser");
    },
    // EventEmitter methods
    on: () => {},
    off: () => {},
    emit: () => {},
    addListener: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    setMaxListeners: () => {},
    getMaxListeners: () => 10,
    listeners: () => [],
    rawListeners: () => [],
    listenerCount: () => 0,
    eventNames: () => [],
    prependListener: () => {},
    prependOnceListener: () => {},
    once: () => {},
  };
}

// Global polyfill
if (typeof globalThis.global === "undefined") {
  globalThis.global = globalThis;
}

// Console polyfill (ensure it exists)
if (typeof globalThis.console === "undefined") {
  globalThis.console = {
    log: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    info: (...args) => console.info(...args),
    debug: (...args) => console.debug(...args),
    trace: (...args) => console.trace(...args),
    dir: (...args) => console.dir(...args),
    time: (...args) => console.time(...args),
    timeEnd: (...args) => console.timeEnd(...args),
    group: (...args) => console.group(...args),
    groupEnd: (...args) => console.groupEnd(...args),
    groupCollapsed: (...args) => console.groupCollapsed(...args),
    clear: () => console.clear(),
    count: (...args) => console.count(...args),
    countReset: (...args) => console.countReset(...args),
    table: (...args) => console.table(...args),
    assert: (...args) => console.assert(...args),
  };
}

console.log("Node.js polyfills loaded successfully");
