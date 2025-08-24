import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { Router } from "./router";

class Main {
  constructor() {
    new Router();
  }
}

(new Main());
