export async function userLogin(
  applicationId: string,
  formData: { email: string; password: string }
) {
  const response = await fetch(`http://localhost:3000/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      ...formData,
    }),
  });
  return response.json();
}
