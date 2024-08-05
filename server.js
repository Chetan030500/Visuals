const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dataSchema = new mongoose.Schema({
  region:String , country:String
}, { strict: false });
const Data = mongoose.model('Data', dataSchema, 'visualization');

app.get('/data', async (req, res) => {
  try {
    const { year, topic, country, region, city } = req.query;
    let query = {};
    if (year) query.Year = parseInt(year, 10);
    if (topic) query.Topics = { $regex: topic, $options: 'i' };
    if (country) query.Country = { $regex: country, $options: 'i' };
    if (region) query.Region = { $regex: region, $options: 'i' };
    if (city) query.City = { $regex: city, $options: 'i' };
    const data = await Data.find(query);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
