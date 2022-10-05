import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import "./.nojekyll";
import { ShortlistItApp } from "./components/shortlist-it-app";
import "./favicon.ico";

const App = () => <ShortlistItApp />;
ReactDOM.render(<App />, document.getElementById("app"));
