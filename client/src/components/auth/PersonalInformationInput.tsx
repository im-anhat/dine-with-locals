import React, { useState } from 'react';
import { useStep } from '../../hooks/auth/useStep';
import { z } from 'zod';

type Ethnicity = 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
interface PersonalInformationInputProps {
  user: {
    role: 'Host' | 'Guest';
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    password: string;
    userName: string;
  };
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setStreetAddress: (streetAddress: string) => void;
  setZipNumber: (zipNumber: string) => void;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  setPhone: (phoneNumber: string) => void;
}

function PersonalInformationInput({
  user,
  setFirstName,
  setLastName,
  setStreetAddress,
  setZipNumber,
  setCity,
  setCountry,
  setPhone,
}: PersonalInformationInputProps) {
  const { goNext } = useStep();

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
            value={user.address}
            onChange={(e) => setStreetAddress(e.target.value)}
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
