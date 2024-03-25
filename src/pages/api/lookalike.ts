import { Client } from "@elastic/elasticsearch";
import type { NextApiRequest, NextApiResponse } from "next";

const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id: string = req.query.id as string;
  const client = new Client({
    node: 'https://b28effecea6f49d9919cb8827c8b9bf9.ap-south-1.aws.elastic-cloud.com:443',
    auth: {
        apiKey: 'd2g1N2Q0NEJBUWthUjJ3QXFrRkE6UWFPQmJUam9UdGUtMzY2aFRpNHNQZw=='
    }
  });
  const  similar = await client.search({
    index: "indi",
    body: {
      size: 12,
      query: {
        more_like_this: {
          fields: [
            "title",
            "subtitle",
            "authors",
            "description",
          ],
          like: [
            {
              _index: "indi",
              _id: id,
            },
          ],
          min_term_freq: 1,
          max_query_terms: 24,
        },
      },
    },
  });
  res.status(200).json(
    similar.hits.hits.map((hit: any) => ({
      _id: hit._id,
      ...hit._source,
    }))
  );
};

export default search;