import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import assets from "../../assets/assets.js";
import "./Profile.css";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi Everyone, I am Using QuickChat");

  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const handleCropComplete = (blob) => {
    setCroppedImage(URL.createObjectURL(blob));
    setShowCropper(false);
  };

  return (
    <div className="profileContainer">
      <div className="profileWrapper">
        {/* LEFT */}
        <form onSubmit={handleSubmit} className="profileForm">
          <h3>Profile Details</h3>
          <label htmlFor="avatar" className="personalAvatar">
            <input
              onChange={handleFileChange}
              type="file"
              id="avatar"
              accept="image/*"
              hidden
            />
            <img
              src={
                croppedImage
                  ? croppedImage
                  : selectedImage
                  ? selectedImage
                  : assets.avatar_icon
              }
              alt="image"
              className="personalAvatarImage"
            />
            Upload Photo
          </label>

          <input
            type="text"
            required
            placeholder="Your name"
            className="personalName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            rows={4}
            placeholder="Write bio"
            className="personalBio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          <button type="submit" className="formSubmitBtn">
            Save
          </button>
        </form>

        {showCropper && (
          <div className="cropperModal">
            <ImageCropper
              imageSrc={selectedImage}
              onComplete={handleCropComplete}
            />
          </div>
        )}

        {/* RIGHT */}
        <img src={assets.logo_icon} alt="image" className="appLogo" />
      </div>
    </div>
  );
};

export default Profile;
