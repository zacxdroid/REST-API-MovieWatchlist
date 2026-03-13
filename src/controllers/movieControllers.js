import { prisma } from "../config/db.js";

const getMovies = async (req, res) => {
    // Extract query parameters from the URL
    const { title, genres, releaseYear } = req.query;
    
    // Prisma filter
    const where = {
        ...(genres && { genres: { has: genres } }),
        ...(releaseYear && { releaseYear: Number(releaseYear) }),
        ...(title && { title: { contains: title, mode: "insensitive" } })
    };

    // Finding the movie
    const movies = await prisma.movie.findMany({
        where,
        orderBy: { title: "asc" },
        select: {
            title: true, 
            overview: true,
            releaseYear: true,
            genres: true,
            runtime: true,
            posterUrl: true,
        },
    });

    return res.status(200).json({
        status: "success",
        results: movies.length,
        data: movies
    });
};

export { getMovies }