This directory has things shared for both frontend and backend. An example is below:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'host' | 'regular';
  email?: string;
}
```

Then in the frontend:

```typescript
import React from 'react';
import { User } from '../../../shared/types/user';

interface UserCardProps {
  user: User;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div>
      {user.firstName} {user.lastName}
    </div>
  );
};

export default UserCard;
```

And backend:

```typescript
import { User } from '../../../shared/types/user';
import { Request, Response } from 'express';

export const getUserProfile = (req: Request, res: Response) => {
  // Pretend we fetched a user from the database
  const user: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'regular',
    email: 'john.doe@example.com',
  };
  res.json(user); // return the user object back to frontend ;)
};
```
