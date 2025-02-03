import { MatDrawerToggleResult, MatSidenav } from "@angular/material/sidenav";

export class SideNavHelper {
    private sidenav: MatSidenav;

    public constructor(sidenav: MatSidenav) {
        this.sidenav = sidenav;
    }

    public isSidenavOpened(): boolean {
        return this.sidenav.opened;
    }

    public open(): Promise<MatDrawerToggleResult> {
        return this.sidenav.open();
    }

    public close(): Promise<MatDrawerToggleResult> {
        return this.sidenav.close();
    }

    public toggle(): Promise<MatDrawerToggleResult> {
        return this.sidenav.toggle();
    }
}
