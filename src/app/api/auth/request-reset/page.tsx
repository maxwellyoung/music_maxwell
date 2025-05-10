// 4. Email it
await sendResetEmail({ to: email, token: raw });
