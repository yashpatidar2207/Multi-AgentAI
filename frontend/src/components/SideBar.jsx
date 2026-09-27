import { useEffect, useState } from "react";
import {
  Coins,
  LogOut,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenSquare,
  Plus,
  User,
} from "lucide-react";

import { getConversations } from "../features/getConversations.js";

import {
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice.js";

import { setUserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

import logOut from "../features/logOut.js";
import { setMessages } from "../redux/messageSlice.js";

import BillingPage from "./BillingPage.jsx";

function SideBar() {
  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  const { userData } = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Billing state
  const [showBilling, setShowBilling] = useState(false);

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  /* =========================================================
     NEW CHAT
  ========================================================= */

  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
    dispatch(setMessages([]));
  };

  /* =========================================================
     OPEN BILLING
     
     Important:
     1. Close mobile sidebar
     2. Open billing page
  ========================================================= */

  const handleOpenBilling = () => {
    // Close mobile sidebar first
    setMobileOpen(false);

    // Then open Billing
    setShowBilling(true);
  };

  /* =========================================================
     CLOSE BILLING
  ========================================================= */

  const handleCloseBilling = () => {
    setShowBilling(false);
  };

  /* =========================================================
     GET CONVERSATIONS
  ========================================================= */

  useEffect(() => {
    const getConv = async () => {
      try {
        const data = await getConversations();

        dispatch(setConversations(data));
      } catch (error) {
        console.log("Error fetching conversations:", error);
      }
    };

    getConv();
  }, [userData, dispatch]);

  /* =========================================================
     COLLAPSED DESKTOP SIDEBAR
     Only visible >= lg
  ========================================================= */

  if (collapsed) {
    return (
      <div
        className="
          hidden
          lg:flex
          flex-col
          items-center
          w-[56px]
          h-screen
          shrink-0
          bg-[#0d0f14]
          border-r
          border-white/[0.06]
          py-4
          gap-1
        "
      >
        {/* Expand Sidebar */}
        <button
          onClick={() => setCollapsed(false)}
          className="
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-xl
            text-slate-500
            hover:text-slate-200
            hover:bg-white/[0.05]
            transition-colors
            duration-150
            bg-transparent
            border-none
            cursor-pointer
            mb-1
          "
        >
          <PanelRightIcon size={18} />
        </button>

        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className="
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-xl
            text-slate-500
            hover:text-slate-200
            hover:bg-white/[0.05]
            transition-colors
            duration-150
            bg-transparent
            border-none
            cursor-pointer
          "
        >
          <Plus size={18} />
        </button>

        {/* Conversations */}
        <div
          className="
            flex-1
            w-full
            overflow-y-auto
            px-2.5
            pb-2
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv?._id;

            return (
              <div
                key={conv?._id}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  mb-0.5
                  px-3
                  py-2.5
                  rounded-[10px]
                  border
                  transition-colors
                  duration-150

                  ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent hover:bg-white/[0.05]"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    items-center
                    justify-center
                    shrink-0
                    w-[28px]
                    h-[28px]
                    rounded-lg
                    transition-colors
                    duration-150

                    ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }
                  `}
                >
                  <MessageSquare size={14} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsed User Avatar */}
        <div className="relative shrink-0 mt-2">
          {userData?.avatar && !imageError ? (
            <img
              className="
                w-9
                h-9
                rounded-[18px]
                object-cover
                border-2
                border-indigo-500/25
              "
              src={userData?.avatar}
              alt={userData?.name || "User"}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="
                w-9
                h-9
                rounded-[18px]
                bg-white/[0.06]
                flex
                items-center
                justify-center
              "
            >
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     NORMAL SIDEBAR
  ========================================================= */

  return (
    <>
      <div
        className="
          fixed
          lg:static
          inset-y-0
          left-0
          z-50
          w-[270px]
          h-screen
          shrink-0
          bg-[#0d0f14]
          border-r
          border-white/[0.09]
        "
      >
        <div className="flex flex-col h-full">
          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2.5
              px-4
              py-4
              border-b
              border-white/[0.06]
            "
          >
            {/* Desktop Collapse */}
            <div
              className="
                hidden
                lg:flex
                items-center
                justify-center
                w-7
                h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors
                duration-150
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftIcon size={18} />
            </div>

            {/* Logo */}
            <span
              className="
                text-[16px]
                font-semibold
                text-slate-100
                tracking-tight
                flex-1
              "
            >
              MultiAI
            </span>

            {/* Free Badge */}
            <span
              className="
                text-[10px]
                font-medium
                text-indigo-400
                bg-indigo-500/10
                border
                border-indigo-500/20
                px-2
                py-0.5
                rounded-full
                tracking-wide
              "
            >
              {userData?.plan || "free"}
            </span>

            {/* New Chat Icon */}
            <button
              className="
                flex
                items-center
                justify-center
                w-7
                h-7
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/[0.05]
                transition-colors
                duration-150
                bg-transparent
                border-none
                cursor-pointer
              "
              onClick={handleNewChat}
              title="New Chat"
            >
              <PenSquare size={16} />
            </button>
          </div>

          {/* =================================================
              NEW CHAT BUTTON
          ================================================= */}

          <div className="px-4 pt-4 pb-1">
            <button
              onClick={handleNewChat}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-medium
                text-white
                bg-gradient-to-br
                from-indigo-500
                to-violet-700
                rounded-xl
                py-[10px]
                border-none
                cursor-pointer
                hover:opacity-90
                transition-opacity
                duration-150
              "
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          {/* =================================================
              RECENTS TITLE
          ================================================= */}

          {conversations.length === 0 ? (
            <div
              className="
                px-5
                pt-4
                pb-1.5
                text-[10.5px]
                font-semibold
                uppercase
                tracking-widest
                text-slate-600
              "
            >
              No Recent Conversations
            </div>
          ) : (
            <div
              className="
                px-5
                pt-4
                pb-1.5
                text-[10.5px]
                font-semibold
                uppercase
                tracking-widest
                text-slate-600
              "
            >
              Recents
            </div>
          )}

          {/* =================================================
              CHAT LIST
          ================================================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              px-2.5
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {conversations.map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv?._id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`
                    flex
                    items-center
                    gap-2.5
                    cursor-pointer
                    mb-0.5
                    px-3
                    py-2.5
                    rounded-[10px]
                    border
                    transition-colors
                    duration-150

                    ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                        : "bg-transparent border-transparent hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {/* Conversation Icon */}
                  <div
                    className={`
                      flex
                      items-center
                      justify-center
                      shrink-0
                      w-[28px]
                      h-[28px]
                      rounded-lg
                      transition-colors
                      duration-150

                      ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-white/[0.05] text-slate-500"
                      }
                    `}
                  >
                    <MessageSquare size={14} />
                  </div>

                  {/* Conversation Title */}
                  <span
                    className={`
                      text-[13px]
                      font-medium
                      truncate

                      ${isActive ? "text-slate-100" : "text-slate-300"}
                    `}
                  >
                    {conv?.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="mx-2.5 h-px bg-white/[0.06]" />

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="px-3.5 py-3.5">
            {userData ? (
              <div
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-xl
                  px-3
                  py-2.5
                  hover:bg-white/[0.05]
                  transition-colors
                  duration-150
                "
              >
                {/* User Avatar */}
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="
                        w-9
                        h-9
                        rounded-[18px]
                        object-cover
                        border-2
                        border-indigo-500/25
                      "
                      src={userData?.avatar}
                      alt={userData?.name || "User"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className="
                        w-9
                        h-9
                        rounded-[18px]
                        bg-white/[0.06]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="
                      text-[13.5px]
                      font-semibold
                      text-slate-100
                      truncate
                    "
                  >
                    {userData?.name || "Guest"}
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-slate-600
                      mt-px
                    "
                  >
                    {userData?.plan}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-1">
                  {/* =================================================
                      COINS / BILLING BUTTON

                      Mobile sidebar close
                      + Billing open
                  ================================================= */}

                  <button
                    onClick={handleOpenBilling}
                    aria-label="Open Billing"
                    title="Billing"
                    className="
                      flex
                      items-center
                      justify-center
                      w-7
                      h-7
                      rounded-[15px]
                      border-none
                      bg-transparent
                      text-yellow-600
                      cursor-pointer
                      hover:bg-white/[0.08]
                      hover:text-yellow-400
                      transition-all
                      duration-150
                    "
                  >
                    <Coins size={20} />
                  </button>

                  {/* =================================================
                      LOGOUT
                  ================================================= */}

                  <button
                    className="
                      flex
                      items-center
                      justify-center
                      w-7
                      h-7
                      rounded-[15px]
                      border-none
                      bg-transparent
                      text-slate-600
                      cursor-pointer
                      hover:bg-white/[0.08]
                      hover:text-slate-400
                      transition-all
                      duration-150
                    "
                    onClick={() => {
                      logOut();
                      dispatch(setUserData(null));
                    }}
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              /* =================================================
                 LOGIN
              ================================================= */

              <div className="px-2">
                <button
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    font-medium
                    text-slate-200
                    bg-white/[0.05]
                    border
                    border-white/[0.08]
                    rounded-xl
                    py-[11px]
                    cursor-pointer
                    hover:bg-white/[0.08]
                    transition-colors
                    duration-150
                  "
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          BILLING PAGE

          Billing is rendered outside the visual sidebar content,
          but controlled by SideBar state.
      ========================================================= */}

      <BillingPage open={showBilling} onClose={handleCloseBilling} />
    </>
  );
}

export default SideBar;
