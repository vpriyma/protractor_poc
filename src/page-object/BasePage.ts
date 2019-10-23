import { browser } from "protractor";

export class BasePage{
    constructor(){}

    getTitle() {
        return browser.getTitle();
    }
}