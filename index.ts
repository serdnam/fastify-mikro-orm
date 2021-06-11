import fp from 'fastify-plugin'
import { MikroORM } from "@mikro-orm/core";
import type { FastifyPluginAsync } from "fastify";
import type { fastifyMikroOrm } from './types';



const fastifyMikroORM: FastifyPluginAsync<fastifyMikroOrm.MikroORMPluginOptions> = async function (fastify, options) {
  const orm = await MikroORM.init(options);

  const mikroORM = {
    orm
  };

  fastify.decorate('mikroORM', mikroORM);

  fastify.addHook('onClose', () => orm.close());

}

export default fp(fastifyMikroORM);