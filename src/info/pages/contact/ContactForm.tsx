import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY_HERE',
          name: formData.name,
          email: formData.email,
          subject: `Nothric Contact: Message from ${formData.name}`,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setErrorMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Failed to send message. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-success-state">
        <div className="success-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Message Sent!</h3>
        <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
        <button className="reset-btn" onClick={() => setIsSubmitted(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="premium-contact-form" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="form-error-banner">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="input-group">
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder=" "
          disabled={isSubmitting}
        />
        <label htmlFor="name" className="input-label">Name</label>
      </div>

      {/* Email Input */}
      <div className="input-group">
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
          disabled={isSubmitting}
        />
        <label htmlFor="email" className="input-label">Email</label>
      </div>

      {/* Message Input */}
      <div className="input-group">
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder=" "
          disabled={isSubmitting}
        />
        <label htmlFor="message" className="input-label">Message</label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Submit'}
      </button>
    </form>
  );
}
