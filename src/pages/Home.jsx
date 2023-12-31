import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import Trophy from "../assets/Trophy.png";
import Event from "../components/Event";
import { useFirebase } from "../context/firebase";
const Home = () => {
  const [events, setEvents] = useState();
  const firebase = useFirebase();
  useEffect(() => {
    const fetchEvents = async () => {
      const result = await firebase.AllEvents();
      const eventsData = result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div class="home-banner d-flex align-items-center justify-content-center vh-100">
        <div class="container text-center">
          <img src={Trophy} style={{ height: "20%", width: "20%" }} />
          <h1>Our Events</h1>
          <h6>Take a step forward to participate</h6>
          <p>We don't remember the days, rather the moments</p>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-center">Upcomming Contests</h3>
        <div className="m-4 upcomming-contests d-flex  flex-wrap gap-4 justify-content-center">
          {events?.map((event) => {
            if (new Date(event.time) > new Date())
              return <Event index={event.id} event={event} />;
          })}
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-center">Past Contests</h3>

        <div className="m-4 d-flex flex-wrap gap-4 justify-content-center upcomming-contests ">
          {events?.map((event) => {
            if (new Date(event.time) < new Date())
              return <Event index={event.id} event={event} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
