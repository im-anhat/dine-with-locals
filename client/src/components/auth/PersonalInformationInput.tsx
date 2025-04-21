import React from 'react';

function PersonalInformationInput() {
  return (
    <div>
      <div>
        <label htmlFor="first-name">First Name</label>
        <input type="text" id="first-name" name="first-name" required />
      </div>
      <div>
        <label htmlFor="lastname-name">First Name</label>
        <input type="text" id="first-name" name="first-name" required />
      </div>
    </div>
  );
}

export default PersonalInformationInput;
