import { createRoot } from "react-dom/client";
import { useState } from "react";
import { ConfigPanel, schemaFormRegister } from "./SchemaForm";
import type { ConfigPanelSchema } from "./SchemaForm";
import { Input } from "./input";

interface ConfigPanelValue {
  a: string;
  b: string;
  c: string;
  d: string;
}
schemaFormRegister.register("input", Input);
const Schema: ConfigPanelSchema<ConfigPanelValue>[] = [
  {
    type: "input",
    label: "名称 A",
    key: "a",
    onChange: (value, actions) => {
      if (value.a === "5") {
        actions.set("b", "666");
      }
    },
  },
  {
    type: "input",
    label: "名称 B",
    key: "b",
    beforeRender: (value) => {
      if (value.a === "10") {
        return { hide: true };
      }
      if (value.a === "11") {
        return { disabled: true };
      }
      return true;
    },
  },
  {
    type: "group",
    label: "",
    widgetOptions: {
      direction: "row",
    },
    children: [
      {
        type: "input",
        key: "c",
      },
      {
        type: "input",
        key: "d",
      },
    ],
  },
];

function App() {
  const [value, setValue] = useState<ConfigPanelValue>({
    a: "1",
    b: "2",
    c: "3",
    d: "4",
  });
  return (
    <>
      <div>
        <div>当 a 变成 5 时修改 b 为 666</div>
        <div>当 a 变成 10 时隐藏 b</div>
        <div>-------</div>
      </div>
      <div
        style={{
          width: "400px",
        }}
      >
        <ConfigPanel
          value={value}
          schema={Schema}
          onChange={setValue}
        ></ConfigPanel>
      </div>
      <div>-------</div>
      <div>{JSON.stringify(value)}</div>
    </>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
