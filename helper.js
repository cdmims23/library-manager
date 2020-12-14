const fs = require('fs');

const data = fs.readFileSync('./books.csv', {encoding: 'utf-8'}).split('\n');
let bookArr = [];

for (let index = 1; index < data.length; index++) {
  const element = data[index].trim().split(',');
  const obj = {title: element[0], author: element[1], genre: element[2], year: element[3]}

  bookArr.push(obj);
  console.log(bookArr);    
}

