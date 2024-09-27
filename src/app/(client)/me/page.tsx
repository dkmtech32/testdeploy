import { AccountResType } from "@/schemaValidations/account.schema";
import ProfileForm from "./profile-form";

export default function MeProfile() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
      <ProfileForm />
    </div>
  );
}
