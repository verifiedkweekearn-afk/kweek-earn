const fs = require('fs');
const path = require('path');

// Load name databases (lazy load to save memory)
let firstNames = null;
let lastNames = null;
let nigerianNames = null;
let interests = null;
let locations = null;
let celebrities = null;

const loadData = () => {
  if (!firstNames) {
    firstNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/firstNames.json')));
    lastNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/lastNames.json')));
    nigerianNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/nigerianNames.json')));
    interests = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/interests.json')));
    locations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/locations.json')));
    celebrities = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/celebrities.json')));
  }
};

const randomNumber = () => Math.floor(Math.random() * 9999) + 1;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generators = [
  () => {
    loadData();
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    return `${first}_${last}_${randomNumber()}`;
  },
  () => {
    loadData();
    const name = randomItem(nigerianNames);
    return `${name}_${randomNumber()}`;
  },
  () => {
    loadData();
    const interest = randomItem(interests);
    const name = randomItem([...firstNames, ...nigerianNames]);
    return `${interest}_${name}_${randomNumber()}`;
  },
  () => {
    loadData();
    const location = randomItem(locations);
    const name = randomItem([...firstNames, ...nigerianNames]);
    return `${location}_${name}_${randomNumber()}`;
  },
  () => {
    loadData();
    const interest = randomItem(interests);
    const location = randomItem(locations);
    return `${interest}_${location}_${randomNumber()}`;
  },
  () => {
    loadData();
    return randomItem(celebrities);
  },
  () => {
    loadData();
    const celebrity = randomItem(celebrities);
    return `${celebrity}_${randomNumber()}`;
  },
  () => {
    loadData();
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    return `${first}_${last}`;
  },
  () => {
    loadData();
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    const location = randomItem(locations);
    return `${first}_${last}_${location}`;
  },
  () => {
    loadData();
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    const interest = randomItem(interests);
    return `${first}_${last}_${interest}`;
  }
];

const generateHandle = () => {
  const generator = randomItem(generators);
  return generator();
};

module.exports = {
  generateHandle,
  randomNumber,
  randomItem
};
