const fs = require('fs');
const path = require('path');

// Load all name databases
const firstNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/firstNames.json')));
const lastNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/lastNames.json')));
const nigerianNames = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/nigerianNames.json')));
const interests = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/interests.json')));
const locations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/locations.json')));
const celebrities = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/celebrities.json')));

// Configuration
const MAX_HANDLES = 50000000; // 50 million target
const OUTPUT_FILE = path.join(__dirname, '../data/allHandles.json');
const BATCH_SIZE = 10000; // Write in batches of 10,000

// Helper: generate random number between 1-9999
const randomNumber = () => Math.floor(Math.random() * 9999) + 1;

// Helper: get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Handle generators
const generators = [
  () => {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    return `${first}_${last}_${randomNumber()}`;
  },
  () => {
    const name = randomItem(nigerianNames);
    return `${name}_${randomNumber()}`;
  },
  () => {
    const interest = randomItem(interests);
    const name = randomItem([...firstNames, ...nigerianNames]);
    return `${interest}_${name}_${randomNumber()}`;
  },
  () => {
    const location = randomItem(locations);
    const name = randomItem([...firstNames, ...nigerianNames]);
    return `${location}_${name}_${randomNumber()}`;
  },
  () => {
    const interest = randomItem(interests);
    const location = randomItem(locations);
    return `${interest}_${location}_${randomNumber()}`;
  },
  () => randomItem(celebrities),
  () => {
    const celebrity = randomItem(celebrities);
    return `${celebrity}_${randomNumber()}`;
  },
  () => {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    return `${first}_${last}`;
  },
  () => {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    const location = randomItem(locations);
    return `${first}_${last}_${location}`;
  },
  () => {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    const interest = randomItem(interests);
    return `${first}_${last}_${interest}`;
  }
];

// Set to track unique handles (limited size)
const seen = new Set();
let totalWritten = 0;

// Create write stream
const writeStream = fs.createWriteStream(OUTPUT_FILE);
writeStream.write('[\n');

const generateHandles = () => {
  console.log('Starting handle generation (streaming mode)...');
  console.log(`Target: ${MAX_HANDLES.toLocaleString()} unique handles`);
  console.log(`Writing directly to ${OUTPUT_FILE}`);
  console.log('Memory usage will stay low');
  
  const startTime = Date.now();
  let batchBuffer = [];
  let lastLog = startTime;
  
  while (totalWritten < MAX_HANDLES) {
    const generator = randomItem(generators);
    const handle = generator();
    
    if (!seen.has(handle)) {
      seen.add(handle);
      batchBuffer.push(JSON.stringify(handle));
      
      // Write batch when full
      if (batchBuffer.length >= BATCH_SIZE) {
        const chunk = (totalWritten === 0 ? '' : ',\n') + batchBuffer.join(',\n');
        writeStream.write(chunk);
        totalWritten += batchBuffer.length;
        batchBuffer = [];
        
        // Clear seen set occasionally to free memory
        if (seen.size > 1000000) {
          seen.clear();
        }
      }
      
      // Log progress
      if (totalWritten % 100000 === 0 && totalWritten > 0) {
        const now = Date.now();
        const elapsed = ((now - startTime) / 1000).toFixed(1);
        const rate = (totalWritten / ((now - startTime) / 1000)).toFixed(0);
        console.log(`Generated ${totalWritten.toLocaleString()} handles in ${elapsed}s (${rate}/sec)`);
      }
    }
  }
  
  // Write remaining handles
  if (batchBuffer.length > 0) {
    const chunk = (totalWritten === 0 ? '' : ',\n') + batchBuffer.join(',\n');
    writeStream.write(chunk);
    totalWritten += batchBuffer.length;
  }
  
  writeStream.write('\n]');
  writeStream.end();
  
  const totalTime = ((Date.now() - startTime) / 60).toFixed(1);
  console.log('========================================');
  console.log(`✅ Generation complete: ${totalWritten.toLocaleString()} handles`);
  console.log(`⏱️  Time taken: ${totalTime} minutes`);
  console.log(`📁 File saved: ${OUTPUT_FILE}`);
  console.log('========================================');
};

// Run
generateHandles();
