/* import fp from 'fastify-plugin'
import swagger, { FastifySwaggerOptions } from '@fastify/swagger'
import JsonSchemas from '../schemas/all.json'

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.addSchema({
    $id: 'ITodoList',
    ...JsonSchemas.definitions.ITodoList
  })
  fastify.addSchema({
    $id: 'ITodoItem',
    ...JsonSchemas.definitions.ITodoItem
  }),
  fastify.register(swagger, {
    openapi: {
      info: { title: 'Todo API', version: '1.0.0' },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
    }
  })
}) */


import fp from 'fastify-plugin';
import swagger, { FastifySwaggerOptions } from '@fastify/swagger';
import JsonSchemas from '../schemas/all.json';

export default fp<FastifySwaggerOptions>(async (fastify) => {
  // Register ITodoItem schema
  fastify.addSchema({
    $id: 'ITodoItem', // Unique identifier
    ...JsonSchemas.definitions.ITodoItem // Spread the schema properties excluding $id
  });

  // Register ITodoList schema
  fastify.addSchema({
    $id: 'ITodoList', // Unique identifier
    ...JsonSchemas.definitions.ITodoList,
    properties: {
      ...JsonSchemas.definitions.ITodoList.properties,
      items: {
        ...JsonSchemas.definitions.ITodoList.properties.items,
        items: { $ref: 'ITodoItem#' } // Ensure proper reference to ITodoItem
      }
    }
  });

  // Register Swagger
  fastify.register(require('@fastify/swagger'), {})
  fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/api-docs',
    exposeRoute: true,
    openapi: {
      info: { title: 'Todo API', version: '1.0.0' },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ]
    }
  });
});
