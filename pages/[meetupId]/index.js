import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        alt={props.meetupData.title}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export const getStaticPaths = async () => {
  //return object where all ynamic values are defined.
  //nextJs generete this first

  const client = await MongoClient.connect(
    "mongodb+srv://moaaz:Gq5nxlNTOM1YWVuP@cluster0.pbgtpbh.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupCollection = db.collection("meetups");

  //as we need only ids here.
  //first empty object will point to all object in the document.
  //{_id:1} this means only include ids but no other field values,calling toArray to convert it to javascript object type.
  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: 'blocking', //setting to false means path supports all meetupId.If set to true nextJs will try to create a page for unsupported id as well.
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
};
export const getStaticProps = async (context) => {
  //fetch data for single page
  const meetupId = context.params.meetupId; //this id is not pregenerated when user visit the page,so we need to pre-generate all the url first

  const client = await MongoClient.connect(
    "mongodb+srv://moaaz:Gq5nxlNTOM1YWVuP@cluster0.pbgtpbh.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  //this will return the document for the required id
  //this will convert string to ObjectId object type so it should match with _id type in mongodb
  const selectedMeetup = await meetupCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        image: selectedMeetup.data.image,
        description: selectedMeetup.data.description,
      },
    },
  };
};
export default MeetupDetails;
