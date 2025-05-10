import React, { useState } from 'react';
import { useStep } from '../../hooks/auth/useStep';
import { z } from 'zod';

type Ethnicity = 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
interface PersonalInformationInputProps {
  user: {
    role: 'Host' | 'Guest';
    firstName: string;
    lastName: string;
    hobby: string;
    hobbies: string[];
    phone: string;
    socialLink: string;
  };
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEthnicity: (ethnicities: Ethnicity) => void;
  setHobbies: (hobbies: string[]) => void;
  setHobby: (hobby: string) => void;
  setStreetAddress: (streetAddress: string) => void;
  setZipNumber: (zipNumber: string) => void;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  setPhone: (phoneNumber: string) => void;
  setSocialLink: (socialLink: string) => void;
}

function PersonalInformationInput({
  user,
  setFirstName,
  setLastName,
  setEthnicity,
  setHobbies,
  setHobby,
  setStreetAddress,
  setZipNumber,
  setCity,
  setCountry,
  setPhone,
  setSocialLink,
}: PersonalInformationInputProps) {
  const { goNext } = useStep();

  /**
   * Handle the hobby input and add a hobby to the list. In JavaScript, arrays are just another kind of object, you should treat arrays in React state as read-only
   * This means that you shouldn’t reassign items inside an array like arr[0] = 'bird' nor use methods that mutate the array: push() and pop().
   * To update an array in React: pass a new array to setState function
   * => Create a new array from the original array in your state by calling its non-mutating methods: filter() and map()
   */
  const handleAddHobby = (e: React.KeyboardEvent) => {
    //If the user press Enter and the the current input in the input box is not empty
    console.log(user.hobby);
    if (e.key === 'Enter' && user.hobby.trim() !== '') {
      setHobbies([...user.hobbies, user.hobby]); //Add the current input to the list of hobbies
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
              placeholder="Dan"
              name="firstName"
              value={user.firstName}
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
              placeholder="Nguyen"
              value={user.lastName}
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
            value={user.hobby}
            name="hobbies"
            onChange={(e) => setHobby(e.target.value)}
            onKeyDown={handleAddHobby} //Call this function everytime user enter any key, check for if they enter Enter key
            placeholder="Press Enter key to add your hobbies"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
          {/* Hobbies Display */}
          {user.hobbies.length != 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {/* validate only 10 hobbies */}
              {user.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="bg-brand-teal-100 px-4 py-1 rounded-md flex items-center gap-2"
                >
                  {/* each element in a list should have a unique key prop in React. */}
                  <span>{hobby}</span>
                  <button
                    onClick={() =>
                      setHobbies(
                        user.hobbies.filter((currHobby) => currHobby !== hobby),
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
            value={user.phone}
            onChange={(e) => setPhone(e.target.value)}
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
            value={user.socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <button
          onClick={() => {
            goNext();
            console.log(user);
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
