const dbInstance = db.getSiblingDB('maple');

const files = [
  { file: 'users.json', collection: 'users' },
  { file: 'events.json', collection: 'events' },
];

files.forEach(({ file, collection }) => {
  const content = cat(file);
  const json = JSON.parse(content);
  dbInstance[collection].insertMany(json);
});
