import React, { useEffect } from "react";
import { useState } from "react";
import { app, useFirebase } from "../context/firebase";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const CreateEvent = () => {
  const [eventName, setEventName] = useState();
  const [eventDescription, setDescription] = useState("");
  const [eventTimmings, setEventTimings] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isEdit = location.pathname.includes("edit-event");
  const { id } = params;
  // const [eventImage,setEventImage]=useState()
  useEffect(() => {
    const fetchData = async () => {
      if (isEdit) {
        const result = await firebase.getEventById(id);
        setEventName(result.name);
        setDescription(result.desc);
        setEventTimings(result.time);
      }
    };
    fetchData();
  }, []);
  const firebase = useFirebase(app);
  const handleCreateEvent = async () => {
    if (!isEdit) {
      const res = await firebase.createEvent(
        eventName,
        eventDescription,
        eventTimmings
      );
      if (res) {
        alert("Event Created Successfully");
        navigate("/admin-dashboard");
      } else {
        alert("There is some error in creating the event");
      }
    } else {
      const res = await firebase.EditEvent(
        id,
        eventName,
        eventDescription,
        eventTimmings
      );
      if (res) {
        alert("Event Edited Successfully");
        navigate("/admin-dashboard");
      } else {
        alert("There is some error in edit the event");
      }
    }
  };

  return (
    <div className="card mt-5 p-3 w-50" style={{ margin: "auto" }}>
      <h6 className="text-center">{isEdit ? "Edit" : "Create"}Event</h6>
      <div class="mb-3">
        <label for="name" class="form-label">
          Event Name
        </label>
        <input
          type="text"
          class="form-control"
          id="name"
          name="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div class="mb-3">
        <label for="desc" class="form-label">
          Event Description
        </label>
        <textarea
          class="form-control"
          id="name"
          name="eventDescription"
          value={eventDescription}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div class="mb-3">
        <label for="datetime" class="form-label">
          Date and Time Of Event
        </label>
        <input
          type="datetime-local"
          class="form-control"
          id="datetime"
          name="eventTimings"
          value={eventTimmings}
          onChange={(e) => setEventTimings(e.target.value)}
        />
      </div>
      {/* <div class="mb-3">
          <label for="image" class="form-label">
           Event Image
          </label>
          <input type="file" class="form-control" id="image" name="eventImage"  onChange={(e)=>setEventImage(e.target.files[0])}/>
        </div> */}
      <button
        class="btn btn-primary"
        style={{ width: "100%" }}
        onClick={handleCreateEvent}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateEvent;
