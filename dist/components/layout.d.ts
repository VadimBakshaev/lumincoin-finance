export declare class Layout {
    private openRoute;
    private navBtnEl;
    private overlayEl;
    private navBarEl;
    private navLinkEl;
    private selectBtnEl;
    private selectAreaEl;
    private balanceEl;
    private userEl;
    private userDialogEl;
    constructor(openRoute?: (url: string) => Promise<void>);
    private showUser;
    private initListener;
    private openMenu;
    private closeMenu;
    setActive(route: string): void;
    getBalance(): Promise<void>;
    private openLogout;
}
//# sourceMappingURL=layout.d.ts.map