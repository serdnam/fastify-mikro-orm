import fp from 'fastify-plugin'
import { MikroORM } from "@mikro-orm/core";
import type { FastifyPluginAsync } from "fastify";
import type { fastifyMikroOrm } from './types';



const fastifyMikroORM: FastifyPluginAsync<fastifyMikroOrm.MikroORMPluginOptions> = async function (fastify, options) {
  if (options.forkOnRequest === undefined){
    options.forkOnRequest = true;
  }

  const orm = await MikroORM.init(options);

  const mikroORM = {
    orm
  };

  fastify.decorate('mikroORM', mikroORM);


  if(options.forkOnRequest){
    fastify.addHook('onRequest', async function (this: typeof fastify,  request, reply) {
      request.mikroORM = {
        orm: Object.assign({}, this.mikroORM.orm),
      };
      request.mikroORM.orm.em = request.mikroORM.orm.em.fork();
     })
  } else {
    fastify.addHook('onRequest', async function (this: typeof fastify,  request, reply) {
      request.mikroORM = this.mikroORM;
     })
  }

  fastify.addHook('onClose', () => orm.close());

}

export default fp(fastifyMikroORM, {
  name: 'fastify-mikro-orm'
});