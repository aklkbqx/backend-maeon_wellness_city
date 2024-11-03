import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';

export interface SearchResult {
    id: string;
    name: string;
    type: string;
    description?: string | null;
    image?: string | null;
    address?: string | null;
    subdistrict?: string | null;
    contact?: string | null;
    map?: string | null;
    date_info?: string | null;
}

const prisma = new PrismaClient();

const safeJsonParse = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return null;
    }
};

export const app = new Elysia()
    .get('/search', async ({ query }) => {
        try {
            const searchQuery = query?.q?.trim() as string;

            if (!searchQuery) {
                return {
                    success: false,
                    message: 'Search query is required',
                };
            }

            const baseConditions = (type: number) => ({
                AND: [
                    { isActive: true },
                    { type },
                    {
                        OR: [
                            { name: { contains: searchQuery } }
                        ]
                    }
                ]
            });

            // ค้นหาจากทุกตาราง
            const [attractions, accommodations, learningResources, restaurants, hospitals] = await Promise.all([
                // สถานที่ท่องเที่ยว
                prisma.locations.findMany({
                    where: {
                        ...baseConditions(1),
                        attractions: {
                            some: {
                                OR: [
                                    { description: { contains: searchQuery } },
                                    { interest: { contains: searchQuery } },
                                    { product: { contains: searchQuery } }
                                ]
                            }
                        }
                    },
                    include: {
                        location_types: true,
                        attractions: {
                            include: {
                                subdistricts: true
                            }
                        }
                    }
                }),

                // ที่พัก
                prisma.locations.findMany({
                    where: {
                        ...baseConditions(2),
                        accommodation: {
                            some: {
                                OR: [
                                    { description: { contains: searchQuery } },
                                    { interest: { contains: searchQuery } },
                                    { additional_services: { contains: searchQuery } }
                                ]
                            }
                        }
                    },
                    include: {
                        location_types: true,
                        accommodation: {
                            include: {
                                subdistricts: true
                            }
                        }
                    }
                }),

                // แหล่งเรียนรู้
                prisma.locations.findMany({
                    where: {
                        ...baseConditions(3),
                        learning_resources: {
                            some: {
                                OR: [
                                    { description: { contains: searchQuery } },
                                    { interest: { contains: searchQuery } },
                                    { product: { contains: searchQuery } }
                                ]
                            }
                        }
                    },
                    include: {
                        location_types: true,
                        learning_resources: {
                            include: {
                                subdistricts: true
                            }
                        }
                    }
                }),

                // ร้านอาหาร
                prisma.locations.findMany({
                    where: {
                        ...baseConditions(4),
                        restaurant: {
                            some: {
                                OR: [
                                    { description: { contains: searchQuery } },
                                    { Interesting_menu: { contains: searchQuery } }
                                ]
                            }
                        }
                    },
                    include: {
                        location_types: true,
                        restaurant: {
                            include: {
                                subdistricts: true
                            }
                        }
                    }
                }),

                // โรงพยาบาล
                prisma.locations.findMany({
                    where: {
                        ...baseConditions(5),
                        hospital: {
                            some: {
                                OR: [
                                    { description: { contains: searchQuery } },
                                    { activites: { contains: searchQuery } }
                                ]
                            }
                        }
                    },
                    include: {
                        location_types: true,
                        hospital: {
                            include: {
                                subdistricts: true
                            }
                        }
                    }
                })
            ]);

            // Format results
            const formatResults = (locations: any[]): SearchResult[] => {
                return locations.map(location => {
                    const detail = location.attractions?.[0] ||
                        location.accommodation?.[0] ||
                        location.learning_resources?.[0] ||
                        location.restaurant?.[0] ||
                        location.hospital?.[0];

                    const images = safeJsonParse(detail?.images);
                    const contact = safeJsonParse(detail?.contact);
                    const date_info = safeJsonParse(detail?.date_info);
                    const map = safeJsonParse(location.map);

                    return {
                        id: location.id.toString(),
                        name: location.name,
                        type: location.location_types.name,
                        description: detail?.description || null,
                        image: images?.[0] || null,
                        address: detail?.address || null,
                        subdistrict: detail?.subdistricts?.name || null,
                        contact: contact ? JSON.stringify(contact) : null,
                        map: map ? JSON.stringify(map) : null,
                        date_info: date_info ? JSON.stringify(date_info) : null
                    };
                });
            };

            const allResults = [
                ...formatResults(attractions),
                ...formatResults(accommodations),
                ...formatResults(learningResources),
                ...formatResults(restaurants),
                ...formatResults(hospitals)
            ];

            return {
                success: true,
                total: allResults.length,
                results: allResults
            };

        } catch (error) {
            console.error('Search error:', error);
            return {
                success: false,
                message: 'An error occurred while searching',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    })
    .get('/locations/types', async () => {
        try {
            const types = await prisma.location_types.findMany({
                orderBy: {
                    name: 'asc'
                },
                select: {
                    id: true,
                    name: true
                }
            });

            return {
                success: true,
                location_type: types
            };
        } catch (error) {
            console.error('Error fetching location types:', error);
            return {
                success: false,
                message: 'An error occurred while fetching location types',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    })
    .get('/locations/by-type/:typeId', async ({ params }) => {
        try {
            const typeId = parseInt(params.typeId);

            if (isNaN(typeId)) {
                return {
                    success: false,
                    message: 'Invalid type ID',
                };
            }

            const locations = await prisma.locations.findMany({
                where: {
                    type: typeId,
                    isActive: true
                },
                include: {
                    location_types: true,
                    attractions: {
                        include: {
                            subdistricts: true
                        }
                    },
                    accommodation: {
                        include: {
                            subdistricts: true
                        }
                    },
                    learning_resources: {
                        include: {
                            subdistricts: true
                        }
                    },
                    restaurant: {
                        include: {
                            subdistricts: true
                        }
                    },
                    hospital: {
                        include: {
                            subdistricts: true
                        }
                    }
                }
            });

            const formattedResults = locations.map(location => {
                const detail = location.attractions?.[0] ||
                    location.accommodation?.[0] ||
                    location.learning_resources?.[0] ||
                    location.restaurant?.[0] ||
                    location.hospital?.[0];

                const images = safeJsonParse(detail?.images);
                const contact = safeJsonParse(detail?.contact);
                const date_info = safeJsonParse(detail?.date_info);
                const map = safeJsonParse(location.map);

                return {
                    id: location.id.toString(),
                    name: location.name,
                    type: location.location_types.name,
                    description: detail?.description || null,
                    image: images?.[0] || null,
                    address: detail?.address || null,
                    subdistrict: detail?.subdistricts?.name || null,
                    contact: contact ? JSON.stringify(contact) : null,
                    map: map ? JSON.stringify(map) : null,
                    date_info: date_info ? JSON.stringify(date_info) : null
                };
            });

            return {
                success: true,
                total: formattedResults.length,
                results: formattedResults
            };

        } catch (error) {
            console.error('Error fetching locations by type:', error);
            return {
                success: false,
                message: 'An error occurred while fetching locations',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    });

export default app;