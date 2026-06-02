import { AccessDeniedState as SharedAccessDeniedState } from "../../../shared/components/states/AccessDeniedState";

export function AccessDeniedState() {
  return <SharedAccessDeniedState message="Você precisa completar o onboarding para acessar o feed de matches." />;
}