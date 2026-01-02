export const getMenuQuery = `
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
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                }
            }
        }
    }
`;  