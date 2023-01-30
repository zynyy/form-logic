let created = false;

const createPanel = () => {
  if (created) {
    return;
  }

  chrome.devtools.inspectedWindow.eval(
    'window.__FORMLOGIC_DEV_TOOLS_HOOK__ && window.__FORMLOGIC_DEV_TOOLS_HOOK__.hasDevtools',
    (hasDevtools: boolean) => {
      if (!hasDevtools) return;
      created = true;
      clearInterval(loadCheckInterval);
      chrome.devtools.panels.create(
        'Formlogic',
        null,
        './devpanel.html',
        function () {},
      );
    },
  );
};

const loadCheckInterval = setInterval(function () {
  createPanel();
}, 1000);

createPanel();
