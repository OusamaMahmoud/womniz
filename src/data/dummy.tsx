import { RiAccountCircleLine } from "react-icons/ri";
import { IoBagRemoveOutline } from "react-icons/io5";
import { LuBox } from "react-icons/lu";
import { PiHairDryer } from "react-icons/pi";
import { PiCodesandboxLogoThin } from "react-icons/pi";

export const links = [
  {
    title: "Accounts",
    icon: <RiAccountCircleLine />,
    links: [
      {
        name: "admins",
      },
      {
        name: "Customers",
      },
      {
        name: "Vendors",
      },
    ],
  },

  {
    title: "Products",
    icon: <IoBagRemoveOutline />,
    links: [
      {
        name: "orders",
      },
      {
        name: "employees",
      },
      {
        name: "customers",
      },
    ],
  },
  {
    title: "Orders",
    icon: <LuBox />,
    links: [
      {
        name: "orders",
      },
      {
        name: "employees",
      },
      {
        name: "customers",
      },
    ],
  },
  {
    title: "Salons",
    icon: <PiHairDryer />,
    links: [
      {
        name: "orders",
      },
      {
        name: "employees",
      },
      {
        name: "customers",
      },
    ],
  },
  {
    title: "Games",
    icon: <PiCodesandboxLogoThin />,
    links: [
      {
        name: "orders",
      },
      {
        name: "employees",
      },
      {
        name: "customers",
      },
    ],
  },
];

export const admins = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    age: 30,
    location: "New York",
    category: "Orders and Discount Management",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    age: 35,
    location: "Los Angeles",
    category: "Orders and Discount Management",
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1122334455",
    age: 25,
    location: "Chicago",
    category: "Admin",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Robert Brown",
    email: "robert.brown@example.com",
    phone: "+1555666777",
    age: 40,
    location: "Houston",
    category: "Account Management",
    status: "Active",
  },
  {
    id: 5,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    phone: "+1444333222",
    age: 28,
    location: "Seattle",
    category: "Account Management",
    status: "Active",
  },
  {
    id: 6,
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "+1777888999",
    age: 45,
    location: "Miami",
    category: "Salons Management",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Jessica Rodriguez",
    email: "jessica.rodriguez@example.com",
    phone: "+1666777888",
    age: 32,
    location: "San Francisco",
    category: "Jewellery Management",
    status: "Active",
  },
  {
    id: 8,
    name: "Daniel Martinez",
    email: "daniel.martinez@example.com",
    phone: "+1333444555",
    age: 38,
    location: "Dallas",
    category: "Admin",
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Taylor",
    email: "olivia.taylor@example.com",
    phone: "+1999888777",
    age: 27,
    location: "Boston",
    category: "Super Products Management",
    status: "Inactive",
  },
  {
    id: 10,
    name: "William Anderson",
    email: "william.anderson@example.com",
    phone: "+1888999000",
    age: 33,
    location: "Philadelphia",
    category: "Products Management",
    status: "Active",
  },
];
