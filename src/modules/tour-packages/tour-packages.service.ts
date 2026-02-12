import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TourPackagesService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        stateId: number;
        name: string;
        locations: {
            locationId: number;
            numberOfNights: number;
            sequenceOrder: number;
        }[];
    }) {
        // Check state exists
        const state = await this.prisma.state.findUnique({
            where: { id: data.stateId },
        });

        if (!state) throw new NotFoundException('State not found');

        // Validate sequence uniqueness
        const sequenceSet = new Set(
            data.locations.map((l) => l.sequenceOrder),
        );

        if (sequenceSet.size !== data.locations.length) {
            throw new BadRequestException(
                'Duplicate sequenceOrder detected',
            );
        }

        // Validate locations exist and belong to same state
        const locationIds = data.locations.map((l) => l.locationId);

        const locations = await this.prisma.location.findMany({
            where: {
                id: { in: locationIds },
                stateId: data.stateId,
            },
        });

        if (locations.length !== locationIds.length) {
            throw new BadRequestException(
                'One or more locations are invalid or do not belong to the selected state',
            );
        }

        return this.prisma.tourPackage.create({
            data: {
                name: data.name,
                stateId: data.stateId,
                locations: {
                    create: data.locations,
                },
            },
            include: {
                locations: {
                    include: { location: true },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.tourPackage.findMany({
            include: {
                state: true,
                locations: {
                    include: {
                        location: true,
                    },
                    orderBy: { sequenceOrder: 'asc' },
                },
            },
        });
    }

    async findByState(stateId: number) {
        return this.prisma.tourPackage.findMany({
            where: { stateId },
            include: {
                locations: {
                    include: {
                        location: true,
                    },
                    orderBy: { sequenceOrder: 'asc' },
                },
            },
        });
    }

    async delete(id: number) {
        return this.prisma.tourPackage.delete({
            where: { id },
        });
    }
}