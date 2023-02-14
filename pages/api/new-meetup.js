// /api/new-meetup

import { MongoClient } from "mongodb";

//function name can be any thing,it will receive request and response object.
const handler = async (req, res) => {
  //req object contain data about incoming request(like header,request body).
  //res will be needed to send back response for the request.

  //here we need to do only post request , but othetr request can also be checked here.
  if (req.method === "POST") {
    const data = req.body;
    const client = await MongoClient.connect(
      "mongodb+srv://moaaz:Gq5nxlNTOM1YWVuP@cluster0.pbgtpbh.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db(); //on client calling db method to hold database which we are connecting here.

    const meetupCollection = db.collection("meetups"); //here taking all meetups document into one meetupCollection.
    const result = await meetupCollection.insertOne({ data });

    client.close(); //to close database connection.

    //201 to indicate somethimg was inserted properly
    res.status(201).json({ messge: "Meetup inserted!" });
  }
};
export default handler;
