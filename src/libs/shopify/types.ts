export type Menu = {
    title: string;
    path: string;
    image?: {
        url: string;
        altText?: string;
        width?: number;
        height?: number;
    };
}

export type ShopifyMenuOperation = {
    data: {
        menu? : {
            items: {
                title: string;
                url: string;
                resource?: {
                    id: string;
                    image?: {
                        url: string;
                        altText?: string;
                        width?: number;
                        height?: number;
                    };
                };
            }[];
        };
    };
    variables: {
        handle: string;
    };
}