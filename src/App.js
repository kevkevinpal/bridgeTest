import logo from "./logo.svg";
import "./App.css";
import * as sphinx from "sphinx-bridge";
import { useState } from "react";

function App() {
  const [satsSent, setSatsSent] = useState(0);
  const [keysendRes, setKeysendRes] = useState(null);
  return (
    <div className="App">
        <a
        >
								Sats sent {satsSent} <br/><br/>
          keysendRes: {JSON.stringify(keysendRes)}
        </a>
        <button
          style={{ height: "50px" }}
          onClick={async () => await sphinx.enable()}
        >
          Click here to authorize
        </button>
        <button
          style={{ height: "50px" }}
          onClick={async () => {
            const res = await sphinx.keysend(
              "023d8eb306f0027b902fbdc81d33b49b6558b3434d374626f8c324979c92d47c21",
              5
            );
            setKeysendRes(res);
            if (res != null && res.success == true) {
              setSatsSent(satsSent + 5);
            }
          }}
        >
          Click here to send 5 sats to
          023d8eb306f0027b902fbdc81d33b49b6558b3434d374626f8c324979c92d47c21
        </button>
    </div>
  );
}

export default App;
