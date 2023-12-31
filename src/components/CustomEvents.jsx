import React from "react";

const CustomEvents = ({events}) => {
  return (
    <div>
      {events&& events.map((item) => {
            return (
              <div className="card d-flex flex-row m-4 gap-4 align-items-center" key={item.id}>
                <div>
                  <img
                    src="data:image/jpeg;base64,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"
                    class="card-img-top"
                    alt="..."
                  />
                </div>
                <div className=" justify-content-center">
                  <h6>Name:{item.name}</h6>
                  <p>Time:{new Date(item.time).toLocaleString()}</p>
                </div>
              </div>
            );
          }
      )}
    </div>
  );
};

export default CustomEvents;
