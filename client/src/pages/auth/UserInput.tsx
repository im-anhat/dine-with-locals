import React, { useState } from 'react';
import { useStep } from '../../hooks/auth/useStep';
import RoleSelection from '../../components/auth/RoleSelection';
import AuthenticateInput from '../../components/auth/AuthenticateInput';
import PersonalInformationInput from '../../components/auth/PersonalInformationInput';

function UserInput() {
  const { currentStep: step } = useStep();
  type Role = 'Host' | 'Guest';
  const [role, setRole] = useState<Role>('Guest');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [locationId, setLocationId] = useState('');
  const avatar =
    'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';

  const user = {
    role,
    firstName,
    lastName,
    phone,
    password,
    userName,
    locationId,
    avatar,
  };
  const location = {
    address,
    city,
    state,
    country,
    zipCode,
  };

  //Record as component
  const stepToComponent: Record<number, React.JSX.Element> = {
    1: <RoleSelection setRole={setRole} />,
    2: (
      <PersonalInformationInput
        user={user}
        location={location}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setStreetAddress={setAddress}
        setZipNumber={setZipCode}
        setCity={setCity}
        setCountry={setCountry}
        setPhone={setPhone}
        setState={setState}
        setLocationId={setLocationId}
      />
    ),
    3: (
      <AuthenticateInput
        user={user}
        location={location}
        setPassword={setPassword}
        setUserName={setUserName}
      />
    ),
  };
  //? : Will happen if stepToComponent[currentStep] is true
  return <div>{stepToComponent[step] ? stepToComponent[step] : null}</div>;
}

export default UserInput;
