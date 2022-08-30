import { Injectable } from "@angular/core";
import { MatDrawerToggleResult, MatSidenav } from "@angular/material/sidenav";

@Injectable()
export class SideNavService {
    private sidenav?: MatSidenav;

    public setSidenav(sidenav: MatSidenav): void {
        this.sidenav = sidenav;
    }
    public isSidenavOpened(): boolean {
        return this.sidenav ? this.sidenav.opened : false;
    }

    public open(): Promise<MatDrawerToggleResult> {
        return this.sidenav ? this.sidenav.open() : this.emptySidenav();
    }

    public close(): Promise<MatDrawerToggleResult> {
        return this.sidenav ? this.sidenav.close() : this.emptySidenav();
    }

    public toggle(): Promise<MatDrawerToggleResult> {
        return this.sidenav ? this.sidenav.toggle() : this.emptySidenav();
    }

    private emptySidenav(): Promise<MatDrawerToggleResult> {
        return Promise.resolve("open");
    }
}
