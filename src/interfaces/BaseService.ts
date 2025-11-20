import { PrismaService } from '@novaCode/resource';
import { PaginateOptions, PaginationParams } from './PaginationParams.interface';

export abstract class BaseService<T> {

    constructor(
        protected readonly prisma: PrismaService,
        private readonly model: any
    ) { }

    async paginate(params: PaginateOptions) {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 10;
        const skip = (page - 1) * limit;

        const where = params.where || {};
        const orderBy = params.orderBy || { id: 'desc' };

        const [data, total] = await this.prisma.$transaction([
            this.model.findMany({
                skip,
                take: limit,
                where,
                orderBy
            }),
            this.model.count({ where })
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
}