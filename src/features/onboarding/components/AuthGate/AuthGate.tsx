import { LoginScreen } from "./LoginScreen";
import { MagicLinkSentScreen } from "./MagicLinkSentScreen";
import { MagicLinkConfirmScreen } from "./MagicLinkConfirmScreen";
import { CompletingMagicLink } from "./CompletingMagicLink";

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
