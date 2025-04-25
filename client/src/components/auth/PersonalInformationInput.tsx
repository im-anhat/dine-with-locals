import React, { useState } from 'react';
import { useUserContext } from '../../hooks/auth/useUserContext';
import { set } from 'mongoose';

function PersonalInformationInput() {
  //Dung useEffect dđể lấy data từ trong local storage everytime restart the page.
  //Lúc nào cũng cần
  //Empty dependency array --> load every time the web reload
  //No dependcy array --> Run non stop
  // const setInfo = () => {

  type Ethnicity = 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  const { user, setUser } = useUserContext();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [ethnicity, setEthnicity] = useState<Ethnicity>('Asian');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobby, setHobby] = useState<string>('');
  const setInfo = () => {
    const newUser = {
      ...user,
      firstName: firstName,
      lastName: lastName,
      ethnicity: ethnicity,
      hobbies: hobbies,
    };
    setUser(newUser);
  };
  // Handle the hobby input and add a hobby to the list
  //In JavaScript, arrays are just another kind of object.
  //you should treat arrays in React state as read-only
  //This means that you shouldn’t reassign items inside an array like arr[0] = 'bird',
  // and you also shouldn’t use methods that mutate the array, such as push() and pop().

  //Every time you want to update an array, you’ll want to pass a new array to your state setting function
  //you can create a new array from the original array in your state by calling its non-mutating methods like filter() and map()
  const handleAddHobby = (e: React.KeyboardEvent) => {
    //If the user press Enter and the the current input in the input box is not empty
    if (e.key === 'Enter' && hobby.trim() !== '') {
      setHobbies([...hobbies, hobby]); //Add the current input to the list of hobbies
      setHobby('');
    }
  };
  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
        }}
      />
      <select name="ethnicities">
        <option value="">Select</option>
        <option
          value="Asian"
          onClick={() => {
            setEthnicity('Asian');
          }}
        >
          Asian
        </option>
        <option
          value="Black"
          onClick={() => {
            setEthnicity('Black');
          }}
        >
          Black
        </option>
        <option
          value="Hispanic"
          onClick={() => {
            setEthnicity('Hispanic');
          }}
        >
          Hispanic
        </option>
        <option
          value="White"
          onClick={() => {
            setEthnicity('White');
          }}
        >
          White
        </option>
        <option
          value="Other"
          onClick={() => {
            setEthnicity('Other');
          }}
        >
          Other
        </option>
      </select>

      <div>
        {hobbies.map((hobby, index) => (
          <div key={index}>
            {/* each element in a list should have a unique key prop in React. */}
            <span>{hobby}</span>
            <button
              onClick={() =>
                setHobbies(hobbies.filter((currHobby) => currHobby !== hobby))
              }
            >
              x
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={hobby}
        onChange={(e) => setHobby(e.target.value)}
        onKeyDown={handleAddHobby} //Call this function everytime user enter any key, check for if they enter Enter key
        placeholder="Press Enter to add your hobbies"
      />
      <button onClick={() => setInfo()}>Save</button>
    </div>
  );
}

export default PersonalInformationInput;
