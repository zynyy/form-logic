import { FormLogicDevtoolsScript } from '@/interface';

window.addEventListener(
  'message',
  (event) => {
    const { source, ...payload } = event.data;

    // 接收 inject 发送过来的消息
    if (source === FormLogicDevtoolsScript.inject) {
      // 转发到 background
      chrome.runtime.sendMessage({
        source,
        ...payload,
      });
    }
  },
  false,
);

// 接收 background 发送过来的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source === FormLogicDevtoolsScript.background) {
    // 转发到网页上
    window.postMessage(message, '*');
  }
});
