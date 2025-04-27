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
    <div className="w-[100%] min-w-50% bg-white mb-10 pt-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Personal Information
      </h1>{' '}
      <div className="flex flex-col gap-4 mb-6 ">
        <div className="flex justify-between gap-4 w-[50%]">
          <div>
            <label className="block text-gray-500 text-sm" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-900"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-sm" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
            />
          </div>

          <div>
            <label
              className="block text-gray-500 text-sm"
              htmlFor="ethnicities"
            >
              Ethnicity
            </label>
            <select
              name="ethnicities"
              className="px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
            >
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
          </div>
        </div>
        {hobbies.length != 0 ? (
          <div className="mb-6 flex flex-wrap gap-4 max-w-md">
            {/* validate only 10 hobbies */}
            {hobbies.map((hobby, index) => (
              <div
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2"
              >
                {/* each element in a list should have a unique key prop in React. */}
                <span>{hobby}</span>
                <button
                  onClick={() =>
                    setHobbies(
                      hobbies.filter((currHobby) => currHobby !== hobby),
                    )
                  }
                >
                  x
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div>
          <label htmlFor="hobbies" className="block text-gray-500 text-sm">
            Hobbies
          </label>
          <input
            type="text"
            value={hobby}
            name="hobbies"
            onChange={(e) => setHobby(e.target.value)}
            onKeyDown={handleAddHobby} //Call this function everytime user enter any key, check for if they enter Enter key
            placeholder="Press Enter to add your hobbies"
            className="w-[50%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <button onClick={() => setInfo()}>Save</button>
      </div>
    </div>
  );
}

export default PersonalInformationInput;
