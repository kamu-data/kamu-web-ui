export interface SearchAdditionalButtonInterface {
    textButton: string;
    styleClassContainer?: string;
    styleClassButton?: string;
    iconSvgPath?: string;
    counter?: number;
    additionalOptions?: {
        title?: string;
        options?: {
            title?: string;
            text?: string;
            value?: string;
            action?: void;
        }[];
    };
}
export interface SearchAdditionalHeaderButtonInterface {
    textButton: string;
    styleClassContainer?: string;
    styleClassButton?: string;
    iconSvgPath: string;
    svgClass: string;
    iconSvgPathClass: string;
    counter: number;
    additionalOptions?: {
        title?: string;
        options?: {
            title?: string;
            text?: string;
            value?: string;
            action?: void;
        }[];
    };
}