import { LearningAdminShell } from "@/components/demo/admin/learning-admin-shell";

export default function AdminLearningLayout({ children }: { children: React.ReactNode }) {
  return <LearningAdminShell>{children}</LearningAdminShell>;
}
