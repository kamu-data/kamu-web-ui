import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
        }).compileComponents();
    });

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as logo 'kamu-client'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.componentInstance;

        expect(app.appLogo).toEqual("/assets/icons/kamu_logo_icon.svg");
    });

    it("should render title", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector(".content span")?.textContent).toContain(
            "kamu-client app is running!",
        );
    });
});
