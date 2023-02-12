import { Component, defineComponent } from 'vue';

import {
  GeneralField,
  FormPatternTypes,
  FieldDisplayTypes,
  FieldValidator,
  Field,
} from '@formily/core';

import type { ISchema } from '@formily/json-schema';
import { Schema, SchemaKey } from '@formily/json-schema';

class Helper<Props> {
  Return = defineComponent({} as { props: Record<keyof Props, any> });
}

export type DefineComponent<Props> = Helper<Props>['Return'];

export type VueComponentOptionsWithProps = {
  props: unknown;
};

export type VueComponent = Component;
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

export type FieldReaction = (field: Field) => void;

export type FieldComponent<
  Component extends VueComponent,
  ComponentProps = VueComponentProps<Component>,
> = [] | [Component] | [Component, ComponentProps] | any[];

export type FieldDecorator<
  Decorator extends VueComponent,
  ComponentProps = VueComponentProps<Decorator>,
> = [] | [Decorator] | [Decorator, ComponentProps] | any[];

export interface SchemaMapper {
  (schema: Schema, name: SchemaKey): Schema;
}

export interface SchemaFilter {
  (schema: Schema, name: SchemaKey): boolean;
}
