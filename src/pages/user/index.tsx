import { api } from "~/utils/api";

const UserPage = () => {
  const { mutate: createUser } = api.user.create.useMutation({
    onSuccess: (data) => {
      console.log("User created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    }
  });

  const handleCreateUser = () => {
    createUser({
      username: "exampleUser", // Replace with actual input values
      password: "examplePassword",
    });
  };

  return (
    <div>
      <h1>User Page</h1>
      <p>Welcome to the user page!</p>
      <button onClick={handleCreateUser}>Click here to create a user</button>
    </div>
  );
};

export default UserPage;
