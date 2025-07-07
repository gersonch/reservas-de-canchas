export const sections = [
  {
    title: "Cuenta",
    data: [
      {
        icon: "user-cog",
        color: "#4CAF50",
        label: "Configuración de perfil",
        href: "profile/profile-configuration",
      },
      {
        icon: "heart",
        color: "#E53935",
        label: "Mis favoritos",
        href: "profile/favourites",
      },
      {
        icon: "credit-card",
        color: "#1976D2",
        label: "Métodos de pago",
        href: "/metodos-pago",
      },
    ],
  },
  {
    title: "Torneos",
    data: [
      {
        icon: "trophy",
        color: "#FFD700",
        label: "Mis torneos",
        href: "/(mis-torneos)",
      },
      {
        icon: "chart-bar",
        color: "#4CAF50",
        label: "Mis estadísticas",
        href: "/statics",
      },
    ],
  },
];
