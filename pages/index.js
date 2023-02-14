//our-domain.com/
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

//! IMPORTANT LEARNINGS
//here component get rendered twice first time it get rendered with empty loadedMeetups,
//then after rendering useEffects executed and it set loadedMeetups through setLoadedMeetups,
//after that compoentnt get rendered again with new loadedMeetups data.
//that means first time there is no actual data/complete data is rendered therefore it will be an issue while considering SEO.
("to resolve this we need to prerender page with the data.");

//for this we have some method to resole.
("first we can export a function 'getStaticProps()' only from pages(not from components)");

const HomePage = (props) => {
  const loadedMeetups = props.meetups;
  return (
    <>
      <Head>
        <title>React Meetup</title>
        <meta
          name="description"
          content="Browse a huge list of highly actiove React meetups"
        />
      </Head>
      <MeetupList meetups={loadedMeetups} />
    </>
  );
};

//next js will execute 'getStaticProps()' before it calls the components.
//method first.
export const getStaticProps = async () => {
  //any code written here will never be on client side,these code will only be executed for server side.
  //we can fetch data or can do other stuff here.

  const client = await MongoClient.connect(
    "mongodb+srv://moaaz:Gq5nxlNTOM1YWVuP@cluster0.pbgtpbh.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db(); //on client calling db method to hold database which we are connecting here.

  const meetupCollection = db.collection("meetups"); //here taking all meetups document into one meetupCollection.
  const meetups = await meetupCollection.find().toArray(); //by default find() will give all the documents present in te collection

  console.log("meetups", meetups);
  client.close(); //closing the connection
  //! we always need to return a object here.
  return {
    //this key must have to named as props
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    }, //this props will be set as the current page props.
    revalidate: 1, //using this we do "Inreamental static generation" by giving some time(in secounds) this page will generate after every gicen time interval
    //hence this data will replace previous data
  };
};

//method second(server-side-rendering),but this method can leads to slowing page because of rerendering
//use of chache data is less here

// export const getServerSideProps = (context) => {
//   //this get executed for every incoming request.
//   //any code written here will never be on client side,these code will only be executed for server side.
//   //we can fetch data or can do other stuff here.

//   const req = context.req;
//   const res = context.res;
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export default HomePage;
