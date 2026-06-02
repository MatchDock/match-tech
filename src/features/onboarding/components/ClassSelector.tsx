import { Terminal } from "lucide-react";
import { Card } from "../../../shared/components/ui/Card";
import type { OnboardingForm } from "../types";

interface Props {
  roles: string[];
  form: OnboardingForm;
  onToggleRole: (role: string) => void;
}

export function ClassSelector({ roles, form, onToggleRole }: Props) {
  return (
    <Card variant="white" padding="none" className="border-4 shadow-[12px_12px_0_0_#B8FF29] overflow-hidden">
      <div className="bg-neo-lime p-4 border-b-4 border-neo-black">
        <h2 className="text-2xl font-heading text-neo-black flex items-center gap-2">
          <Terminal className="w-6 h-6" /> 02. CLASSES (1st / 2nd)
        </h2>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {roles.map(role => {
            const isPrimary   = form.primaryRole === role;
            const isSecondary = form.secondaryRoles.includes(role);

            return (
              <button
                key={role}
                type="button"
                onClick={() => onToggleRole(role)}
                className={`neo-border px-4 py-2 font-black text-[10px] uppercase transition-all flex items-center gap-2
                  hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0
                  ${isPrimary
                    ? "bg-neo-black text-neo-lime shadow-[6px_6px_0_0_#B8FF29]"
                    : isSecondary
                    ? "bg-neo-cyan text-neo-black shadow-[6px_6px_0_0_#000]"
                    : "bg-white text-neo-black hover:bg-neo-lime/30"
                  }`}
              >
                {role}
                {isPrimary  && <span className="text-[10px] bg-neo-lime text-black px-2 py-0.5 rounded-sm">PRIMARY</span>}
                {isSecondary && <span className="text-[10px] bg-neo-black text-white px-2 py-0.5 rounded-sm">SEC</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
