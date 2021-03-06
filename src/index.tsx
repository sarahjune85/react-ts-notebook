import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  // code is the output from ESbuild tool - transpiled and bundled:
  const [code, setCode] = useState("");

  // esBuild service to bundle code and transpile it to JavaScript
  const startService = async () => {
    // ref.current is a reference to the ESBuild service created:
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "./esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    console.log(result);

    setCode(result.outputFiles[0].text);
    setInput("");
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}>
        {" "}
      </textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
