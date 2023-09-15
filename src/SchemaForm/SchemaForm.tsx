import { clone, get, isBoolean, set } from "lodash";
import { schemaFormRegister } from "./register";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type FromItemValue = any;
export interface FromValue {
  [name: string]: FromItemValue;
}

export interface SchemaType<T> {
  type: string;
  key: string;
  label?: string;
  defaultValue?: FromItemValue;
  children?: SchemaType<T>[];
  beforeRender?: (
    value: T
  ) => { hide?: boolean; disabled?: boolean } | void | boolean;
  onChange?: (
    value: T,
    actions: {
      set: (path: string, value: FromItemValue) => void;
    }
  ) => void;
}

export interface SchemaFormProps<T extends FromValue> {
  value?: T;
  onChange?: (value: T) => void;
  changeTrigger?: "onChange" | "onBlur";
  schema: SchemaType<T>[];
}

export function SchemaForm<T extends FromValue>(props: SchemaFormProps<T>) {
  const { schema, value, onChange } = props;
  return (
    <div>
      {schema.map((item) => (
        <RenderPanelContainer
          key={item.key}
          schema={item}
          value={value}
          onChange={onChange}
          onChangeImmediate={onChange}
        />
      ))}
    </div>
  );
}

function RenderPanelContainer<T>(props: {
  value?: T;
  onChange?: (value: T) => void;
  onChangeImmediate?: (value: T) => void;
  schema: SchemaType<T>;
}) {
  const { value, schema, onChange, onChangeImmediate } = props;

  const renderProps =
    schema.beforeRender && value ? schema.beforeRender(value) : true;
  const { hide = false } = isBoolean(renderProps)
    ? { hide: !renderProps }
    : renderProps ?? {};

  return !hide ? (
    <RenderPanelItem
      {...schema}
      value={get(value, schema.key)}
      onChange={(v) => {
        if (value) {
          const newValue = set(clone(value), schema.key, v);
          onChange?.(newValue);
          const actions = {
            set: (path: string, v: FromItemValue) => {
              if (value) {
                const result = set(clone(newValue), path, v);
                onChangeImmediate?.(result);
              }
            },
          };
          schema.onChange?.(newValue, actions);
        }
      }}
    />
  ) : null;
}

function RenderPanelItem<T>(
  props: SchemaType<T> & {
    value: FromItemValue;
    onChange: (value: FromItemValue) => void;
  }
) {
  const { type } = props;
  const Comp = schemaFormRegister.get(type);
  if (Comp) {
    return (
      <div>
        <label>{props.label}</label>
        <Comp value={props.value} onChange={props.onChange}></Comp>
      </div>
    );
  }
  return null;
}
