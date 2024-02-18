/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCareer } from "../../../../redux/reducers/careerReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditCareer = (props) => {
  const dispatch = useDispatch();
  const career = props.career;
  const option = props.option;

  // form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editDatePosted, setEditDatePosted] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    setEditTitle(career.jobtitle);
    setEditDescription(career.description);
    setEditImage(career.image);
    setEditDeadline(career.deadline);
    setEditDatePosted(career.dateposted);
  };

  useEffect(() => {
    updateFormObject();
  }, [career]);

  // clear form fields
  const clearForm = () => {
    setEditTitle("");
    setEditDescription("");
    setEditImage("");
    setEditDeadline("");
    setEditDatePosted("");
    dispatch(fetchCareer());
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_BASE_URL;

    const updatedCareer = {
      jobtitle: editTitle,
      description: editDescription,
      image: editImage,
      deadline: editDeadline,
      dateposted: editDatePosted,
    };

    await fetch(`${apiUrl}/api/career/careers/${career._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCareer),
    });

    clearForm();
    handleClose();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit Jobs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="question" style={{ marginTop: "-1rem" }}>
              Job Title
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="answer" style={{ marginTop: "-1rem" }}>
              Description
            </label>

            <textarea
              rows={9}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{ marginBottom: "34px" }}
            ></textarea>
          </div>

          <div className="FieldGroup">
            <label htmlFor="category" style={{ marginTop: "-1rem" }}>
              Job Post Image (url)
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="category" style={{ marginTop: "-1rem" }}>
              Application Deadline
            </label>
            <input
              type="date"
              style={{ width: "100%" }}
              className="Input"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="category" style={{ marginTop: "-1rem" }}>
              Date Posted
            </label>
            <input
              type="date"
              style={{ width: "100%" }}
              className="Input"
              value={editDatePosted}
              onChange={(e) => setEditDatePosted(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {option === "edit" && (
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditCareer;
