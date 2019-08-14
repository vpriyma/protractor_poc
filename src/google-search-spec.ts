import { MainGooglePage } from "./page-object/MainGooglePage";

describe('Google tests', function() {
    const mainPage = new MainGooglePage();

    it('Search "Automation" word', function() {
        mainPage.navigateTo();
        mainPage.search('Automation')
        expect(mainPage.getTitle()).toContain('Automation');
    });
});