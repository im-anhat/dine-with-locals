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
  setState: (state: string) => void;
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
  setState,
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
        {/* address: string; city: string; state: string; country: string; zipCode:
        string; */}
        <div className="w-full">
          <label htmlFor="address" className="block text-gray-500 text-sm">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="8841 Main Street"
            value={user.address}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>
        <div className="w-full">
          <label htmlFor="city" className="block text-gray-500 text-sm">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="8841 Main Street"
            value={user.city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>
        <div className="w-full">
          <label htmlFor="state" className="block text-gray-500 text-sm">
            State
          </label>
          <input
            type="text"
            name="state"
            placeholder="Virginia"
            value={user.state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
          />
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-32 flex-1">
            <label htmlFor="zipcode" className="block text-gray-500 text-sm">
              ZIP Code
            </label>
            <input
              type="text"
              name="zipcode"
              placeholder="22003"
              value={user.zipCode}
              onChange={(e) => setZipNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
            />
          </div>

          <div className="w-64 flex-2">
            <label htmlFor="country" className="block text-gray-500 text-sm">
              Country
            </label>
            <input
              type="text"
              name="state"
              placeholder="United States"
              value={user.country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-teal-700"
            />
          </div>
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
