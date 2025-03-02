import { BusinessProfileType } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

type ProfileContextType = {
  profile: BusinessProfileType | null;
  saveProfile: (profile: Omit<BusinessProfileType, "id">) => void;
  updateProfile: (profile: Partial<BusinessProfileType>) => void;
  loading: boolean;
  error: string | null;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<BusinessProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        //simulate API Call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const savedProfile = localStorage.getItem("biztoso-profile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async (profile: Omit<BusinessProfileType, "id">) => {
    //simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const profileWithId = { ...profile, id: Date.now() };
    setProfile(profileWithId as BusinessProfileType);
    localStorage.setItem("biztoso-profile", JSON.stringify(profileWithId));
  };

  const updateProfile = async (profile: Partial<BusinessProfileType>) => {
    if (!profile) return;
    //simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile((prevProfile) => {
      if (!prevProfile) return null;
      const updatedProfile = { ...prevProfile, ...profile };
      localStorage.setItem("biztoso-profile", JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        saveProfile,
        updateProfile,
        loading,
        error,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
