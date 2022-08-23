import logo from "./logo.svg";
import "./App.css";
import * as sphinx from "sphinx-bridge-kevkevinpal";
import { Lsat } from "lsat-js";
import { useState } from "react";

function App() {
  const [satsSent, setSatsSent] = useState(0);
  const [keysendRes, setKeysendRes] = useState(null);
  return (
    <div className="App">
      <a>
        Sats sent {satsSent} <br />
        <br />
        keysendRes: {JSON.stringify(keysendRes)}
      </a>
      <button
        style={{ height: "50px" }}
        onClick={async () => {
          const res = await sphinx.enable();
          setKeysendRes(res);
        }}
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
      <button
        style={{ height: "50px" }}
        onClick={async () => {
          try {
            const [token, err] = await getLsat();
            setKeysendRes(JSON.stringify(token));
            let apiRes = await fetch(
              `https://knowledge-graph.sphinx.chat/search?word=utxo`,
              {
                // @ts-ignore
                headers: {
                  Authorization: token || "",
                },
              }
            );

            const data = await apiRes.json();

            setKeysendRes(data);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Click here to pay for lsat
      </button>
    </div>
  );
}

const getLsat = async () => {
  // @ts-ignore
  // await sphinx.enable(true);

  try {
    const resp = await fetch("https://knowledge-graph.sphinx.chat/searching");

    const header = resp.headers.get("www-authenticate");

    let data = await resp.json();
    const lsat = Lsat.fromHeader(data.headers);

    // @ts-ignore
    const LSATRes = await sphinx.saveLsat(
      lsat.invoice,
      lsat.baseMacaroon,
      "knowledge-graph.sphinx.chat"
    );

    if (LSATRes.success == false) {
      // @ts-ignore
      await sphinx.topup();
    }

    lsat.setPreimage(LSATRes.lsat.split(":")[1]);

    const token = lsat.toToken();
    return [token, null];
  } catch (e) {
    console.log(e);
    return [null, e];
  }
};

export default App;
