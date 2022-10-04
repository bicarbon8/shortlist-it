import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import { ShortlistItApp } from "./components/shortlist-it-app";

const App = () => <ShortlistItApp />;
ReactDOM.render(<App />, document.getElementById("app"));
