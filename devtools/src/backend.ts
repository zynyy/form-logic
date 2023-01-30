import { TransformsSchemaOptions } from '@formlogic/render';
import { ExecLogicListItem, FormLogicDevtoolsScript } from '@/interface';

interface SendArgs {
  type: string;
  id?: string;
  settingData?: {
    [id: string]: {
      options: TransformsSchemaOptions;
      execLogicList: ExecLogicListItem[];
    };
  };
}

const send = ({ type, id, settingData }: SendArgs) => {
  window.postMessage(
    {
      source: FormLogicDevtoolsScript.inject,
      type,
      id,
      settingData,
    },
    '*',
  );
};

const HOOK = {
  data: {},
  store: {},
  hasDevtools: false,
  connectDevtools() {
    send({
      type: 'init',
      settingData: this.data,
    });
  },
  inject(id, form) {
    this.store[id] = form;
    this.hasDevtools = true;
    send({
      type: 'install',
      id,
    });
  },
  update(id, data) {
    this.data[id] = data;
    send({
      type: 'update',
      id,
      settingData: this.data,
    });
  },
  unmount(id) {
    delete this.store[id];
    delete this.data[id];
    send({
      type: 'update',
      id,
      settingData: this.data,
    });
  },
};

globalThis.__FORMLOGIC_DEV_TOOLS_HOOK__ = HOOK;
