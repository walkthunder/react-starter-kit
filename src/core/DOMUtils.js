export function addEventListener(node, event, listener) {
  if (node.addEventListener) {
    node.addEventListener(event, listener, false);
  } else {
    node.attachEvent(`on${event}`, listener);
  }
}

export function removeEventListener(node, event, listener) {
  if (node.removeEventListener) {
    node.removeEventListener(event, listener, false);
  } else {
    node.detachEvent(`on${event}`, listener);
  }
}

export function triggerEvent(node, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
    } else if (document.createEventObject) { // IE < 9
        event = document.createEventObject();
        event.eventType = eventName;
    }
    event.eventName = eventName;
    if (node.dispatchEvent) {
        node.dispatchEvent(event);
    } else if (node.fireEvent && htmlEvents['on' + eventName]) { // IE < 9
        node.fireEvent('on' + event.eventType, event); // can trigger only real event (e.g. 'click')
    } else if (node[eventName]) {
        node[eventName]();
    } else if (node['on' + eventName]) {
        node['on' + eventName]();
    }
}