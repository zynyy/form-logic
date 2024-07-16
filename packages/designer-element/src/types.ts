import { Engine, IBehavior, IResource } from '@formlogic/designer-core';

export interface IDesignerLayoutProps {
  prefixCls?: string;
  theme?: 'dark' | 'light' | (string & {});
}

export interface DesignerProps extends IDesignerLayoutProps {
  engine: Engine;
}

export type DnFC<P = {}> = Vue.Component<any, any, any, P> & {
  Resource?: IResource[];
  Behavior?: IBehavior[];
};
export interface IDesignerComponents {
  [key: string]: DnFC<any>;
}

export interface IDesignerLayoutContext {
  theme?: 'dark' | 'light' | (string & {});
  prefixCls: string;
}

export interface IWorkspaceContext {
  id: string;
  title?: string;
  description?: string;
}



export type DnComponent<P = {}> = Vue.Component<any, any, any, P> & {
  Resource?: IResource[];
  Behavior?: IBehavior[];
};
