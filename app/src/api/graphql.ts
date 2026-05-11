import api from './axios';

interface GraphQLErrorItem {
  message?: string;
}

interface GraphQLResponse<TData> {
  data?: TData;
  errors?: GraphQLErrorItem[];
}

export const graphqlRequest = async <TData>(query: string, variables?: object): Promise<TData> => {
  try {
    const response = await api.post<GraphQLResponse<TData>>('/graphql', {
      query,
      variables,
    });

    const graphqlError = response.data?.errors?.[0]?.message;
    if (graphqlError) {
      throw new Error(graphqlError);
    }

    if (!response.data?.data) {
      throw new Error('Empty GraphQL response');
    }

    return response.data.data;
  } catch (err: any) {
    // Log detailed info for debugging server 400/500 responses.
    if (err?.response) {
      console.error('GraphQL request failed:', err.response.status, err.response.data);

      // Try to extract a useful message from GraphQL errors or API error payload.
      const serverData = err.response.data as Partial<GraphQLResponse<any>> & { message?: string };
      const serverMessage = serverData?.errors?.[0]?.message || serverData?.message;
      throw new Error(serverMessage || `GraphQL request failed with status ${err.response.status}`);
    }

    console.error('GraphQL request error:', err?.message || err);
    throw err;
  }
};