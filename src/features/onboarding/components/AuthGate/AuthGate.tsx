import { CompletingMagicLink } from "./CompletingMagicLink";
import { LoginScreen } from "./LoginScreen";
import { MagicLinkConfirmScreen } from "./MagicLinkConfirmScreen";
import { MagicLinkSentScreen } from "./MagicLinkSentScreen";

interface Props {
  signIn: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  magicLinkSent: boolean;
  magicLinkEmail: string;
  completingMagicLink: boolean;
  pendingMagicLinkUrl: string | null;
  resetMagicLinkState: () => void;
  confirmMagicLinkEmail: (email: string) => Promise<void>;
}

export function AuthGate({
  signIn,
  sendMagicLink,
  magicLinkSent,
  magicLinkEmail,
  completingMagicLink,
  pendingMagicLinkUrl,
  resetMagicLinkState,
  confirmMagicLinkEmail,
}: Props) {
  if (completingMagicLink) return <CompletingMagicLink />;

  if (pendingMagicLinkUrl)
    return (
      <MagicLinkConfirmScreen
        confirmMagicLinkEmail={confirmMagicLinkEmail}
        resetMagicLinkState={resetMagicLinkState}
      />
    );

  if (magicLinkSent)
    return (
      <MagicLinkSentScreen
        magicLinkEmail={magicLinkEmail}
        sendMagicLink={sendMagicLink}
        resetMagicLinkState={resetMagicLinkState}
      />
    );

  return <LoginScreen signIn={signIn} sendMagicLink={sendMagicLink} />;
}
