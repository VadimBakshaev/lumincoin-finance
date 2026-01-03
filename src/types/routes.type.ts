export type RoutesType = {
    route: string;
    title: string;
    filePath: string;
    layout: string | null;
    depends: string | null;
    load: () => void;
}