export default function extractRelevantMessageInfoForChurning(message) {
  return {
    // Extract the date and author so we can display the most recent authors.
    date: message.date,
    // (we only display the email address, not the display name)
    authorNameish: message.author.name || message.author.address,
    // Extract the subject so we can display the subject if there's only
    // one message/conversation.
    subject: message.subject
  };
}
