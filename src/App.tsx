import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./index.css";
import "./.nojekyll";
import { ShortlistIt } from "./components/shortlist-it";
import "./favicon.ico";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
    { path: '/', element: <ShortlistIt /> },
    { path: '*', element: <ShortlistIt /> }
]);

ReactDOM.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
    document.getElementById("shortlist-it")
);
