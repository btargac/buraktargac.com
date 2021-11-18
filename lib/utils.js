const utils = {
    connectToDatabase: async mongoose => {
        const dbPath = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

        try {
            await mongoose.connect(dbPath);
        } catch (error) {
            console.log('initial mongoose connection error', error);
            // TODO: implement trying to reconnect for a number of times
        }

        return mongoose.connection;
    }
};

module.exports = utils;
