import { prisma} from "../config/db.js";

const createWatchlistItem = async (req, res) => {
    const { movieId, status, rating, notes, userId} = req.body

    // Verify if the user's id is the same as the one in the token
    if (userId !== req.user.id ) {
        return res.status(403).json({ error: "You are not the owner of this account."})
    }

    // Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: {id: movieId}
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found. "});
    };

    // Check if movie alredy has added. 
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: { 
            userId_movieId: {
                userId: userId,
                movieId: movieId,
            },
        },
    });

    if (existingInWatchlist) {
        return res.status(400).json({ error: "Movie already in the watchlist. "});
    };

    //In case where movie is new and it is in the database
    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId,
            movieId,
            status: status || "PLANNED",
            rating, 
            notes,
        },
    });

    res.status(201).json( {status: "Success", data: {watchlistItem},});
};

const deleteWatchlistItem = async (req, res) => {
    //Find watchlist item 
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },  
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found."});
    };

    //Ensure only owner can delete. 
    if (watchlistItem.userId !== req.user.id){
        return res.status(403).json({ error: "Not allowed to update this wathclist item."});
    };

    await prisma.watchlistItem.delete({
        where: { id: req.params.id},
    });

    res.status(200).json({
        status: "success",
        message: "Movie removed from watchlist",
    });
};

const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;

    //Find wacthlist item  
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found."});
    };

    //Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
        return res.status(403).json({ error: "Not allowed to update this watchlist item." });
    }

    //Build update data. 
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    //Update Wacthlist Item
    const updatedItem = await prisma.watchlistItem.update({
        where: { id: req.params.id },
        data: updateData,
    });

    res.status(200).json({
        status: "success",
        data: {
            watchlistItem: updatedItem,
        },
    });
};

const getWatchlistItems = async (req, res) => {

    const watchlistItems = await prisma.watchlistItem.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        select : {
            movie: {
                select: {
                    title: true,
                    overview: true,
                    genres: true,
                    runtime: true,
                    posterUrl: true
                }
            },
            rating: true,
            status: true,
            notes: true,
        },
    })

    // Verify length of the array
    if (watchlistItems.length === 0) {
        return res.status(200).json({ message: "Your watchlist is empty."});
    }

    // Transform the array
    const fomattedWatchlist = watchlistItems.map( (item) => ({
        movie: item.movie.title,
        overview: item.movie.overview,
        genres: item.movie.genres,
        runtime: item.movie.runtime,
        posterUrl: item.movie.posterUrl,
        rating: item.rating,
        notes: item.notes,
        updatedAt: item.updatedAt

    }))

    return res.status(200).json({
        status: "success",
        data: fomattedWatchlist,
    })
}

export { createWatchlistItem, deleteWatchlistItem, updateWatchlistItem, getWatchlistItems };