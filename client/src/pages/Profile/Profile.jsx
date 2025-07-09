import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImageCropper from "../../components/ImageCropper/ImageCropper";
import AuthContext from "../../../context/authContext.js";
import assets from "../../assets/assets.js";
import Spinner from "../../components/Spinner/spinner.jsx";
import "./Profile.css";

const Profile = () => {
  const { authUser, updateUserProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start spinner

    try {
      if (!croppedImage) {
        await updateUserProfile({ fullName: name, bio });
        navigate("/");
        return;
      }
      const base64Image = await readFileAsDataURL(croppedImage);
      await updateUserProfile({ fullName: name, bio, profilePic: base64Image });
      navigate("/");
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  // function to read file as data URL that can be sent to the server
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const handleCropComplete = (blob) => {
    setCroppedImage(blob);
    setCroppedImageUrl(URL.createObjectURL(blob));
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
                  ? croppedImageUrl
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

          <button type="submit" className="formSubmitBtn" disabled={loading}>
            {loading ? (
              <>
                Saving...
                <span className="spinnerWrapper">
                  <Spinner />
                </span>
              </>
            ) : (
              "Save"
            )}
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
        <img
          src={authUser?.profilePic || assets.logo_icon}
          alt="image"
          className="appLogo"
        />
      </div>
    </div>
  );
};

export default Profile;
