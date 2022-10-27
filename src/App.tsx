import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import "./.nojekyll";
import { ShortlistIt } from "./components/shortlist-it";
import "./favicon.ico";

ReactDOM.render(
    <React.StrictMode>
        <ShortlistIt />
    </React.StrictMode>,
    document.getElementById("shortlist-it")
);
