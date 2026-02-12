import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeasonsService {
    constructor(private prisma: PrismaService) { }

    async getAll() {
        return this.prisma.season.findMany({
            orderBy: { startDate: 'asc' },
        });
    }

    async updateSeasons(seasons: any[]) {
        // Basic validation
        if (!Array.isArray(seasons)) {
            throw new BadRequestException(
                'Seasons array is required',
            );
        }

        if (seasons.length !== 3) {
            throw new BadRequestException(
                'Exactly 3 seasons must be provided',
            );
        }

        // Convert to Date objects
        const parsed = seasons.map((s) => ({
            ...s,
            startDate: new Date(s.startDate),
            endDate: new Date(s.endDate),
        }));

        // Sort by startDate
        parsed.sort(
            (a, b) => a.startDate.getTime() - b.startDate.getTime(),
        );

        // Validate:
        // 1️⃣ End date must not be before start date
        // 2️⃣ No gap
        // 3️⃣ No overlap
        for (let i = 0; i < parsed.length; i++) {
            const current = parsed[i];

            if (current.endDate < current.startDate) {
                throw new BadRequestException(
                    `End date cannot be before start date for ${current.name}`,
                );
            }

            if (i < parsed.length - 1) {
                const next = parsed[i + 1];

                const expectedNextStart = new Date(current.endDate);
                expectedNextStart.setDate(
                    expectedNextStart.getDate() + 1,
                );

                if (
                    expectedNextStart.getTime() !==
                    next.startDate.getTime()
                ) {
                    throw new BadRequestException(
                        'Seasons must be continuous with no gaps or overlaps',
                    );
                }
            }
        }

        // Validate total coverage = 365 or 366 days
        const firstStart = parsed[0].startDate;
        const lastEnd = parsed[parsed.length - 1].endDate;

        const diffTime =
            lastEnd.getTime() - firstStart.getTime();
        const diffDays =
            diffTime / (1000 * 60 * 60 * 24) + 1;

        if (diffDays !== 365 && diffDays !== 366) {
            throw new BadRequestException(
                'Seasons must cover exactly 12 months',
            );
        }

        // Update using transaction
        await this.prisma.$transaction(
            parsed.map((s) =>
                this.prisma.season.update({
                    where: { name: s.name },
                    data: {
                        startDate: s.startDate,
                        endDate: s.endDate,
                    },
                }),
            ),
        );

        return {
            message: 'Seasons updated successfully',
        };
    }
}