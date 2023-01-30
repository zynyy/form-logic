function nullThrows(x) {
  if (x != null) {
    return x;
  }
  throw new Error('Got unexpected ' + x);
}

function injectCode(src) {
  if (!globalThis.__FORMLOGIC_DEV_TOOLS_HOOK__) {
    const script = document.createElement('script');
    script.src = src;
    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullThrows(document.documentElement).appendChild(script);
    nullThrows(script.parentNode).removeChild(script);
  }
}

injectCode(chrome.runtime.getURL('/static/js/backend.js'));
