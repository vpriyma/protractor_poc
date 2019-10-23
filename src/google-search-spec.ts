import { browser } from "protractor";
import { MainGooglePage } from "./page-object/MainGooglePage";

describe('Google tests', function() {
    const mainPage = new MainGooglePage();
    var word = browser.params.searchWord;

    it('Do search and check that title has searched word', function() {
        mainPage.navigateTo();
        mainPage.search(word);
        expect(mainPage.getTitle()).toContain(word);
    });
});