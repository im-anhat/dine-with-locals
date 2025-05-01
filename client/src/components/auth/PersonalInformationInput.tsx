import React, { useState } from 'react';
import { useUserContext } from '../../hooks/auth/useUserContext';
import { useStep } from '../../hooks/auth/useStep';
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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [socialLink, setSocialLink] = useState<string>('');
  const { goNext } = useStep();
  const setInfo = () => {
    const newUser = {
      ...user,
      firstName: firstName,
      lastName: lastName,
      ethnicity: ethnicity,
      hobbies: hobbies,
      phone: phoneNumber,
      socialLink: socialLink,
    };
    setUser(newUser);
  };
  /**
   * Handle the hobby input and add a hobby to the list
   * In JavaScript, arrays are just another kind of object, you should treat arrays in React state as read-only
   * This means that you shouldn’t reassign items inside an array like arr[0] = 'bird',
   * and you also shouldn’t use methods that mutate the array, such as push() and pop().
   * Every time you want to update an array, you’ll want to pass a new array to your state setting function
   * you can create a new array from the original array in your state by calling its non-mutating methods
   * like filter() and map()
   */
  const handleAddHobby = (e: React.KeyboardEvent) => {
    //If the user press Enter and the the current input in the input box is not empty
    console.log(hobby);
    if (e.key === 'Enter' && hobby.trim() !== '') {
      setHobbies([...hobbies, hobby]); //Add the current input to the list of hobbies
      setHobby('');
    }
  };
  return (
    <div className="flex flex-row justify-center">
      {/* Align all the components horizontally */}
      <div className="flex flex-col max-w-1/3 gap-2">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Personal Information
          </h1>
        </div>

        {/* First name and Last Name */}
        <div className="flex flex-row gap-4">
          {/* Firstname */}
          <div className="w-full">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-900"
            />
          </div>
          {/* End first name */}
          {/* Lastname */}
          <div className="w-full">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
            />
          </div>
          {/* End last name */}
        </div>
        {/* End first name and last name */}

        <div className="w-full">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
          {/* Hobbies Display */}
          {hobbies.length != 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {/* validate only 10 hobbies */}
              {hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="bg-brand-teal-100 px-4 py-1 rounded-md flex items-center gap-2"
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
        </div>

        {/* Phone Number and Social Links */}
        <div className="w-full">
          <label htmlFor="phone" className="block text-gray-500 text-sm">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <div className="w-full">
          <label htmlFor="social" className="block text-gray-500 text-sm">
            URLs
          </label>
          <input
            type="text"
            name="social"
            placeholder="Social Link"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <button
          onClick={() => {
            setInfo();
            goNext();
          }}
          className="flex justify-center px-4 py-2 mt-2 rounded-full text-white bg-brand-coral-300 border-brand-coral-500 hover:bg-brand-coral-400"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default PersonalInformationInput;
