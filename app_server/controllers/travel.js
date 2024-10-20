const fs = require('fs').promises; 

const travel = async (req, res, next) => {
    try {
        const data = await fs.readFile('./data/trips.json', 'utf8');
        const trips = JSON.parse(data);
        res.render('travel', { title: 'Travlr Getaways', trips });
    } catch (error) {
        console.error('Failed to read trips data:', error);
        next(error);
    }
};

module.exports = {
  travel
};
