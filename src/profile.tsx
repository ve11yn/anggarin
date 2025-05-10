// Profile.tsx
import React, { useState } from 'react';
import './profile.css';
import { useNavigate } from 'react-router-dom';


const Profile: React.FC = () => {
  const navigate = useNavigate();
  // Initial user data
  const [formData, setFormData] = useState({
    id: "USR123456",
    name: "Anthony Webb",
    password: "********",
    email: "myemail@address.com",
    phone: "",
    location: "",
    organization: "",
    department: "",
    position: "",
    description: "",
  });

  // Data being edited
  const [editData, setEditData] = useState({ ...formData });
  const [editing, setEditing] = useState(false);

  // Update the form field when user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };


  // Save the changes
  const handleSave = () => {
    setFormData({ ...editData });
    setEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData({ ...formData });
    setEditing(false);
  };

  // Enter edit mode
  const handleEdit = () => setEditing(true);

  const [profileImage, setProfileImage] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setProfileImage(fileURL);
  }
};


  return (
    <div className="profile-container">
      <button
        className="profile-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ←
      </button>

      <div className="profile-box">
        {/* Left column with picture and ID */}
        <div className="profile-left">
          <div>
            <div className="profile-picture">
              {profileImage ? <img src={profileImage} alt="Profile" /> : null}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profileImageInput"
            />
            <label htmlFor="profileImageInput" className="profile-picture-button">
              Change Picture
            </label>
          </div>
          <p className="profile-id">ID: {formData.id}</p>
        </div>

        {/* Right column form area */}
        <form onSubmit={(e) => e.preventDefault()} className="profile-right">
          {[
            "name",
            "password",
            "email",
            "phone",
            "location",
            "organization",
            "department",
            "position",
          ].map((field) => (
            <div className="profile-field" key={field}>
              <label className="profile-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                className="profile-input"
                type={field === "password" ? "password" : "text"}
                name={field}
                value={editData[field as keyof typeof editData]}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          ))}

          {/* Description spans full width */}
          <div className="profile-field" style={{ gridColumn: "span 2" }}>
            <label className="profile-label">Description</label>
            <textarea
              className="profile-textarea"
              name="description"
              value={editData.description}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          {/* Bottom-right buttons */}
          <div className="profile-buttons">
            {!editing ? (
              <button
                type="button"
                className="profile-button"
                onClick={handleEdit}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="profile-button cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="profile-button"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
