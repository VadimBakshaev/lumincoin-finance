import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
//import { Collapse } from 'bootstrap';
import { Router } from "./router";

class App {
  constructor() {
    new Router();
    // console.log('Bootstrap loaded:', bootstrap);
    console.log('Collapse available:', bootstrap.Collapse);
  }
}

(new App());
