import CustomerSidebar from "../common/CustomerSidebar";

export default function EditProfile() {
  return (
    <div className="min-h-screen max-w-screen flex  bg-white">
      <CustomerSidebar />
      <div className="flex-1 items-center justify-center p-12 space-y-8 ml-12">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <form className="space-y-6">
          <div className="border-b-2 border-gray-300 pb-4 rounded-full w-32 h-32 flex items-center justify-center text-lg font-bold text-white bg-[#351f78]">
            Edit image
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              placeholder="Username"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              placeholder="Email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              placeholder="Password"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              placeholder="Confirm Password"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
        </form>
      </div>

      <div className="flex-1 items-center justify-center p-12 space-y-12 ml-24 mt-6">
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#351f78] text-white px-6 py-2 rounded-3xl"
          >
            Save Changes
          </button>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              placeholder="First Name"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              placeholder="Last Name"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Of Birth
            </label>
            <input
              placeholder="Date Of Birth"
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              placeholder="Phone Number"
              type="tel"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              placeholder="Address"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-full shadow-sm p-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
