enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface AuthProvider {
  id: number;
  userId: number;
  provider: string; 
  providerId: string; 
  createdAt: Date;
  updatedAt: Date;
}

interface UserRole {
  id: number;
  role: Role;
  userId: number;
}

interface User {
  id: number;
  email: string;
  uniqueId: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  authProviders?: AuthProvider[];
  roles: UserRole[];
}