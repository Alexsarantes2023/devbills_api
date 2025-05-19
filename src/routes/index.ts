import type { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance): Promise<void>{

  fastify.get('/health', async() => {
      return { 
          status: 'Ok',
          message: 'DevBills API rodando normalmente'
     }
  })
}

export default routes