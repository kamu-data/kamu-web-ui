export interface SearchAdditionalHeaderButtonInterface {
    id: string;
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
            isSelected?: boolean;
            value?: string;
        }[];
    };
}
