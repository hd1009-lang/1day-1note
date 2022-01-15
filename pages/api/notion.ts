// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Client} from '@notionhq/client'
type Data = {
  data:{}
}
type Body={
  blockID:string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const {method,body} = req
  switch (method) {
    case 'PATCH':
      const {blockID,mount} = JSON.parse(body)
      const response = await notion.pages.update({
        page_id:blockID,
        properties: {
          ["TM%60S"]: { number: mount+1 },
        },
      })
      return res.status(200).json({data: response })
    default:
      break;
  }
 
}
