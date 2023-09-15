import { createRoot } from "react-dom/client";
import { useState } from "react";
import { ConfigPanel, schemaFormRegister } from "./SchemaForm";
import type { ConfigPanelSchema } from "./SchemaForm";
import { Input } from "./input";

interface ConfigPanelValue {
  a: string;
  b: string;
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
];

function App() {
  const [value, setValue] = useState<ConfigPanelValue>({ a: "1", b: "2" });
  return (
    <>
      <div>
        <div>当 a 变成 5 时修改 b 为 666</div>
        <div>当 a 变成 10 时隐藏 b</div>
        <div>-------</div>
      </div>
      <ConfigPanel
        value={value}
        schema={Schema}
        onChange={setValue}
      ></ConfigPanel>
    </>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
