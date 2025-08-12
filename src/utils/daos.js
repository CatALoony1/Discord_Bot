let daos = {};

const setDaos = (initializedDaos) => {
    daos = initializedDaos;
};

const getDaos = () => {
    if (Object.keys(daos).length === 0) {
        throw new Error('DAOs have not been initialized yet. Call initializeDatabase first.');
    }
    return daos;
};

module.exports = {
    getDaos,
    setDaos,
};