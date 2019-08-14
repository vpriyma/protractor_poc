import { element, by, browser } from "protractor";
import { SearchResultPage } from "./SearchResultPage";
import { BasePage } from "./BasePage";

export class MainGooglePage extends BasePage {

    private searchField = element(by.xpath('//input[@name="q"]'));
    private searchFrom = element(by.xpath('//form[@id="tsf"]'));

    navigateTo() {
        browser.get(browser.params.baseUrl);
    }

    search(text: string) {
        this.searchField.sendKeys('Automation');
        this.searchFrom.submit();
        return new SearchResultPage();
    }
}