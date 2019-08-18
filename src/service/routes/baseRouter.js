import express from 'express';

class BaseRouter {
    constructor(controller) {
        this._router = express.Router();
        this._controller = controller;
    }

    get Router() {
        return this._router;
    }
    get Controller() {
        return this._controller;
    }
}

export default BaseRouter;