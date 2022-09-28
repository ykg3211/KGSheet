// An event handler can take an optional event argument
// and should not return a value
// An array of all currently registered event handlers for a type
// A map of event types and their corresponding event handlers.

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * modify from mitt https://www.npmjs.com/package/mitt
 * support multiple event arguments callback
 *
 * @name mitt
 * @returns {Mitt}
 */
export function mitt(_all) {
  var all = _all || new Map();
  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all: all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on: function on(type, handler) {
      var handlers = all.get(type);
      var added = handlers && handlers.push(handler);

      if (!added) {
        all.set(type, [handler]);
      }
    },

    /**
     * Remove an event handler for the given type.
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     * @memberOf mitt
     */
    off: function off(type, handler) {
      var handlers = all.get(type);

      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit: function emit(type) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (all.get(type) || []).slice().map(function (handler) {
        handler.apply(void 0, args);
      });
      (all.get('*') || []).slice().map(function (handler) {
        handler.apply(void 0, [type].concat(args));
      });
    }
  };
}