import { AsyncComponent, Component, VNode, defineComponent } from 'vue';

export interface ObserverOptions {
  name?: string;
  scheduler?: (updater: () => void) => void;
}

import {
  Field,
  FieldDisplayTypes,
  FieldValidator,
  FormPatternTypes,
  GeneralField,
} from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { Schema, SchemaKey } from '@formily/json-schema';

export type VueComponent = Component | AsyncComponent;

export enum SchemaPatternEnum {
  EDITABLE = 'EDITABLE', // 编辑模式
  DETAIL = 'DETAIL', // 详情模式
  DISABLED = 'DISABLED', // 静止模式
}

export type SchemaPattern = keyof typeof SchemaPatternEnum;

export interface EventsObject {
  [key: string]: (e: MouseEvent, ...args: any) => void;
}

export type DataIndex = string | number | readonly (string | number)[];

declare type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void;

export type VueNode = VNodeChildAtom | VNodeChildAtom[] | JSX.Element;

export type MergeStrategy = 'overwrite' | 'merge';

class Helper<Props> {
  Return = defineComponent({} as { props: Record<keyof Props, any> });
}

export type DefineComponent<Props> = Helper<Props>['Return'];

export type VueComponentOptionsWithProps = {
  props: unknown;
};

export type VueComponentProps<T extends VueComponent> = T extends VueComponentOptionsWithProps
  ? T['props']
  : T;

export type SchemaVueComponents = Record<string, VueComponent>;

export type KeyOfComponents<T> = keyof T;

export type ComponentPath<
  T,
  Key extends KeyOfComponents<T> = KeyOfComponents<T>,
> = Key extends string ? Key : never;

export type ComponentPropsByPathValue<
  T extends SchemaVueComponents,
  P extends ComponentPath<T>,
> = P extends keyof T ? VueComponentProps<T[P]> : never;

export type ISchemaMarkupFieldProps<
  Components extends SchemaVueComponents = SchemaVueComponents,
  Decorator extends ComponentPath<Components> = ComponentPath<Components>,
  Component extends ComponentPath<Components> = ComponentPath<Components>,
> = ISchema<
  Decorator,
  Component,
  ComponentPropsByPathValue<Components, Decorator>,
  ComponentPropsByPathValue<Components, Component>,
  FormPatternTypes,
  FieldDisplayTypes,
  FieldValidator,
  string,
  GeneralField
>;

export interface IComponentMapper<T extends VueComponent = any> {
  (target: T): VueComponent;
}

export type IStateMapper<Props> =
  | {
      [key in keyof Field]?: keyof Props | boolean;
    }
  | ((props: Props, field: GeneralField) => Props);

export type VueFieldReaction = (field: Field) => void;

export type VueFieldComponent<
  Component extends VueComponent,
  ComponentProps = VueComponentProps<Component>,
> = [] | [Component] | [Component, ComponentProps] | any[];

export type VueFieldDecorator<
  Decorator extends VueComponent,
  ComponentProps = VueComponentProps<Decorator>,
> = [] | [Decorator] | [Decorator, ComponentProps] | any[];

export interface SchemaMapper {
  (schema: Schema, name: SchemaKey): Schema;
}

export interface SchemaFilter {
  (schema: Schema, name: SchemaKey): boolean;
}
