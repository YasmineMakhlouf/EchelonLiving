/**
 * categories
 * Frontend api module for Echelon Living app.
 */
import { graphqlRequest } from "./graphql";

export const getCategories = async () => {
  return graphqlRequest<{ categories: { id: number; name: string }[] }>(
    `
      query {
        categories {
          id
          name
        }
      }
    `,
  ).then((res) => res.categories || []);
};
