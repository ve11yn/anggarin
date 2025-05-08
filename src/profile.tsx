// Profile.tsx
import React, { useState } from 'react';
import './profile.css';

const Profile: React.FC = () => {
  // Initial user data
  const [formData, setFormData] = useState({
    id: 'USR123456',
    name: 'Anthony Webb',
    password: '********',
    email: 'myemail@address.com',
    phone: '',
    location: '',
    organization: '',
    department: '',
    position: '',
    description: ''
  });

  // Data being edited
  const [editData, setEditData] = useState({ ...formData });
  const [editing, setEditing] = useState(false);

  // Update the form field when user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* Left column with picture and ID */}
        <div className="profile-left">
          <div className="profile-picture"></div>
          <button className="profile-button" type="button">Change Picture</button>
          <p className="profile-id">ID: {formData.id}</p>
        </div>

        {/* Right column with form fields */}
        <div className="profile-right">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Loop through all fields except description */}
            {['name', 'password', 'email', 'phone', 'location', 'organization', 'department', 'position'].map((field) => (
              <div className="profile-field" key={field}>
                <label className="profile-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className="profile-input"
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={editData[field as keyof typeof editData]}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            ))}

            {/* Description spans full width */}
            <div className="profile-field" style={{ gridColumn: 'span 2' }}>
              <label className="profile-label">Description</label>
              <textarea
                className="profile-textarea"
                name="description"
                value={editData.description}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            {/* Bottom right buttons */}
            <div className="profile-buttons">
              {!editing ? (
                <button type="button" className="profile-button" onClick={handleEdit}>Edit</button>
              ) : (
                <>
                  <button type="button" className="profile-button cancel" onClick={handleCancel}>Cancel</button>
                  <button type="button" className="profile-button" onClick={handleSave}>Save</button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
