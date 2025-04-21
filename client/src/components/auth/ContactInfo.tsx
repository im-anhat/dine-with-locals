import React, { useState, useEffect } from 'react';
import ProcessBar from './ProcessBar';
import { useUserContext } from '../../hooks/auth/useUserContext';

function ContactInfo() {
  const { user, setUser } = useUserContext(); //setUser is used to update the user object
  //user is the user object that is passed from the parent component
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [socialLink, setSocialLink] = useState<string>('');

  const setInfo = () => {
    const newUser = { ...user, phone: phoneNumber, socialLink: socialLink };
    console.log('This is new user', newUser);
    setUser(newUser);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Social Link"
        value={socialLink}
        onChange={(e) => setSocialLink(e.target.value)}
      />
      <button onClick={() => setInfo()}>Save</button>
    </div>
  );
}

export default ContactInfo;
