//@ts-check

let current

export function subscribeSignals(context) {
  current = context.render? context.render.bind(context) : context()
  current();
  current = undefined;
}

export function createSignal(initialValue) {
  let _value = initialValue;
  let subscribers = [];

  function notify() {
    subscribers.forEach(subscriber => subscriber(_value))
  }

  return {
    get value() {
      if (current && !subscribers.includes(current)) {
        subscribers.push(current)
      } 
      return _value;
    },
    set value(v) {
      _value = v;
      notify();
    },
    subscribe: (subscriber) => {
      subscribers.push(subscriber);
    }
  };
}
