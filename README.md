## Meeting Room Booking System for Co-working spaces

---

# API Documentation

## Authentication

#### POST - Create New User

- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Access**: `Public`
- **Request Body**:
  ```json
  {
    "name": "Programming Hero",
    "email": "web@programming-hero.com",
    "password": "ph-password",
    "phone": "1234567890",
    "role": "admin", //role can be user or admin
    "address": "123 Main Street, City, Bangladesh"
  }
  ```

#### POST - Login User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: `Public`
- **Request Body**:
  ```json
  {
    "email": "web@programming-hero.com",
    "password": "ph-password"
  }
  ```

---

## Room Management

#### POST - Create Room

- **URL**: `/api/rooms`
- **Method**: `POST`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **Request Body**:
  ```json
  {
    "name": "Meeting Room",
    "roomNo": 1,
    "floorNo": 1,
    "capacity": 20,
    "pricePerSlot": 1000,
    "amenities": ["Projector", "Whiteboard", "AC"]
  }
  ```

#### GET - Get Single Room

- **URL**: `/api/rooms/:id`
- **Method**: `GET`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **URL Like**:
  ```text
  /api/rooms/66696895f953a56fe37fc9f3
  ```

#### GET - Get All Rooms

- **URL**: `/api/rooms`
- **Method**: `GET`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <admin Token>
  ```

#### PUT - Update Room Info

- **URL**: `/api/rooms/:id`
- **Method**: `PUT`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **URL Like**:
  ```text
  /api/rooms/666968573b37b1d14879b04e
  ```
- **Request Body**:
  ```json
  {
    "roomNo": 100
  }
  ```

#### DELETE - Delete Room

- **URL**: `/api/rooms/:id`
- **Method**: `DELETE`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **URL Like**:
  ```text
  /api/rooms/666968573b37b1d14879b04e
  ```

---

## Slot Management

#### POST - Create Slots

- **URL**: `/api/slots`
- **Method**: `POST`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **Request Body**:
  ```json
  {
    "room": "666a7e0e8832b39ed7056bf0", // Room ID
    "date": "2024-06-15",
    "startTime": "01:00",
    "endTime": "04:00"
  }
  ```

#### GET - Get All Slots Availability

- **URL**: `/api/slots/availability`
- **Method**: `GET`
- **Access**: `Public`
- **Query Parameters**:
  ```text
  date: 2024-08-15
  roomId: 6669ab8e0ec5628524c2035d
  ```
- **URL Like**:
  ```text
  /api/slots/availability?date=2024-08-15&roomId=6669ab8e0ec5628524c2035d
  -----or-----
  /api/slots/availability
  ```

---

## Booking Management

#### POST - Create Booking

- **URL**: `/api/bookings`
- **Method**: `POST`
- **Access**: `User`
- **Headers**:
  ```text
  Authorization: Bearer <User Token>
  ```
- **Request Body**:
  ```json
  {
    "date": "2024-08-15",
    "slots": ["666a7e608832b39ed7056bf5", "666a7e608832b39ed7056bf8"],
    "room": "666a7e0e8832b39ed7056bf0",
    "user": "666a7dae8832b39ed7056bea"
  }
  ```

#### GET - Get All Bookings

- **URL**: `/api/bookings`
- **Method**: `GET`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```

#### GET - Get My Bookings

- **URL**: `/api/my-booking`
- **Method**: `GET`
- **Access**: `User`
- **Headers**:
  ```text
  Authorization: Bearer <token>
  ```

#### PUT - Update Booking

- **URL**: `/api/bookings/:id`
- **Method**: `PUT`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **URL Like**:
  ```text
  /api/bookings/666a832c3ad0e42edec5d5c6
  ```
- **Request Body**:
  ```json
  {
    "isConfirmed": "confirmed"
  }
  ```

#### DELETE - Delete Booking

- **URL**: `/api/bookings/:id`
- **Method**: `DELETE`
- **Access**: `Admin`
- **Headers**:
  ```text
  Authorization: Bearer <Admin Token>
  ```
- **URL Like**:
  ```text
  /api/bookings/666a832c3ad0e42edec5d5c6
  ```
