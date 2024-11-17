import { FastifyInstance } from 'fastify'
import * as listsController from '../../controllers/lists.controller'
import { addListSchema, listListsSchema } from '../../schemas'

async function lists(fastify: FastifyInstance) {

  //fastify.get('/', listsController.listLists)

  //fastify.post('/', listsController.addLists)

  fastify.get('/', { schema: listListsSchema }, listsController.listLists)

  fastify.post('/', { schema: addListSchema }, listsController.addLists)

  fastify.put('/:id', listsController.updateList)

  fastify.post('/:id/items', listsController.addItem)

  fastify.delete('/:id/items/:itemId', listsController.deleteItem)

  fastify.put('/:id/items/:itemId', listsController.updateItem)
}

export default lists