import { Client } from '@notionhq/client';
import React, { useEffect, useState } from 'react';
import { getFile } from '../lib/post';
export default function Home({ result }: ArrayResult) {
  const [content, setContent] = useState<string>('');
  useEffect(() => {
    const getCheck = async () => {
      const check = await getFile(result.properties.Description.files[0].file.url);
      console.log(check);
      setContent(check.content);
    };
    getCheck();
  }, []);
  const [note, setNote] = useState<Result>(result);
  const handleUpdate = async (blockID: string) => {
    const { data } = await fetch('/api/hello', {
      method: 'PATCH',
      body: JSON.stringify({ blockID }),
    }).then((data) => data.json());
    setNote(data);
  };
  return (
    <ul className='w-full h-screen'>
      <li>
        <h4 className='cursor-pointer text-[20px] font-bold' onClick={() => handleUpdate(note.id)}>
          {note.properties.Name.title[0].plain_text}
        </h4>
        <div className='bg-red-50' dangerouslySetInnerHTML={{ __html: content }}></div>
        <h5>{note.properties.Mount.number}</h5>
      </li>
    </ul>
  );
}
interface Result {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    Description: { files: [{ file: { url: string } }] };
    Name: { title: [{ plain_text: string }] };
    Mount: { number: number };
  };
}
interface ArrayResult {
  result: Result;
}

export async function getStaticProps() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_DATABASE_ID;
  const { results } = await notion.databases.query({ database_id: databaseId as string });
  const random = Math.floor(Math.random() * results.length);
  const result = results[random];
  return {
    props: {
      result,
    },
    revalidate: 10,
  };
}
