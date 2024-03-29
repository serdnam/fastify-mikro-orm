/* eslint-disable no-unused-vars */
import { MikroORM, Options } from '@mikro-orm/core'

export declare namespace fastifyMikroOrm {
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

  type FastifyMikroOrmOptions = {
    forkOnRequest?: boolean
  }

  type MikroORMPluginOptions = Options & FastifyMikroOrmOptions;

}

declare module 'fastify' {
  interface FastifyInstance {
    mikroORM: {
      orm: fastifyMikroOrm.Awaited<ReturnType<(typeof MikroORM)['init']>>
    }
  }
  interface FastifyRequest {
    mikroORM: {
      orm: fastifyMikroOrm.Awaited<ReturnType<(typeof MikroORM)['init']>>
    }
  }
}
