import imageFragment from "../fragments/image";

export const getMenuQuery = /* GraphQL */ `
    query getMenu($handle: String!) {
        menu(handle: $handle) {
            items {
                title
                url
                ... on MenuItem {
                    resource {
                        ... on Collection {
                            id
                            image {
                                ...image
                            }
                        }
                    }
                }
            }
        }
    }
    ${imageFragment}
`;  