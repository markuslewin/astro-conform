// The action we want to perform on the server
export async function sendMessage(input: { email: string; message: string }) {
  console.log("Send message", { input });
  return { sent: true };
}
