import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const source = await prisma.source.findUnique({
    where: {
      id: id,
    },
  });
  res.json(source);
}
export async function getStaticProps() {
  const sources = await prisma.source.findMany();

  return {
    props: { sources },
  };
}
//using prisma, we can do the following:
//for a get request, get sources where id = [id] and return it to the requester
//for a post request, create a new source with the given data
//for a delete request, delete the source with the given id
//for a put request, update the source with the given id with the given data

connection.end();
