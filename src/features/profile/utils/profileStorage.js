function getStorageKey(userId) {
  return `l'essentiel-profile-${userId}`;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// CONSTRUCTION DU PROFIL D'APRÉS L'API
export function getCustomerProfile(user) {
  const defaultProfile = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",

    shippingAddress: {
      name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
      street: user?.address?.address ?? "",
      postalCode: String(user?.address?.postalCode ?? ""),
      city: String(user?.address?.city ?? ""),
      country: String(user?.address?.country ?? "France"),
    },

    billingSameAsShipping: true,

    billingAddress: {
      name: "",
      street: "",
      postalCode: "",
      city: "",
      country: "",
    },
  };

  if (!user?.id) {
    return defaultProfile;
  }

  try {
    const savedProfile = JSON.parse(
      localStorage.getItem(getStorageKey(user.id)),
    );

    if (!isObject(savedProfile)) {
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...savedProfile,
      shippingAddress: isObject(savedProfile.shippingAddress)
        ? { ...defaultProfile.shippingAddress, ...savedProfile.shippingAddress }
        : defaultProfile.shippingAddress,
      billingAddress: isObject(savedProfile.billingAddress)
        ? { ...defaultProfile.billingAddress, ...savedProfile.billingAddress }
        : defaultProfile.billingAddress,
    };
  } catch (error) {
    console.warn("Profil local illisible :", error);
    return defaultProfile;
  }
}

//ENREGISTRER LES MODIFICATIONS
export function saveCustomerProfile(user, profile) {
  if (!user?.id) {
    throw new Error("Utilisateur non identifié");
  }
  localStorage.setItem(getStorageKey(user.id), JSON.stringify(profile));
}
