import { FastifyReply, FastifyRequest } from "fastify"
import { ITodoList } from "../interfaces"
import { ITodoItem } from "../interfaces"


// Static Version
/*
const staticLists: ITodoList[] = [
  {
	id: 'l-1',
    title: 'Project',
	description: 'Dev tasks',
    //
  },
  //
]

 export const listLists = async (
  request: FastifyRequest, 
  reply: FastifyReply) => {

   Promise.resolve(staticLists)
   .then((item) => {
 	reply.status(200).send({ data: item })
   })
 }

 export const addList = async (
  request: FastifyRequest, 
  reply: FastifyReply) => {

   const list = request.body as ITodoList
   staticLists.push(list)
   reply.status(200).send({ data: list })
 }

*/

// Dynamic Version

export async function listLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  console.log('DB status', this.level.db.status)
  const listsIter = this.level.db.iterator()

  const result: ITodoList[] = []
  for await (const [key, value] of listsIter) {
    result.push(JSON.parse(value))
  }
  reply.send({ data: result })
}

export async function addLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
 const list = request.body as ITodoList
 const result = await this.level.db.put(
   list.id.toString(), JSON.stringify(list)
 )
 reply.send({ data: result })
}

export async function updateList(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const updates = request.body as Partial<ITodoList>;

  try {
    const existingListRaw = await this.level.db.get(id);
    const existingList = JSON.parse(existingListRaw) as ITodoList;

    // Merge 
    const updatedList = { ...existingList, ...updates };

    // Save 
    await this.level.db.put(id, JSON.stringify(updatedList));

    reply.status(200).send({ data: updatedList });
  } catch (error) {
      reply.status(500).send({ error: "An error occurred" });
  }
}

export async function addItem(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const item = request.body as ITodoItem;

  try {
    const existingListRaw = await this.level.db.get(id);
    const existingList = JSON.parse(existingListRaw) as ITodoList;

    // Merge 
    const updatedList = { ...existingList, items: [...existingList.items, item] };

    // Save 
    await this.level.db.put(id, JSON.stringify(updatedList));

    reply.status(200).send({ data: updatedList });
  } catch (error) {
    reply.status(500).send({ error: "An error occurred" });
  }
}


export async function deleteItem(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  const { id, itemId } = request.params as { id: string, itemId: string };

  try {
    const existingListRaw = await this.level.db.get(id);
    const existingList = JSON.parse(existingListRaw) as ITodoList;

    // Check if the item exists
    const itemIndex = existingList.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return reply.status(404).send({ error: `Item with id ${itemId} not found in list ${id}` });
    }

    // Remove
    existingList.items.splice(itemIndex, 1);

    // Update
    await this.level.db.put(id, JSON.stringify(existingList));

    reply.status(200).send({ data: existingList });
  } catch (error) {
      reply.status(500).send({ error: "An error occurred" });
  }
}


export async function updateItem(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  const { id, itemId } = request.params as { id: string, itemId: string };
  const updates = request.body as Partial<ITodoItem>;

  try {
    // Fetch the list by id
    const existingListRaw = await request.server.level.db.get(id);
    const existingList = JSON.parse(existingListRaw) as ITodoList;

    // Find the item by itemId
    const itemIndex = existingList.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return reply.status(404).send({ error: `Item with id ${itemId} not found in list ${id}` });
    }

    // Update
    const updatedItem = { ...existingList.items[itemIndex], ...updates };
    existingList.items[itemIndex] = updatedItem;

    // Save 
    await request.server.level.db.put(id, JSON.stringify(existingList));

    reply.status(200).send({ data: updatedItem });
  } catch (error) {
      reply.status(500).send({ error: "An internal server error occurred" });
    }
}














