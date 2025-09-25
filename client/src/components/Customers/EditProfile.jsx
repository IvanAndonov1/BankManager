import CustomerSidebar from "../common/CustomerSidebar";
import { useState, useEffect,  useContext } from "react";
import { editMineInfo } from "../../services/userService";
import { AuthContext } from "../../contexts/AuthContext";




export default function EditProfile() {

    const { user } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [homeAddress, setHomeAddress] = useState("");
    const [egn, setEgn] = useState("");

        useEffect(() => {
   if (user) {
       
        setUsername(user.username || "");
        setEmail(user.email || "");
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setDateOfBirth(user.dateOfBirth || "");
        setPhoneNumber(user.phoneNumber || "");
        setHomeAddress(user.homeAddress || "");
        setEgn(user.egn || "");
        }
      }, [user]);
      
    


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      email,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      homeAddress,
      egn
    };

    try {
      const updatedUser = await editMineInfo(user.token, data);
      console.log("Profile updated:", updatedUser);

    
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);
      setDateOfBirth(updatedUser.dateOfBirth);
      setPhoneNumber(updatedUser.phoneNumber);
      setHomeAddress(updatedUser.homeAddress);

    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="min-h-screen max-w-screen flex  bg-white">
      <CustomerSidebar />
      <div className="flex-1 items-center justify-center p-12 space-y-8 ml-12">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
  {/* Left Column */}
  <div className="space-y-6">
    {/* Username (disabled) 👇 */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Username
      </label>
      <input
        value={username}
        disabled
        placeholder="Username"
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@example.com"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        placeholder="Password"
        type="password"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        placeholder="Confirm Password"
        type="password"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
      />
    </div>
  </div>

  {/* Right Column */}
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        First Name
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Last Name
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Date Of Birth
      </label>
      <input
        type="date"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={dateOfBirth || ""}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        type="tel"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+359 88 123 4567"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Home Address
      </label>
      <input
        type="text"
        className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
        value={homeAddress}
        onChange={(e) => setHomeAddress(e.target.value)}
        placeholder="Sofia, bul, Example 1"
      />
    </div>
  </div>

  {/* Save Button below both columns 👇 */}
  <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
    <button
      type="submit"
      className="bg-[#351f78] text-white px-6 py-2 rounded-3xl hover:opacity-90"
    >
      Save Changes
    </button>
  </div>
</form>

     </div>
  </div>
 
  );
}
