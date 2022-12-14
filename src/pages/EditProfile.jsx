import React from "react";
import { WithRouter } from "../utils/Navigation";
import Layout from "../components/Layout";
import { CustomButtonSatu } from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { CustomComment } from "../components/CustomComment";
import { InputImage } from "../components/CustomComment";
import { Link } from "react-router-dom";
import { useTitle } from "../utils/redux/useTitle";
import withReactContent from "sweetalert2-react-content";
import Swal from "../utils/Swal";

import { handleAuth } from "../utils/redux/reducers/reducer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

function EditProfile() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const disspath = useDispatch();
  const [objSubmit, setObjSubmit] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [images, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useTitle("Edit Profile");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios
      .get("users", {})
      .then((res) => {
        console.log(res);
        const { name, phone, address, email, password, bio, images } = res.data.data;
        setImage(images);
        setName(name);
        setPhone(phone);
        setAddress(address);
        setEmail(email);
        setPassword(password);
        setBio(bio);
      })
      .catch((err) => {
        const { message } = err.response.data;
        MySwal.fire({
          title: "Failed",
          text: message,
          showCancelButton: false,
        });
      })
      .finally(() => setLoading(false));
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    for (const key in objSubmit) {
      formData.append(key, objSubmit[key]);
    }
    axios
      .put("users", objSubmit)
      .then((res) => {
        console.log(res);
        const { message } = res.data;
        alert(message);
        setObjSubmit({});
        navigate("/profile");
      })
      .catch((err) => {
        const { message } = err.response.data;
        MySwal.fire({
          title: "Failed",
          text: message,
          showCancelButton: false,
        });
      })
      .finally(() => fetchData());
  };

  const handleChange = (value, key) => {
    let temp = { ...objSubmit };
    temp[key] = value;
    setObjSubmit(temp);
  };

  const fotoProfil = {
    width: "8em",
    height: "8em",
    borderRadius: "100%",
  };

  if (loading) {
    return <div>Loading masse...</div>;
  } else {
    return (
      <Layout>
        <form className="lg:flex flex-row text-poppins text-white py-20" onSubmit={(e) => handleSubmit(e)}>
          <div className="lg:basis-1/4 lg:mr-2">
            <div className="flex justify-center items-center">
              <div className="mb-2" style={fotoProfil}>
                <InputImage
                  images={images}
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => {
                    setImage(URL.createObjectURL(e.target.files[0]));
                    handleChange(e.target.files[0], "images");
                  }}
                />
              </div>
            </div>
            <div className="w-full h-2/3">
              <CustomComment rows={10} cols={30} value={bio} onChange={(e) => handleChange(e.target.value, "bio")} />
              <div>
                <div className="flex mb-1">
                  <div className="w-full mr-1">
                    <Link to="/profile">
                      <CustomButtonSatu label="Cancel" />
                    </Link>
                  </div>
                  <div className="w-full ml-1">
                    <CustomButtonSatu label="Save" id="btn-save" loading={loading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:basis-3/4 flex flex-col justify-centerr">
            <div className="bg-bgdasar px-20 py-5">
              <div className="my-3">
                <div>
                  <h4>Name</h4>
                  <CustomInput value={name} type="text" id="editNama" onChange={(e) => handleChange(e.target.value, "name")} />
                </div>
              </div>
              <div className="my-3">
                <div>
                  <h4>Phone Number</h4>
                  <CustomInput value={phone} type="number" id="editNumber" onChange={(e) => handleChange(e.target.value, "phone")} />
                </div>
              </div>
              <div className="my-3">
                <div>
                  <h4>Addres</h4>
                  <CustomInput value={address} type="text" id="editAddres" onChange={(e) => handleChange(e.target.value, "address")} />
                </div>
              </div>
              <div className="my-3">
                <div>
                  <h4>Email</h4>
                  <CustomInput value={email} type="email" id="editEmail" onChange={(e) => handleChange(e.target.value, "email")} />
                </div>
              </div>
              <div className="my-3">
                <div>
                  <h4>Password</h4>
                  <CustomInput value={password} type="password" id="editPassword" onChange={(e) => handleChange(e.target.value, "password")} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    );
  }
}
export default WithRouter(EditProfile);
