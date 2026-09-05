const Svg = ({ children, size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
)

export const HomeIcon = () => <Svg><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></Svg>
export const TrackIcon = () => <Svg><path d="M5 7h14l-1 12H6L5 7Z"/><path d="M8 7a4 4 0 0 1 8 0"/><path d="M9 12h6"/></Svg>
export const ContactIcon = () => <Svg><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></Svg>
export const CartIcon = () => <Svg><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.5 11h10l2-8H6"/></Svg>
export const CheckIcon = () => <Svg><path d="m5 12 4 4L19 6"/></Svg>
export const InstagramIcon = () => <Svg><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></Svg>
export const WhatsAppIcon = () => <Svg><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-4.5A8.5 8.5 0 1 1 20.5 11.5Z"/><path d="M8.4 7.8c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.7.8c-.2.2-.2.4-.1.6.5 1 1.3 1.9 2.4 2.5.2.1.4.1.6-.1l.9-1c.2-.2.4-.3.7-.1l1.8.8c.3.1.4.3.4.5 0 .7-.3 1.4-.8 1.8-.5.4-1.2.7-2 .7-1.4 0-3.5-.7-5.4-2.5-1.5-1.4-2.7-3.3-2.9-4.7-.1-.7.1-1.3.4-1.8.3-.5.8-.8 1.4-.8"/></Svg>
export const MenuIcon = () => <Svg><path d="M4 7h16M4 12h16M4 17h16"/></Svg>
export const CloseIcon = () => <Svg><path d="M6 6l12 12M18 6 6 18"/></Svg>
export const PlusIcon = () => <Svg><path d="M12 5v14M5 12h14"/></Svg>
export const BoxIcon = () => <Svg><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7v10l8 4 8-4V7M12 11v10"/></Svg>
export const TruckIcon = () => <Svg><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></Svg>
export const AdminIcon = () => <Svg><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Svg>
export const EditIcon = () => <Svg><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></Svg>
export const TrashIcon = () => <Svg><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></Svg>
export const CopyIcon = () => <Svg><rect x="9" y="9" width="11" height="11" rx="2"/><rect x="4" y="4" width="11" height="11" rx="2"/></Svg>
export const LogoutIcon = () => <Svg><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h7v18h-7"/></Svg>
