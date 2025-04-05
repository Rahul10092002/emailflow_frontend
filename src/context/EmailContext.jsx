import { createContext, useContext, useState } from "react";

const EmailContext = createContext();

export function EmailProvider({ children }) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const setRecipientFromLead = (lead) => {
    if (lead && lead.email) {
      setRecipientEmail(lead.email);
    }
  };

  return (
    <EmailContext.Provider
      value={{ recipientEmail, setRecipientEmail, setRecipientFromLead }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  return useContext(EmailContext);
}
