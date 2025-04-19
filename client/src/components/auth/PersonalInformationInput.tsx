import React from 'react';
import 

function PersonalInformationInput() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [ethnicity, setEthnicity] = React.useState('');
  const [hobbies, setHobbies] = React.useState([]);

  //Dung useEffect dđể lấy data từ trong local storage everytime restart the page.
  //Lúc nào cũng cần 
  //Empty dependency array --> load every time the web reload
  //No dependcy array --> Run non stop
  const setInfo = () => {

  };
  return (
    <div>
      <input type="text" placeholder="First Name" />
      <input type="text" placeholder="Last Name" />
      <input type="text" placeholder="Ethnicity" />
      <input type="text" placeholder="Hobbies" />
      <button onClick={() => setInfo()}>Save</button>
    </div>
  );
}

export default PersonalInformationInput;
