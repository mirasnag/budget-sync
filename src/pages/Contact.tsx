// rrd imports
import { ActionFunction, Form, useActionData } from "react-router-dom";

// library imports
import { FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";
import emailjs from "emailjs-com";
import { DataItem } from "../api/helpers";

// action
export const contactAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  if (_action === "submit-feedback") {
    try {
      const serviceID = "service_ep3cadg";
      const templateID = "template_vqtfwwk";
      const userID = "o_s01uBQea5LGHmp4";

      await emailjs.send(
        serviceID,
        templateID,
        { message: values.feedback },
        userID
      );

      return { status: "success", message: "Feedback submitted successfully!" };
    } catch (e) {
      throw new Error("There was an error submitting your feedback");
    }
  }

  return null;
};

const Contact: React.FC = () => {
  const actionData = useActionData() as DataItem;

  return (
    <div className="contact component">
      <h2>Contact Me</h2>

      <div className="contact-section">
        <h3>Get in Touch</h3>
        <p>
          If you have any questions about this project or want to collaborate,
          feel free to reach out to me:
        </p>
        <ul>
          <li>
            Email: <span>nagashbek.miras27@gmail.com</span>
          </li>
          <li>
            Phone (KAZ): <span>+ 7 777 125 9316</span>
          </li>
          <li>
            Phone (KOR): <span>+ 8210 2134 0571</span>
          </li>
        </ul>
      </div>

      <div className="contact-section">
        <h3>Connect with Me</h3>
        <div className="social-links">
          <a
            href="https://github.com/mirasnag"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/miras-nagashbek-8250a7254"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://t.me/mirai_nagai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram />
          </a>
        </div>
      </div>

      <div className="contact-section">
        <h3>Submit Feedback</h3>
        <Form method="post" className="contact-form">
          <input type="hidden" name="_action" value="submit_feedback" />
          <label htmlFor="feedback">Any suggestions or feedback?</label>
          <textarea
            id="feedback"
            name="feedback"
            rows={4}
            placeholder="I'd love to hear your thoughts!"
          />
          <button type="submit" className="btn">
            Submit
          </button>
        </Form>
        {actionData && (
          <div className={`form-message ${actionData.status}`}>
            <p>{actionData.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
