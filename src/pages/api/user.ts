import { NextApiRequest, NextApiResponse } from "next";

//Mock data to simulate a database of user
interface User {
  username: string;
  name: String;
  email: string;
  homeAddress: string;
}

const users: User[] = [
  {
    username: "johnDoe",
    name: "John Doe",
    email: "john@example.com",
    homeAddress: "123 Main St",
  },
  {
    username: "JaneDoe",
    name: "Jane Doe",
    email: "jane@exmpale.com",
    homeAddress: "456 Elm St",
  },
];

// API route handler for GET requests to fetch a user by username
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log("hello");
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }
    console.log(username);
    const user = users.find((u) => u.username === username);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method ${req.method} Not Allowed" });
  }
}
