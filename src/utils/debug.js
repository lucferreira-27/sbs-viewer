const DEBUG_ENABLED = process.env.NODE_ENV === "production";
const DEBUG_PREFIX = "🐛";

// Visual styles for console
const styles = {
  component: "color: #e74c3c; font-weight: bold",
  source: "color: #7f8c8d; font-style: italic",
  time: "color: #95a5a6",
  info: "color: #3498db",
  warn: "color: #f39c12",
  error: "color: #e74c3c",
  success: "color: #2ecc71",
};

/**
 * Get the source location of the log call
 * @returns {string} The file and line number where debug was called
 */
const getCallerInfo = () => {
  try {
    throw new Error();
  } catch (e) {
    // Get the third line of the stack trace (first is Error, second is getCallerInfo, third is caller)
    const callerLine = e.stack.split("\n")[3];
    // Extract filename and line number using regex
    const match = callerLine.match(/\((.+)\)/);
    if (match) {
      const fullPath = match[1];
      // Get just filename and line number
      const pathParts = fullPath.split("/");
      const fileInfo = pathParts[pathParts.length - 1].split(":");
      return `${fileInfo[0]}:${fileInfo[1]}`;
    }
    return "unknown source";
  }
};

/**
 * Debug utility for consistent console logging
 * @param {string} component - Component name or identifier
 * @param {Object} data - Data to be logged
 * @param {string} [type='log'] - Type of console output (log, warn, error, info)
 */
export const debug = {
  log: (component, data, type = "log") => {
    if (!DEBUG_ENABLED) return;

    const timestamp = new Date().toLocaleTimeString();
    const source = getCallerInfo();

    // Create styled prefix
    const prefix = [
      `%c${DEBUG_PREFIX} %c[${component}]%c`,
      "",
      styles.component,
      "",
    ];

    // Add source and timestamp with styling
    prefix.push(` (${source})%c ${timestamp}:`);
    prefix.push(styles.source);
    prefix.push(styles.time);

    switch (type) {
      case "warn":
        console.warn(...prefix, "\n", data);
        break;
      case "error":
        console.error(...prefix, "\n", data);
        break;
      case "info":
        console.info(...prefix, "\n", data);
        break;
      case "success":
        console.log(...prefix, "%c\n", styles.success, data);
        break;
      default:
        console.log(...prefix, "\n", data);
    }
  },

  group: (component, callback) => {
    if (!DEBUG_ENABLED) return;

    const source = getCallerInfo();
    console.groupCollapsed(
      `%c${DEBUG_PREFIX} %c[${component}]%c (${source})`,
      "",
      styles.component,
      styles.source
    );
    callback();
    console.groupEnd();
  },

  render: (component) => {
    if (!DEBUG_ENABLED) return;

    const source = getCallerInfo();
    debug.log(component, `🔄 Component rendered (${source})`, "info");
  },

  effect: (component, deps = []) => {
    if (!DEBUG_ENABLED) return;

    const source = getCallerInfo();
    debug.log(
      component,
      `⚡ Effect ran with deps: ${deps.join(", ") || "none"}`,
      "info"
    );
  },

  table: (component, data) => {
    if (!DEBUG_ENABLED) return;

    const source = getCallerInfo();
    console.groupCollapsed(
      `%c${DEBUG_PREFIX} %c[${component}]%c (${source})`,
      "",
      styles.component,
      styles.source
    );
    console.table(data);
    console.groupEnd();
  },
};
