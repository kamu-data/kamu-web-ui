import { AppPage } from "./app.po";
import { browser, logging } from "protractor";

describe("workspace-project App", () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    async function checkNoErrorsInLog(): Promise<void> {
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.SEVERE,
            } as logging.Entry),
        );
    }

    it("should display welcome message", async () => {
        await page.navigateTo();
        expect(await page.getTitleText()).toEqual(
            "kamu-platform app is running!",
        );
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        await checkNoErrorsInLog();
    });
});
