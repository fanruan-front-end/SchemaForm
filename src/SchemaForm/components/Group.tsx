import { FormComponentProps, RenderPanelContainer } from "../SchemaForm";

export function Group(props: FormComponentProps<string>) {
  const { allValue, onAllChange, schema, style } = props;
  const { widgetOptions } = schema;
  const children = schema.children ?? [];
  let widgetStyle = style;
  if (
    widgetOptions &&
    "direction" in widgetOptions &&
    widgetOptions.direction === "row"
  ) {
    widgetStyle = {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    };
  }

  return (
    <div data-test-id="schema-item-group" style={widgetStyle}>
      {children.map((item, index) => {
        return (
          <RenderPanelContainer
            key={item.key}
            schema={item}
            value={allValue}
            position={{ index, total: children.length }}
            onChange={onAllChange}
            onChangeImmediate={onAllChange}
            style={{
              marginBottom: "0px",
            }}
          />
        );
      })}
    </div>
  );
}
