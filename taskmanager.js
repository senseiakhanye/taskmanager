const { MongoClient, ObjectId } = require('mongodb');

const dbName = "taskmanager";
const connectionUrl = "mongodb://127.0.0.1:27018"


MongoClient.connect(connectionUrl, { useNewUrlParser: true }, ( error, client ) => {

    if (error !== null && error !== undefined) {
        return console.log("Mongo client error", error);
    }

    const dbConnection = client.db(dbName);
    const documentName = "tasks";
    // dbConnection.collection("tasks").insertMany([
    //     {name: 'Kat', surname: 'Kha'},
    //     {name: 'Kat1', surname: 'Kha1'},
    //     {name: 'Kat2', surname: 'Kha2'},
    //     {name: 'Kat3', surname: 'Kha3'},
    //     {name: 'Kat4', surname: 'Kha4'},
    //     {name: 'Kat5', surname: 'Kha5'},
    //     {name: 'Kat6', surname: 'Kha6'}
    // ]).then( (result) => {
    //     console.log(result);
    // }).catch( (error) => {
    //     console.log(error);
    // })

    // dbConnection.collection(documentName).find({}).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log(tasks);
    // })
    // console.log(client);

    dbConnection.collection(documentName).findOne({name:"Kat"}).then((name) => {
        console.log(name);
    }).catch( (error) => {
        console.log(error);
    })

    // dbConnection.collection(document).deleteMany( {name:"Kat4"}).then( (result) => {
    //     console.log(result);
    // }).catch( (error) => {
    //     console.log(error);
    // })
    // dbConnection.collection(documentName).deleteOne( {name:"Kat2"}).then( (result) => {
    //     console.log(result);
    // }).catch( error => {
    //     console.log(error);
    // })
})