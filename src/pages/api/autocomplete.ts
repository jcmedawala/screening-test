import { Client } from "@elastic/elasticsearch";
import type { NextApiRequest, NextApiResponse } from "next";

// Return data from elasticsearch
const search = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {

  const { query } = req.query;
  
  // Check if query is undefined or an array and handle it accordingly
  const queryString = Array.isArray(query) ? query.join(" ") : query || '';

  const client = new Client({
    node: 'https://b28effecea6f49d9919cb8827c8b9bf9.ap-south-1.aws.elastic-cloud.com:443',
    auth: {
        apiKey: 'd2g1N2Q0NEJBUWthUjJ3QXFrRkE6UWFPQmJUam9UdGUtMzY2aFRpNHNQZw=='
    }
  });
  
  const r = await client.search({
    index: "indi",
    size: 10,
    body: {
      query: {
        fuzzy: {
          title: {
            value: queryString,
            fuzziness: 2
          }
        }
      },
    },
  });

  //console.log(r.hits.hits)

  /* const {
    body: { hits },
  } = r; */
  return res
    .status(200)
    .json(
      r.hits.hits.map((hit: any) => ({
        _id: hit._id,
        ...hit._source,
      }))
    );
};

export default search;