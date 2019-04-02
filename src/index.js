const PouchDB = require('pouchdb');

// Query system is a seperate module an can be loaded with `PouchDB.plugin`.
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-adapter-memory'));

(async () => {
    // PouchDB can use many backends, including WebSQL,localStorage and LevelDOWN.
    const db = new PouchDB('emperors', { adapter: 'memory' });

    // The API nomenclature is modeled after CouchDB, however the query/indexing system is inspired by MongoDB.
    await db.createIndex({
        index: { fields: ['name' ] }
    });

    await db.createIndex({
        index: { fields: ['house' ] }
    });

    const emperors = [
        {
            name: 'Charlemagne',
            house: 'Carolingian',
            reignStart: new Date('12/25/800'),
            reignEnd: new Date('1/28/814')
        },
        {
            name: 'Frederick Barbarossa',
            house: 'Hohenstaufen',
            reignStart: new Date('1/2/1155'),
            reignEnd: new Date('6/10/1190')
        },
        {
            name: 'Charles IV',
            house: 'Luxembourg',
            reignStart: new Date('1355'),
            reignEnd: new Date('11/29/1378')
        },
        {
            name: 'Sigismund',
            house: 'Luxembourg',
            reignStart: new Date('1433'),
            reignEnd: new Date('1437')
        },
        {
            name: 'Maximilian',
            house: 'Habsburg',
            reignStart: new Date('2/4/1508'),
            reignEnd: new Date('1/12/1519')
        },
        {
            name: 'Charles V',
            house: 'Habsburg',
            reignStart: new Date('6/28/1519'),
            reignEnd: new Date('8/27/1556')
        },
    ];

    for (const emperor of emperors) {
        // Any JavaScript object can be added to the db. 
        await db.post(emperor);
    }

    // As stated perviously queries borrow syntax from MongoDB.
    const luxembourgEmperors = (await db.find({
        selector: {
            house: 'Luxembourg' 
        }
    }))
    // Docs grabbed from the database are in the `.docs` property which will be an array.
    .docs;

    console.log("docs:", luxembourgEmperors);

    const charles4 = luxembourgEmperors[1];
    // Properties can be modified on the object.
    charles4.notes = 'The Emperor doted on his beloved Prague.'

    // And the `.put` function can be used to update existing documents.
    // The `_id` property on the document is the unique identifier used to match up the records.
    await db.put(charles4);

    const updatedDoc = await db.get(charles4._id);
    console.log("updated docs:", updatedDoc);
})();