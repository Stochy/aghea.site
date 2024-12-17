export default async function handler(req, res) {
  const USER_ID = "982268021143896064";
  const response = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
  
  if (!response.ok) {
    return res.status(500).json({ error: "Failed to fetch data from Lanyard API" });
  }

  const data = await response.json();
  res.status(200).json(data);
}