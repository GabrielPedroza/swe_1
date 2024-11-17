import { api } from "~/utils/api";

const UserPage = () => {
  // API Hooks
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      console.log("User created successfully");
    },
    onError: (error) => {
      console.error("Error creating user:", error.message);
    },
  });

  const { data: userData, error: userError, refetch } =
    api.getUser.getUserByUsername.useQuery(
      { username: "exampleUser" }, // Replace with actual input value
      {
        enabled: false, // Prevents automatic fetching until you trigger it manually
      }
    );

  const updateUser = api.updateUser.updateUser.useMutation({
    onSuccess: () => {
      console.log("User updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user:", error.message);
    },
  });

  const createCreditCard = api.createCreditCard.createCreditCard.useMutation({
    onSuccess: () => {
      console.log("Credit card created successfully");
    },
    onError: (error) => {
      console.error("Error creating credit card:", error.message);
    },
  });

  // Handlers for API calls
  const handleCreateUser = () => {
    createUser.mutate({
      username: `exampleUser_${Date.now()}`, // Appends a timestamp to make it unique
      password: "examplePassword", // Replace with actual input value
    });
  };  

  const handleGetUser = () => {
    refetch();
  };

  const handleUpdateUser = () => {
    updateUser.mutate(
      {
        username: "exampleUser_1731808444196", // Replace with the actual username
        updates: {
          password: "updatedPassword123", // Replace with actual fields to update
        },
      },
      {
        onSuccess: () => {
          refetch(); // Fetch the latest user data after a successful update
        },
        onError: (error) => {
          console.error("Error updating user:", error.message);
        },
      }
    );
  };
  

  const handleCreateCreditCard = () => {
    createCreditCard.mutate({
      username: "exampleUser", // Replace with actual input
      cardDetails: {
        cardNumber: "1234567812345678", // Replace with actual input
        cardHolderName: "John Doe", // Replace with actual input
        expirationDate: "2024-12-31", // Replace with actual input
      },
    });
  };

  // UI with buttons for each API
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">User Page</h1>

      <div className="space-y-2">
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create User
        </button>

        <button
          onClick={handleGetUser}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Get User
        </button>

        <button
          onClick={handleUpdateUser}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Update User
        </button>

        <button
          onClick={handleCreateCreditCard}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Create Credit Card
        </button>
      </div>

      <div className="mt-6">
        {userData && (
          <div>
            <h2 className="text-md font-semibold">Retrieved User Data:</h2>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}
        {userError && (
          <div className="text-red-500">Error retrieving user: {userError.message}</div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
