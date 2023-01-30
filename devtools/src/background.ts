/*global chrome*/
import Port = chrome.runtime.Port;
import { FormLogicDevtoolsScript } from '@/interface';

chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension successfully installed!');
});

const getCurrentTab = async () => {
  const tabs = await chrome.tabs.query({ active: true });
  return tabs[0];
};

const source = FormLogicDevtoolsScript.background;

// const execScript = () => {
//   getCurrentTab().then((tab) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['inject.js'],
//     });
//   });
// };

let popupConnections = {};
let panelConnections = {};

const sendConnect = (tabId: number, name: string) => {
  chrome.tabs
    .sendMessage(tabId, {
      source,
      type: 'connect',
      msg: '链接成功',
      name,
    })
    .then(() => void 0);
};

const sendDisConnect = (tabId: number, name: string) => {
  chrome.tabs
    .sendMessage(tabId, {
      source,
      type: 'disconnect',
      msg: '断开链接',
      name,
    })
    .then(() => void 0);
};

const popupConnect = async (port: Port) => {
  const tab = await getCurrentTab();
  if (tab) {
    const tabId = tab.id;
    popupConnections[tabId] = port;
  }
  port.onDisconnect.addListener(function () {
    if (tab) {
      popupDisConnect(port);
    }
  });
};

const popupDisConnect = (port: Port) => {
  if (port.name === FormLogicDevtoolsScript.popup) {
    const tabs = Object.keys(popupConnections);

    const len = tabs.length;

    for (let i = 0; i < len; i++) {
      if (popupConnections[tabs[i]] === port) {
        delete popupConnections[tabs[i]];
        break;
      }
    }
  }
};

const panelConnect = async (port: Port) => {
  const tab = await getCurrentTab();
  if (tab) {
    const tabId = tab.id;
    panelConnections[tabId] = port;
  }
  port.onDisconnect.addListener(function () {
    if (tab) {
      panelDisConnect(port);
    }
  });
};

const panelDisConnect = (port: Port) => {
  if (port.name === FormLogicDevtoolsScript.panel) {
    const tabs = Object.keys(panelConnections);

    const len = tabs.length;

    for (let i = 0; i < len; i++) {
      if (panelConnections[tabs[i]] === port) {
        delete panelConnections[tabs[i]];
        break;
      }
    }
  }
};

chrome.runtime.onConnect.addListener(async (externalPort) => {
  const tab = await getCurrentTab();

  console.log(
    {
      tab,
      externalPort,
      name: externalPort.name,
    },
    777,
  );

  if (tab) {
    const tabId = tab.id;

    sendConnect(tabId, externalPort.name);

    externalPort.onDisconnect.addListener(function (port) {
      if (tab) {
        sendDisConnect(tabId, port.name);
      }
    });

    switch (externalPort.name) {
      case FormLogicDevtoolsScript.popup: {
        await popupConnect(externalPort);

        break;
      }

      case FormLogicDevtoolsScript.panel: {
        await panelConnect(externalPort);

        externalPort.onDisconnect.addListener(function (port) {
          if (tab) {
            panelDisConnect(port);
          }
        });

        break;
      }

      default: {
        break;
      }
    }

    const extensionListener = function (message) {
      // 原始的连接事件不包含开发者工具网页的标签页标识符，
      // 所以我们需要显式发送它。

      switch (message.name) {
        case 'reload': {
          chrome.tabs.sendMessage(tabId, {
            source,
            type: 'reload',
            msg: '刷新页面',
            name: externalPort.name,
          });
          break;
        }
        default: {
          break;
        }
      }
      // 其他消息的处理
    };

    // 监听开发者工具网页发来的消息 popup panel
    externalPort.onMessage.addListener(extensionListener);
  }
});

// 从内容脚本接收消息，并转发至当前
// 标签页对应的开发者工具网页
chrome.runtime.onMessage.addListener(function (request, sender) {
  // 来自内容脚本的消息应该已经设置 sender.tab

  if (sender.tab) {
    let tabId = sender.tab.id;

    if (tabId in popupConnections) {
      popupConnections[tabId].postMessage(request);
    }
    if (tabId in panelConnections) {
      panelConnections[tabId].postMessage(request);
    }
  } else {
    console.log('sender.tab 未定义。');
  }
});
