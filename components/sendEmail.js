import * as MailComposer from 'expo-mail-composer';

export const sendBookRecommendation = async (bookDetails) => {
    // check if the MailComposer is available (has to be the default mail app on IOS)
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
        alert("Email service is not available on this device");
        return;
    }

    const { title, authors, description, coverImage } = bookDetails;

    //construct the email
    const emailBody = `
    <h2>${title}</h2>
    <p><strong>Author:</strong> ${authors}</p>
    <p><strong>Description:</strong> ${description}</p>
  `;

    // configure the email
    const options = {
        recipients: [], //empty recipent that the user will write out in the email app
        subject: `Check out this book: ${title}`,
        body: emailBody,
        isHtml: true,
    };

    try {
        const result = await MailComposer.composeAsync(options);
        if (result.status === "sent") {
            alert("Email sent successfully!");
        } else {
            alert("Email not sent.");
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
