//Get schema frist
export const validateRequest = (schema) => {
    return (req, res, next) => {
        //Check if body's request passed the schema
        const result = schema.safeParse(req.body); 

        if (!result.success) {
            const formatted = result.error.format(); //Formatear error. 

            const flatErrors = Object.values(formatted)
                .flat()
                .filter(Boolean)
                .map((err) => err._errors)
                .flat();

            return res.status(400).json({ message: flatErrors.join(", ") });
        };

        next();
    };
};