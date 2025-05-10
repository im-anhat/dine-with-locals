import React, { useState } from 'react';
import { useStep } from '../../hooks/auth/useStep';
import RoleSelection from '../../components/auth/RoleSelection';
import AuthenticateInput from '../../components/auth/AuthenticateInput';
import PersonalInformationInput from '../../components/auth/PersonalInformationInput';
import { User } from '../../../../shared/types/User';

function UserInput() {
  const { currentStep: step } = useStep();
  type Ethnicity = 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  type Role = 'Host' | 'Guest';
  const [role, setRole] = useState<Role>('Guest');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [ethnicity, setEthnicity] = useState<Ethnicity>('Asian');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobby, setHobby] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [zipNumber, setZipNumber] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [socialLink, setSocialLink] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const user = {
    firstName,
    lastName,
    ethnicity,
    hobby,
    hobbies,
    phone,
    socialLink,
    role,
    streetAddress,
    zipNumber,
    city,
    country,
    password,
    userName,
  };

  //Record as component
  const stepToComponent: Record<number, React.JSX.Element> = {
    1: <RoleSelection setRole={setRole} />,
    2: (
      <PersonalInformationInput
        user={user}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEthnicity={setEthnicity}
        setHobbies={setHobbies}
        setHobby={setHobby}
        setStreetAddress={setStreetAddress}
        setZipNumber={setZipNumber}
        setCity={setCity}
        setCountry={setCountry}
        setPhone={setPhone}
        setSocialLink={setSocialLink}
      />
    ),
    3: (
      <AuthenticateInput
        user={user}
        setPassword={setPassword}
        setUserName={setUserName}
      />
    ),
  };
  //? : Will happen if stepToComponent[currentStep] is true
  return <div>{stepToComponent[step] ? stepToComponent[step] : null}</div>;
}

export default UserInput;
