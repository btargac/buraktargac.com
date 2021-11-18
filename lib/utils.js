const utils = {
    connectToDatabase: async (mongoose, config) => {
        // TODO: remove after seeing on production
        console.log('config', config);
        const dbPath = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}/${config.DB_DATABASE}?retryWrites=true&w=majority`;

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
