function validateRequest(rules) {
    return (req, res, next) => {


        const pathWithId = req.path.match(/\/[a-fA-F0-9]{24}$/);
        const normalizedPath = pathWithId ? req.path.replace(/\/[a-fA-F0-9]{24}$/, '/:id') : req.path;

        const validation = rules[normalizedPath];
        console.log(req.path)
        if (!validation) {
            return next(); // No validation rules for this path
        }

        for (const field in validation) {
            const rule = validation[field];
            const value = req.body[field];

            if (rule.required && (value === undefined || value === null || value === '')) {
                return res.status(400).send({message:`Missing required field: ${field}`});
            }

            if (rule.type && typeof value !== rule.type) {
                return res.status(400).send({message:`Invalid type for field: ${field}`});
            }

            if (rule.minLength && value.length < rule.minLength) {
                return res.status(400).send({message:`Field ${field} must be at least ${rule.minLength} characters long`});
            }
            if (rule.maxLength && value.length > rule.maxLength) {
                return res.status(400).send({message:`Field ${field} must not be longer than ${rule.maxLength} characters`});
            }
            if (rule.regex && !rule.regex.test(value)) {
                return res.status(400).send({message:`Invalid format for field: ${field}`});
            }
        }

        next();
    };
}
export {validateRequest}
