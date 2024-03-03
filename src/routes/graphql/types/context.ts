import { DefaultArgs, PrismaClientOptions } from '@prisma/client/runtime/library.js';

import { PrismaClient } from '@prisma/client';

export type Context = {
    prisma: PrismaClient<PrismaClientOptions, never, DefaultArgs>;
};
