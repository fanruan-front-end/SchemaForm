import { clone, get, isBoolean, isUndefined, set } from "lodash";
import { SchemaFormRegister, schemaFormRegister } from "./register";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type FromItemValue = any;
export interface FromValue {
  [name: string]: FromItemValue;
}

export interface FormConfig {
  labelWidth?: "95px" | "108px";
}

export interface SchemaType<T> {
  type: string;
  key?: string;
  label?: string;
  defaultValue?: FromItemValue;
  children?: SchemaType<T>[];
  widgetOptions?: Record<string, unknown>;
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
  value: T;
  onChange?: (value: T) => void;
  changeTrigger?: "onChange" | "onBlur";
  formConfig?: FormConfig;
  schema: SchemaType<T>[];
  components?: SchemaFormRegister;
  error?: {
    [name: string]: string;
  };
}

export function SchemaForm<T extends FromValue>(props: SchemaFormProps<T>) {
  const { schema, value, onChange, formConfig, components } = props;
  return (
    <div>
      {schema.map((item, index) => (
        <RenderPanelContainer
          key={item.key}
          schema={item}
          value={value}
          formConfig={formConfig}
          position={{ index, total: schema.length }}
          components={components}
          error={props.error?.[item.key ?? ""]}
          onChange={(v) => {
            onChange?.(v);
          }}
          onChangeImmediate={onChange}
        />
      ))}
    </div>
  );
}

export interface RenderPanelContainerProps<T> {
  value: T;
  onChange: (value: T) => void;
  onChangeImmediate?: (value: T) => void;
  schema: SchemaType<T>;
  formConfig?: FormConfig;
  position: { index: number; total: number };
  components?: SchemaFormRegister;
  style?: React.CSSProperties;
  error?: string;
}

export function RenderPanelContainer<T>(props: RenderPanelContainerProps<T>) {
  const { value, schema, onChange, onChangeImmediate, formConfig, components } =
    props;
  const { key } = schema;

  const renderProps =
    schema.beforeRender && value ? schema.beforeRender(value) : true;
  const { hide = false } = isBoolean(renderProps)
    ? { hide: !renderProps }
    : renderProps ?? {};

  return !hide ? (
    <RenderPanelItem
      value={key ? get(value, key) : void 0}
      allValue={value}
      position={props.position}
      schema={schema}
      formConfig={formConfig}
      components={components}
      style={props.style}
      onChange={(v) => {
        if (value && key) {
          const newValue = set(clone(value), key, v);
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
      onAllChange={(v) => {
        onChange?.(v);
      }}
    />
  ) : null;
}

export function RenderPanelItem<T>(props: FormComponentProps<T>) {
  const { schema, position, formConfig, components, style } = props;
  const showLabel = !isUndefined(schema.label);
  const { labelWidth = "95px" } = formConfig ?? {};
  const isLast = position.index === position.total - 1;
  const { type, label } = schema;
  const Comp = components?.get(type) ?? schemaFormRegister.get(type);

  if (Comp) {
    return (
      <div
        data-test-id="schema-item"
        style={{
          marginBottom: isLast ? "0px" : "12px",
          display: "flex",
          alignItems: "center",
          ...style,
        }}
      >
        {showLabel ? (
          <label style={{ width: labelWidth, flexShrink: 0 }}>{label}</label>
        ) : null}
        <Comp {...props}></Comp>
      </div>
    );
  }
  return null;
}

export interface FormComponentProps<T> extends RenderPanelContainerProps<T> {
  allValue: any;
  onAllChange: (value: any) => void;
}
