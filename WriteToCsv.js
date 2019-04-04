const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    {id: 'user', title: 'User'},
    {id: 'session', title: 'Session'},
    {id: 'start', title: 'Start'},
    {id: 'end', title: 'End'},
    {id: 'success', title: 'Success'},
    {id: 'password', title: 'Password'},
  ]
});

var WriteToCsv = function(data){
  csvWriter
  .writeRecords([data])
  .then(()=> console.log('[INFO] CSV file written'));
}

module.exports.WriteToCsv = WriteToCsv;
