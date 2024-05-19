import React, { useState, useEffect } from "react";
import { admins } from "../data/dummy";
import { BiExport, BiPlusCircle, BiTrash } from "react-icons/bi";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  location: string;
  category: string;
  status: string;
  photo?: string; // Add photo to the Admin interface
}

const Admins: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(admins);
  const [selectedAdmins, setSelectedAdmins] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const filtered = admins.filter((admin) => {
      const matchesSearch = admin.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesCategory = selectedCategory
        ? admin.category === selectedCategory
        : true;
      const matchesStatus = selectedStatus
        ? admin.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredAdmins(filtered);
  }, [searchValue, selectedCategory, selectedStatus]);

  const handleDeleteButton = () => {
    const newAdmins = filteredAdmins.filter(
      (admin) => !selectedAdmins.has(admin.id)
    );
    setFilteredAdmins(newAdmins);
    setSelectedAdmins(new Set());
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedAdmins((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewAdmin({});
    setPhotoPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAdmin((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newId = Math.max(...admins.map((a) => a.id)) + 1;
    const newAdminData = { ...newAdmin, id: newId } as Admin;
    setFilteredAdmins((prev) => [...prev, newAdminData]);
    closeModal();
  };

  return (
    <div className="overflow-x-scroll p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-medium text-4xl capitalize">Admins Details</h1>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" onClick={openModal}>
            <BiPlusCircle className="text-xl" /> Add Admin Account
          </button>
          <button
            onClick={handleDeleteButton}
            className="btn btn-outline"
            disabled={selectedAdmins.size === 0}
          >
            <BiTrash className="text-lg" /> Delete
          </button>
          <button className="btn btn-outline">
            <BiExport /> Export
          </button>
        </div>
      </div>
      <div className="my-6 flex items-center gap-3">
        <div className="form-control">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="grow"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option disabled selected>
              Select Category
            </option>
            <option value="Account Management">Account Management</option>
            <option value="Products Management">Products Management</option>
            <option value="Jewellery Management">Jewellery Management</option>
            <option value="Salons Management">Salons Management</option>
            <option value="Orders and Discount Management">
              Orders and Discount Management
            </option>
          </select>
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            <option disabled selected>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" disabled />
              </label>
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Location</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((admin: Admin) => (
            <tr key={admin.id}>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedAdmins.has(admin.id)}
                    onChange={() => handleCheckboxChange(admin.id)}
                  />
                </label>
              </th>
              <td>{admin.id}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.phone}</td>
              <td>{admin.age}</td>
              <td>{admin.location}</td>
              <td>{admin.category}</td>
              <td>{admin.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Admin Account</h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  className="input input-bordered"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  name="age"
                  className="input input-bordered"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input input-bordered"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered"
                  onChange={handleInputChange}
                >
                  <option disabled selected>
                    Select Category
                  </option>
                  <option value="Account Management">Account Management</option>
                  <option value="Products Management">
                    Products Management
                  </option>
                  <option value="Jewellery Management">
                    Jewellery Management
                  </option>
                  <option value="Salons Management">Salons Management</option>
                  <option value="Orders and Discount Management">
                    Orders and Discount Management
                  </option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  name="status"
                  className="select select-bordered"
                  onChange={handleInputChange}
                >
                  <option disabled selected>
                    Select Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered"
                  onChange={handleFileChange}
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleSubmit}>
                Add Admin
              </button>
              <button className="btn btn-outline" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
