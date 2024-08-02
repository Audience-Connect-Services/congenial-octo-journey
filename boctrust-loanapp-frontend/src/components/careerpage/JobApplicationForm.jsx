/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Career.css";
import PageLoader from "../dashboard/shared/PageLoader";

const JobApplicationForm = () => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    vacancy: location.state ? location.state.vacancy : null,
  });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.vacancy) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vacancy: location.state.vacancy,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("coverLetter", formData.coverLetter);
    form.append("resume", formData.resume);
    form.append("vacancy", JSON.stringify(formData.vacancy));

    console.log("FormData", formData);
    try {
       
       const response = await axios.post(`${apiUrl}/api/job-application/apply`, form, {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       });

      if (response.status === 201) {
        setMessage("Application submitted successfully!");
        setProcessing(false);

        // clear form 
        setFormData({
          name: "",
          email: "",
          phone: "",
          coverLetter: "",
          resume: null,
          vacancy: formData.vacancy,
        });

        // navigate to career page after 3 seconds
        setTimeout(() => {
          navigate("/careers");
        }, 3000);
      } else {
        setProcessing(false);
        alert("There was an error submitting the application!");
        
      }
    } catch (error) {
      setProcessing(false);
      alert("There was an error submitting the application!");
   
     }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full-Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Cover Letter:
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          required
          rows={8}
        ></textarea>
      </label>
      <label>
        Resume:
        <input type="file" name="resume" onChange={handleChange} required />
      </label>
      {processing && <PageLoader />}
      <p className="message">{message}</p>
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default JobApplicationForm;
