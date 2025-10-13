import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { connectDB } from './mongodb';
import { Room } from './interfaces/room';
import { RoomService } from './services/room';
import { User } from './interfaces/user';
import { UserService } from './services/users';
import { ContactMessage } from './interfaces/messages';
import { ContactMessagesService } from './services/contactmessages';
import { Booking } from './interfaces/booking';
import { BookingService } from './services/booking';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { UserModel } from './models/user';

dotenv.config();

const NumBookings = 50;
const NumContacts = 15;
const NumRooms = 50;
const NumUsers = 20;

connectDB().catch(error => console.log(error));

const run = async () => {
    await mongoose.connection.dropDatabase();

    // Seeding ContactMessages
    const CreatedContact: ContactMessage[] = [];
    const contactService = new ContactMessagesService();

    for (let i = 0; i < NumContacts; i++) {
        const DataContact: ContactMessage = {
            id: faker.number.int(),
            date: faker.date.past(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            subject: faker.lorem.sentence(),
            comment: faker.lorem.sentence(),
            action: Math.random() < 0.5 ? "publish" : "archived",
        };

        const NewContact = await contactService.add(DataContact);
        CreatedContact.push(NewContact);
    }

    // Seeding Rooms
const CreatedRoom: Room[] = [];
const roomService = new RoomService();
const amenities: string[] = ['Air conditioner', 'High speed WiFi', 'Breakfast', 'Kitchen', 'Cleaning', 'Shower', 'Grocery', 'Shop Near', 'Towels', 'TV', 'Beach views'];

for (let i = 0; i < NumRooms; i++) {
    const DataRoom: Room = {
        _id: new mongoose.Types.ObjectId(), 
        name: `Room ${i + 1}`, 
        photo: faker.image.url(), 
        number: faker.number.int({ min: 1, max: 100 }).toString(), 
        bedType: faker.helpers.arrayElement(['Single', 'Double', 'Queen', 'King']), 
        amenities: faker.helpers.arrayElements(amenities, { min: 1, max: 5 }),
        rate: faker.number.int({ min: 10, max: 500 }), 
        offerPrice: faker.number.int({ min: 5, max: 400 }), 
        status: Math.random() < 0.5 ? 'Available' : 'Booked', 
        roomFloor: faker.number.int({ min: 1, max: 5 }).toString(),
        id: 0
    };

    const NewRoom = await roomService.add(DataRoom);
    CreatedRoom.push(NewRoom);
}

    // Seeding Users
    const CreatedUser: User[] = [];
    const userService = new UserService();

    for (let i = 0; i < NumUsers; i++) {
        const password = faker.internet.password();
        const passwordHashed = await bcrypt.hash(password, 10);

        const DataUser: User = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            photo: faker.image.url(),
            startDate: faker.date.past(),
            description: faker.lorem.sentence(),
            contact: faker.phone.number(),
            status: "ACTIVE",
            password: passwordHashed,
            id: 0,
        };

        const NewUser = await userService.add(DataUser);
        CreatedUser.push(NewUser);
    }

    // Usuario administrador por defecto
    async function seedAdminUser() {
        const adminPassword = 'Admin123!';
        const adminHashedPassword = await bcrypt.hash(adminPassword, 10);  
        const adminUser = new UserModel({
            name: 'Admin User',
            email: 'admin@miranda.com',
            photo: faker.image.url(),
            description: 'System Administrator',
            startDate: new Date(),
            status: "ACTIVE",
            password: adminHashedPassword,  
            contact: faker.phone.number(),
        });
    
        try {
            await adminUser.save();  
            console.log('Admin user created successfully');
            console.log('Email: admin@miranda.com');
            console.log('Password: Admin123!');
        } catch (error) {
            console.error('Error creating admin user:', error);
        }
    }
    seedAdminUser();
  
    // Seeding Bookings
    const CreatedBooking: Booking[] = [];
    const bookingService = new BookingService();
    
    for (let i = 0; i < NumBookings; i++) {
        const orderDate: Date = faker.date.between({ from: '2024-01-01T00:00:00.000Z', to: '2024-12-31T00:00:00.000Z' });
        const checkInDate: Date = new Date(orderDate);
        checkInDate.setDate(orderDate.getDate() + faker.number.int({ min: 1, max: 10 }));
        const checkOutDate: Date = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + faker.number.int({ min: 2, max: 20 }));
        const room: any = CreatedRoom[Math.floor(Math.random() * CreatedRoom.length)];
        const roomId = room._id;
        const roomType: string = room.bedType; 
        const roomNumber: number = parseInt(room.number); 
      
        const DataBooking: Booking = {
            id: faker.number.int(), 
            roomId: roomId,
            Name: `Booking ${faker.number.int({ min: 0, max: 999 })}`,
            OrderDate: orderDate,
            CheckIn: checkInDate,
            CheckOut: checkOutDate,
            SpecialRequest: faker.lorem.sentence(),
            RoomType: roomType,
            RoomNumber: roomNumber,
            Status: faker.helpers.arrayElement(["In Progress", "Check In", "Check Out"]),
        };
    
        const NewBooking = await bookingService.addBooking(DataBooking); 
        CreatedBooking.push(NewBooking);
}

console.log('Seed data inserted successfully');
await mongoose.connection.close();
};

run().catch(error => console.log(error));
